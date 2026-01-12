'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface VipPackage {
  type: 'one_day' | 'one_week' | 'one_month' | 'one_year';
  label: string;
  price: number;
  duration: string;
}

const VIP_PACKAGES: VipPackage[] = [
  { type: 'one_day', label: 'VIP 1 Ngày', price: 1000, duration: '1 ngày' },
  { type: 'one_week', label: 'VIP 1 Tuần', price: 1000, duration: '7 ngày' },
  { type: 'one_month', label: 'VIP 1 Tháng', price: 1000, duration: '30 ngày' },
  { type: 'one_year', label: 'VIP 1 Năm', price: 1000, duration: '365 ngày' },
];

interface VipPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VipPackageModal({ isOpen, onClose }: VipPackageModalProps) {
  const { data: session } = useSession();
  const [selectedPackage, setSelectedPackage] = useState<VipPackage | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'cancelled' | null>(null);

  if (!isOpen) return null;

  const handleSelectPackage = (pkg: VipPackage) => {
    setSelectedPackage(pkg);
    setQrCode(null);
    setOrderCode(null);
    setError(null);
    setPaymentStatus(null);
  };

  const handleCreatePayment = async () => {
    if (!selectedPackage || !session?.accessToken) {
      setError('Vui lòng chọn gói VIP');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/payment/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            vipPackageType: selectedPackage.type,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Tạo giao dịch thất bại' }));
        throw new Error(errorData.message || 'Tạo giao dịch thất bại');
      }

      const data = await response.json();
      
      // Debug log
      console.log('Payment response:', {
        hasQrCode: !!data.qrCode,
        qrCodeLength: data.qrCode?.length,
        qrCodePreview: data.qrCode ? data.qrCode.substring(0, 50) + '...' : null,
        orderCode: data.orderCode,
      });
      
      // PayOS trả về BASE64 PNG (không có prefix)
      // Frontend cần thêm prefix data:image/png;base64,
      if (!data.qrCode) {
        throw new Error('Không nhận được QR code từ server');
      }
      
      setQrCode(data.qrCode);
      setOrderCode(data.orderCode);

      // Poll payment status
      if (data.orderCode) {
        pollPaymentStatus(data.orderCode);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tạo giao dịch');
    } finally {
      setIsLoading(false);
    }
  };

  const pollPaymentStatus = async (orderCode: string) => {
    const maxAttempts = 60; // 60 lần, mỗi 5 giây = 5 phút
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/payment/status/${orderCode}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setPaymentStatus(data.status); // Cập nhật status để render UI
          
          if (data.status === 'paid') {
            clearInterval(interval);
            // Hiển thị thông báo thành công trong 2 giây trước khi reload
            setTimeout(() => {
              onClose();
              // Reload page to update VIP status
              window.location.reload();
            }, 2000);
          } else if (data.status === 'cancelled' || data.status === 'cancel') {
            clearInterval(interval);
            setError('Giao dịch đã bị hủy');
          }
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 5000); // Poll every 5 seconds
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Đóng"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!qrCode ? (
          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Chọn Gói VIP</h2>
            <p className="mb-6 text-sm text-slate-600">Chọn gói VIP phù hợp với bạn:</p>

            <div className="space-y-3 mb-6">
              {VIP_PACKAGES.map((pkg) => (
                <div
                  key={pkg.type}
                  onClick={() => handleSelectPackage(pkg)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPackage?.type === pkg.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{pkg.label}</h3>
                      <p className="text-sm text-slate-600">Thời hạn: {pkg.duration}</p>
                    </div>
                    <div className="font-bold text-xl text-blue-600">
                      {pkg.price.toLocaleString('vi-VN')} VND
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleCreatePayment}
              disabled={!selectedPackage || isLoading}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang tạo giao dịch...' : 'Tạo Giao Dịch'}
            </button>
          </div>
        ) : paymentStatus === 'paid' ? (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-green-600">Thanh toán thành công!</h2>
            <p className="mb-4 text-slate-600">
              Gói VIP của bạn đã được kích hoạt thành công.
            </p>
            {selectedPackage && (
              <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="font-semibold text-green-900">Gói: {selectedPackage.label}</p>
                <p className="text-sm text-green-700">
                  Số tiền: {selectedPackage.price.toLocaleString('vi-VN')} VND
                </p>
              </div>
            )}
            <p className="text-sm text-slate-500 mb-4">
              Đang cập nhật thông tin tài khoản...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="mb-2 text-xl font-bold text-slate-900">Quét QR Code để thanh toán</h2>
            <p className="mb-6 text-sm text-slate-600">
              Mở ứng dụng MB Bank và quét QR code bên dưới để thanh toán
            </p>

            <div className="mb-6 flex justify-center">
              <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
                {qrCode ? (
                  <img
                    src={`data:image/png;base64,${qrCode}`}
                    alt="QR Code thanh toán"
                    className="w-64 h-64"
                    onError={(e) => {
                      console.error('QR Code image load error:', e);
                      console.error('QR Code value:', qrCode?.substring(0, 100));
                    }}
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center text-slate-400">
                    Đang tải QR code...
                  </div>
                )}
              </div>
            </div>

            {selectedPackage && (
              <div className="mb-4 space-y-2">
                <p className="font-bold text-slate-900">Gói: {selectedPackage.label}</p>
                <p className="text-slate-600">
                  Số tiền: {selectedPackage.price.toLocaleString('vi-VN')} VND
                </p>
              </div>
            )}

            <div className="mb-4">
              {paymentStatus === 'pending' && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-blue-700 font-medium">
                    Đang chờ thanh toán...
                  </p>
                </div>
              )}
            </div>

            <p className="mb-4 text-xs text-slate-500">
              Sau khi thanh toán thành công, gói VIP sẽ được kích hoạt tự động.
              <br />
              Vui lòng đợi vài giây...
            </p>

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";
import VipPackageModal from "@/components/payment/VipPackageModal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEST_API_URL ||
  "http://localhost:3001";

type Region = "bac" | "trung" | "nam" | null;

type Profile = {
  user_id: number;
  username: string;
  email: string;
  image_url?: string | null;
  account_status: string;
  created_at: string;
  address?: string | null;
  province?: string | null;
  region?: Region;
  vip_package_type?: "lifetime" | "one_day" | "one_week" | "one_month" | "one_year" | null;
  vip_expires_at?: string | null;
};

const REGION_LABELS: Record<Exclude<Region, null>, string> = {
  bac: "Miền Bắc",
  trung: "Miền Trung",
  nam: "Miền Nam",
};

const PROVINCES = [
  "Hà Nội",
  "Hồ Chí Minh City",
  "Hải Phòng",
  "Đà Nẵng",
  "Cần Thơ",
  "Huế",
  "Lai Châu",
  "Điện Biên",
  "Sơn La",
  "Lào Cai",
  "Lạng Sơn",
  "Cao Bằng",
  "Thái Nguyên",
  "Phú Thọ",
  "Bắc Ninh",
  "Hưng Yên",
  "Ninh Bình",
  "Quảng Ninh",
  "Thanh Hóa",
  "Nghệ An",
  "Hà Tĩnh",
  "Quảng Trị",
  "Quảng Ngãi",
  "Gia Lai",
  "Khánh Hòa",
  "Lâm Đồng",
  "Đắk Lắk",
  "Đồng Nai",
  "Tây Ninh",
  "Vĩnh Long",
  "Đồng Tháp",
  "Cà Mau",
  "An Giang",
];

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    province: "",
    region: "bac" as Region,
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showVipModal, setShowVipModal] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !accessToken) {
      setLoading(false);
      return;
    }
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await apiFetch<Profile>("/profile", {
          authToken: accessToken,
        });
        if (!isMounted) return;
        
        setProfile(data);
        // Không update session trong useEffect để tránh vòng lặp vô hạn
        // Session sẽ được update tự động khi refresh token hoặc sau payment thành công
        setFormData({
          username: data.username ?? "",
          email: data.email ?? "",
          address: data.address ?? "",
          province: data.province ?? "",
          region: (data.region ?? "bac") as Region,
        });
        setPreviewUrl(
          data.image_url ? `${API_BASE_URL}${data.image_url}` : null
        );
      } catch (err) {
        if (!isMounted) return;
        setError((err as Error).message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, [status, accessToken]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!accessToken) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const body = new FormData();
      body.append("username", formData.username);
      body.append("email", formData.email);
      body.append("address", formData.address);
      body.append("province", formData.province);
      if (formData.region) {
        body.append("region", formData.region);
      }
      if (avatar) {
        body.append("avatar", avatar);
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Cập nhật hồ sơ thất bại");
      }

      setProfile(data);
      setMessage("Cập nhật hồ sơ thành công!");
      await update({
        image_url: data.image_url,
        address: data.address,
        province: data.province,
        region: data.region,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
        Vui lòng đăng nhập để xem hồ sơ cá nhân.
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
        Không thể tải dữ liệu hồ sơ: {error || "Không xác định"}.
      </div>
    );
  }

  const displayAvatar =
    previewUrl || (profile.image_url && `${API_BASE_URL}${profile.image_url}`);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:w-1/3 space-y-4">
            <div className="relative">
              <img
                src={
                  displayAvatar ||
                  "https://ui-avatars.com/api/?name=CapyChina&background=10b981&color=fff"
                }
                className="w-40 h-40 rounded-full object-cover border-4 border-emerald-100 shadow"
                alt="Avatar"
              />
              <label className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.6}
                    d="M15.172 7l-2.586-2.586a2 2 0 00-1.414-.586H6a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-.586-1.414L15.172 7z"
                  />
                </svg>
              </label>
            </div>
            <p className="text-sm text-gray-500 text-center md:text-left">
              Nhấn vào biểu tượng bút để đổi ảnh
            </p>
          </div>

          <div className="md:w-2/3 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Số nhà, đường, quận..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tỉnh/Thành phố
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                >
                  <option value="">Chọn tỉnh/thành</option>
                  {PROVINCES.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Miền
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.region ?? "bac"}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value as Region })
                  }
                >
                  <option value="bac">Miền Bắc</option>
                  <option value="trung">Miền Trung</option>
                  <option value="nam">Miền Nam</option>
                </select>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-wrap gap-4 text-sm text-emerald-800">
              <div>
                <span className="font-semibold">Trạng thái:</span>{" "}
                {profile.account_status === "vip" ? "VIP" : "Khách thường"}
              </div>
              {profile.account_status === "vip" && (
                <>
                  <div>
                    <span className="font-semibold">Gói VIP:</span>{" "}
                    {profile.vip_package_type
                      ? profile.vip_package_type === "lifetime"
                        ? "Vĩnh viễn"
                        : profile.vip_package_type === "one_day"
                        ? "1 Ngày"
                        : profile.vip_package_type === "one_week"
                        ? "1 Tuần"
                        : profile.vip_package_type === "one_month"
                        ? "1 Tháng"
                        : profile.vip_package_type === "one_year"
                        ? "1 Năm"
                        : profile.vip_package_type
                      : "Chưa cập nhật"}
                  </div>
                  <div>
                    <span className="font-semibold">Hạn VIP:</span>{" "}
                    {profile.vip_expires_at
                      ? `${new Date(profile.vip_expires_at).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })} ${new Date(profile.vip_expires_at).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : profile.vip_package_type === "lifetime"
                      ? "Vĩnh viễn"
                      : "Chưa cập nhật"}
                  </div>
                </>
              )}
              <div>
                <span className="font-semibold">Ngày tạo:</span>{" "}
                {new Date(profile.created_at).toLocaleDateString("vi-VN")}
              </div>
              <div>
                <span className="font-semibold">Miền:</span>{" "}
                {profile.region ? REGION_LABELS[profile.region] : "Chưa cập nhật"}
              </div>
            </div>

            {profile.account_status === "normal" && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-yellow-900 mb-1">
                      Nâng cấp VIP
                    </h3>
                    <p className="text-sm text-yellow-800">
                      Trải nghiệm đầy đủ tính năng với tài khoản VIP
                    </p>
                  </div>
                  <button
                    className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                    onClick={() => setShowVipModal(true)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    Nâng cấp ngay
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-4 py-2">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full md:w-auto px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Lưu thông tin"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal chọn gói VIP */}
      <VipPackageModal 
        isOpen={showVipModal} 
        onClose={() => setShowVipModal(false)} 
      />
    </div>
  );
}


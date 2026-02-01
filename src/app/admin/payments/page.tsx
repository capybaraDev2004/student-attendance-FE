"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { apiFetch, API_BASE } from "@/lib/api";

type PaymentStatus = "pending" | "paid" | "cancelled" | "expired" | "cancel";
type VipPackageType = "lifetime" | "one_day" | "one_week" | "one_month" | "one_year";

interface PaymentUser {
  user_id: number;
  username: string;
  email: string;
}

interface Payment {
  payment_id: number;
  user_id: number;
  order_code: string;
  amount: number;
  vip_package_type: VipPackageType;
  status: PaymentStatus;
  description: string | null;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  user: PaymentUser;
}

const STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Chờ xử lý",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
  cancel: "Đã hủy",
  expired: "Hết hạn",
};

const VIP_LABELS: Record<VipPackageType, string> = {
  one_day: "1 Ngày",
  one_week: "1 Tuần",
  one_month: "1 Tháng",
  one_year: "1 Năm",
  lifetime: "Vĩnh viễn",
};

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "expired", label: "Hết hạn" },
];

function formatDateTime(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

/** Trạng thái chuẩn hóa để gộp (cancel -> cancelled) */
function normalizeStatus(s: PaymentStatus): "pending" | "paid" | "cancelled" | "expired" {
  if (s === "cancel") return "cancelled";
  return s as "pending" | "paid" | "cancelled" | "expired";
}

const SUMMARY_STATUS_ORDER: { key: "pending" | "paid" | "cancelled" | "expired"; label: string; color: string }[] = [
  { key: "pending", label: "Chờ xử lý", color: "amber" },
  { key: "paid", label: "Đã thanh toán", color: "emerald" },
  { key: "cancelled", label: "Đã hủy", color: "red" },
  { key: "expired", label: "Hết hạn", color: "slate" },
];

export default function PaymentsManagement() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [editStatus, setEditStatus] = useState<PaymentStatus>("pending");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /** Danh sách năm có trong dữ liệu + vài năm gần đây */
  const yearOptions = useMemo(() => {
    const now = new Date().getFullYear();
    const fromData = [...new Set(payments.map((p) => new Date(p.created_at).getFullYear()))];
    const years = [...new Set([...fromData, now, now - 1, now - 2])].sort((a, b) => b - a);
    return years.map((y) => ({ value: String(y), label: `Năm ${y}` }));
  }, [payments]);

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated" || !accessToken) {
      setLoading(false);
      setErrorMessage("Bạn cần đăng nhập với quyền quản trị để truy cập trang này.");
      return;
    }
    fetchPayments(accessToken);
  }, [status, accessToken]);

  useEffect(() => {
    let filtered = payments;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.payment_id.toString().includes(term) ||
          String(p.order_code).includes(term) ||
          p.user?.username?.toLowerCase().includes(term) ||
          p.user?.email?.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) =>
        statusFilter === "cancelled"
          ? (p.status === "cancelled" || p.status === "cancel")
          : p.status === statusFilter
      );
    }
    if (yearFilter !== "all") {
      const y = parseInt(yearFilter, 10);
      filtered = filtered.filter((p) => new Date(p.created_at).getFullYear() === y);
    }
    if (monthFilter !== "all") {
      const m = parseInt(monthFilter, 10);
      filtered = filtered.filter((p) => new Date(p.created_at).getMonth() + 1 === m);
    }
    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter, monthFilter, yearFilter]);

  /** Tổng số tiền và số giao dịch theo trạng thái — tính theo dữ liệu đã lọc (bảng bên dưới) */
  const totalsByStatus = useMemo(() => {
    const map: Record<string, { count: number; amount: number }> = {
      pending: { count: 0, amount: 0 },
      paid: { count: 0, amount: 0 },
      cancelled: { count: 0, amount: 0 },
      expired: { count: 0, amount: 0 },
    };
    filteredPayments.forEach((p) => {
      const key = normalizeStatus(p.status);
      map[key].count += 1;
      map[key].amount += p.amount;
    });
    return map;
  }, [filteredPayments]);

  const fetchPayments = async (token: string) => {
    try {
      setErrorMessage(null);
      const data = await apiFetch<Payment[]>("/admin/payments", { authToken: token });
      const list = Array.isArray(data) ? data : [];
      setPayments(list);
      setFilteredPayments(list);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách giao dịch:", error);
      setErrorMessage((error as Error)?.message || "Lỗi khi tải danh sách giao dịch");
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: "pdf" | "excel") => {
    if (!accessToken) {
      alert("Vui lòng đăng nhập lại.");
      return;
    }
    setExporting(true);
    try {
      const params = new URLSearchParams({ format });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (yearFilter !== "all") params.set("year", yearFilter);
      if (monthFilter !== "all") params.set("month", monthFilter);
      const url = `${API_BASE}/admin/payments/export?${params.toString()}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = "Xuất báo cáo thất bại.";
        try {
          const j = JSON.parse(text) as { message?: string };
          if (j?.message) msg = j.message;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }
      const blob = await res.blob();
      const ext = format === "pdf" ? "pdf" : "xlsx";
      const filename = `Bao-cao-giao-dich-${new Date().toISOString().slice(0, 10)}.${ext}`;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
      setExportOpen(false);
    } catch (error) {
      console.error("Lỗi xuất báo cáo:", error);
      alert((error as Error)?.message || "Lỗi khi xuất báo cáo");
    } finally {
      setExporting(false);
    }
  };

  const openEditModal = (p: Payment) => {
    setEditingPayment(p);
    setEditStatus(p.status);
    setEditDescription(p.description ?? "");
  };

  const closeEditModal = () => {
    setEditingPayment(null);
    setSaving(false);
  };

  const savePayment = async () => {
    if (!editingPayment || !accessToken) return;
    setSaving(true);
    try {
      const updated = await apiFetch<Payment>(
        `/admin/payments/${editingPayment.payment_id}`,
        {
          method: "PATCH",
          authToken: accessToken,
          body: JSON.stringify({
            status: editStatus,
            description: editDescription || undefined,
          }),
        }
      );
      setPayments((prev) =>
        prev.map((p) => (p.payment_id === updated.payment_id ? updated : p))
      );
      setFilteredPayments((prev) =>
        prev.map((p) => (p.payment_id === updated.payment_id ? updated : p))
      );
      closeEditModal();
      alert("Cập nhật giao dịch thành công.");
    } catch (error) {
      console.error("Lỗi cập nhật giao dịch:", error);
      alert((error as Error)?.message || "Lỗi khi cập nhật giao dịch");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (status !== "authenticated" || !accessToken) {
    return (
      <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
        Bạn cần đăng nhập với quyền quản trị để truy cập trang quản lý thanh toán.
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg p-4">
        Bạn không có quyền truy cập trang này.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Quản lý thanh toán
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Xem và quản lý giao dịch thanh toán
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setExportOpen((v) => !v)}
            disabled={exporting}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-60"
          >
            {exporting ? (
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            )}
            Xuất báo cáo
          </button>
          {exportOpen && (
            <>
              <div className="fixed inset-0 z-10" aria-hidden onClick={() => setExportOpen(false)} />
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-gray-200 rounded shadow-xl z-20 py-1 overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleExport("pdf")}
                  disabled={exporting}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Xuất PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleExport("excel")}
                  disabled={exporting}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Xuất Excel
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded p-4">
          {errorMessage}
        </div>
      )}

      {/* Tổng theo trạng thái */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_STATUS_ORDER.map(({ key, label, color }) => {
          const { count, amount } = totalsByStatus[key];
          const colorClasses = {
            amber: "border-amber-200 bg-amber-50/80 text-amber-900",
            emerald: "border-emerald-200 bg-emerald-50/80 text-emerald-900",
            red: "border-red-200 bg-red-50/80 text-red-900",
            slate: "border-slate-200 bg-slate-50/80 text-slate-800",
          }[color];
          const accentClasses = {
            amber: "text-amber-600",
            emerald: "text-emerald-600",
            red: "text-red-600",
            slate: "text-slate-600",
          }[color];
          return (
            <div
              key={key}
              className={`border rounded p-4 shadow-sm ${colorClasses}`}
            >
              <p className="text-xs font-medium uppercase tracking-wider opacity-80">
                {label}
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {amount.toLocaleString("vi-VN")} <span className="text-sm font-normal">VNĐ</span>
              </p>
              <p className={`mt-0.5 text-sm ${accentClasses}`}>
                {count} giao dịch
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Tìm theo mã GD, mã đơn, email, tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 min-w-[160px]"
            >
              <option value="all">Tất cả trạng thái</option>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 min-w-[120px]"
            >
              <option value="all">Tất cả năm</option>
              {yearOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 min-w-[140px]"
            >
              <option value="all">Tất cả tháng</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={String(m)}>
                  Tháng {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">
                  STT
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Mã GD</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Mã đơn</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Người dùng</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Email</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Gói VIP</th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Số tiền (VNĐ)</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Trạng thái</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Ngày tạo</th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-10 text-center text-gray-500 align-middle"
                  >
                    Chưa có giao dịch nào.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p, idx) => (
                  <tr key={p.payment_id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-900 align-middle">{idx + 1}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 align-middle">
                      {p.payment_id}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 align-middle">
                      {String(p.order_code)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 align-middle">
                      {p.user?.username ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 align-middle">
                      {p.user?.email ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 align-middle">
                      {VIP_LABELS[p.vip_package_type] ?? p.vip_package_type}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 text-right align-middle">
                      {p.amount.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          p.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : p.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : p.status === "cancelled" || p.status === "cancel" || p.status === "expired"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {STATUS_LABELS[p.status] ?? p.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 align-middle">
                      {formatDateTime(p.created_at)}
                    </td>
                    <td className="px-4 py-4 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => openEditModal(p)}
                        className="text-emerald-600 hover:text-emerald-800 font-medium text-sm"
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={closeEditModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Sửa giao dịch #{editingPayment.payment_id}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(e.target.value as PaymentStatus)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả (tùy chọn)
                </label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Mô tả giao dịch"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={savePayment}
                disabled={saving}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

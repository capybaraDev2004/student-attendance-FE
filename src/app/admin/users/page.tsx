"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

// Interface cho người dùng
interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  email_confirmed: boolean;
  verification_code: string | null;
  verification_code_expires_at: string | null;
  account_status: "normal" | "vip";
  account_type: "local" | "google";
  must_set_password: boolean;
  address: string | null;
  province: string | null;
  region: "bac" | "trung" | "nam" | null;
  vip_package_type: "lifetime" | "one_day" | "one_week" | "one_month" | "one_year" | null;
  vip_expires_at: string | null;
}

const FIXED_PROVINCES = [
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

const toLocalInputValue = (value: string | null) => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

const toIsoStringFromLocal = (value: string) => {
  if (!value) {
    return '';
  }
  return new Date(value).toISOString();
};

export default function UsersManagement() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatDateTime = (value?: string | null) =>
    value ? new Date(value).toLocaleString('vi-VN') : '—';

  const translateAccountStatus = (status: User['account_status']) =>
    status === 'vip' ? 'VIP' : 'Thường';

const translateAccountType = (type: User['account_type']) =>
  type === 'google' ? 'Google' : 'Local';

const translateVipPackageType = (type: User['vip_package_type']) => {
  if (!type) return '—';
  const map: Record<User['vip_package_type'], string> = {
    lifetime: 'Vĩnh viễn',
    one_day: '1 Ngày',
    one_week: '1 Tuần',
    one_month: '1 Tháng',
    one_year: '1 Năm',
  };
  return map[type] || type;
};

  // Lấy danh sách người dùng
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated" || !accessToken) {
      setLoading(false);
      setErrorMessage("Bạn cần đăng nhập với quyền quản trị để truy cập trang này.");
      return;
    }

    fetchUsers(accessToken);
  }, [status, accessToken]);

  // Lọc dữ liệu khi search hoặc filter thay đổi
  useEffect(() => {
    let filtered = users;

    // Lọc theo search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_id.toString().includes(searchTerm)
      );
    }

    // Lọc theo role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async (token: string) => {
    try {
      setErrorMessage(null);
      const data = await apiFetch<User[]>('/admin/users', { authToken: token });
      const list = Array.isArray(data) ? data : [];
      setUsers(list);
      setFilteredUsers(list);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      setErrorMessage((error as Error)?.message || 'Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Xóa người dùng
  const deleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    if (!accessToken) {
      alert('Không tìm thấy token truy cập. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      await apiFetch(`/admin/users/${userId}`, {
        method: 'DELETE',
        authToken: accessToken,
      });

      const updatedUsers = users.filter(user => user.user_id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      alert('Xóa người dùng thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      alert((error as Error)?.message || 'Lỗi khi xóa người dùng!');
    }
  };

  // Cập nhật role người dùng
  const updateUserRole = async (userId: number, newRole: string) => {
    if (!accessToken) {
      alert('Không tìm thấy token truy cập. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      await apiFetch(`/admin/users/${userId}`, {
        method: 'PATCH',
        authToken: accessToken,
        body: JSON.stringify({ role: newRole }),
      });

      const updatedUsers = users.map(user =>
        user.user_id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      alert('Cập nhật quyền thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật quyền:', error);
      alert((error as Error)?.message || 'Lỗi khi cập nhật quyền!');
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (status !== "authenticated" || !accessToken) {
    return (
      <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
        Bạn cần đăng nhập với quyền quản trị để truy cập trang quản lý người dùng.
      </div>
    );
  }

  if (session?.user?.role !== 'admin') {
    return (
      <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg p-4">
        Tài khoản của bạn không có quyền truy cập chức năng quản trị người dùng.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <span>Quản lý người dùng</span>
            </h1>
            <p className="text-gray-600 mt-2 ml-13">
              Quản lý tài khoản người dùng và phân quyền hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        {errorMessage && (
          <div className="mb-4 bg-red-50 text-red-700 border border-red-200 rounded-md p-3">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Tìm kiếm */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Bộ lọc vai trò */}
          <div className="md:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="customer">Khách hàng</option>
            </select>
          </div>

          {/* Hiển thị số kết quả */}
          <div className="flex items-center text-sm text-gray-600">
            Hiển thị {filteredUsers.length} / {users.length} người dùng
          </div>
        </div>
        
        {/* Hiển thị tiêu chí đang tìm kiếm */}
        {(searchTerm || roleFilter !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Tiêu chí đang áp dụng:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <span>Từ khóa: "{searchTerm}"</span>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    title="Xóa từ khóa"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {roleFilter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <span>Vai trò: {roleFilter === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</span>
                  <button
                    onClick={() => setRoleFilter('all')}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    title="Xóa bộ lọc vai trò"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {(searchTerm || roleFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('all');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Xóa tất cả
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bảng danh sách người dùng - responsive mobile */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <colgroup>
              <col className="w-16" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
            <col className="w-[8%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[8%]" />
            <col className="w-[10%]" />
            <col className="w-[8%]" />
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-28" />
            </colgroup>
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
              <tr>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>ID</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Tên đăng nhập</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Email</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Email xác nhận</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12a2 2 0 100 4h14a2 2 0 100-4" />
                    </svg>
                    <span>Trạng thái</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                    </svg>
                    <span>Nguồn</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Vai trò</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span>Gói VIP</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Hạn VIP</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Ngày tạo</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    <span>Hành động</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-normal break-words text-sm text-gray-900 max-w-[260px]">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-normal break-words text-sm text-gray-900 max-w-[300px]">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        user.email_confirmed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {user.email_confirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        user.account_status === 'vip'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {translateAccountStatus(user.account_status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {translateAccountType(user.account_type)}
                      </span>
                      {user.account_type === 'google' && user.must_set_password && (
                        <span className="block text-xs text-amber-600">
                          Chưa đặt mật khẩu
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.user_id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="customer">Khách hàng</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.vip_package_type ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                        {translateVipPackageType(user.vip_package_type)}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.vip_expires_at ? (
                      <div className="space-y-1">
                        <div>{new Date(user.vip_expires_at).toLocaleDateString('vi-VN')}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(user.vip_expires_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {user.user_id !== Number(session?.user?.id) && (
                      <button
                        onClick={() => deleteUser(user.user_id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Modal chỉnh sửa người dùng */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          authToken={accessToken}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            fetchUsers(accessToken);
          }}
        />
      )}
    </div>
  );
}


// Component modal chỉnh sửa người dùng
function EditUserModal({
  user,
  authToken,
  onClose,
  onSuccess,
}: {
  user: User;
  authToken: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    role: user.role,
    email_confirmed: user.email_confirmed,
    verification_code: user.verification_code ?? "",
    verification_code_expires_at: toLocalInputValue(
      user.verification_code_expires_at,
    ),
    account_status: user.account_status,
    account_type: user.account_type,
    address: user.address ?? "",
    province: user.province ?? "",
    region: (user.region ?? "") as "" | User["region"],
    vip_package_type: (user.vip_package_type ?? "") as "" | User["vip_package_type"],
    vip_expires_at: toLocalInputValue(user.vip_expires_at),
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        email_confirmed: formData.email_confirmed,
        verification_code: formData.verification_code || undefined,
        verification_code_expires_at: formData.verification_code_expires_at
          ? toIsoStringFromLocal(formData.verification_code_expires_at)
          : undefined,
        account_status: formData.account_status,
        account_type: formData.account_type,
        address: formData.address,
        province: formData.province,
      };

      if (formData.region) {
        payload.region = formData.region;
      }

      if (formData.vip_package_type) {
        payload.vip_package_type = formData.vip_package_type;
      } else {
        payload.vip_package_type = null;
      }

      payload.vip_expires_at = formData.vip_expires_at
        ? toIsoStringFromLocal(formData.vip_expires_at)
        : null;

      await apiFetch(`/admin/users/${user.user_id}`, {
        method: 'PATCH',
        authToken,
        body: JSON.stringify(payload),
      });

      alert('Cập nhật người dùng thành công!');
      onSuccess();
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      alert((error as Error)?.message || 'Lỗi khi cập nhật người dùng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-emerald-50">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-600 font-semibold">
              CapyChina Admin
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-1">Chỉnh sửa người dùng</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center text-gray-500"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Tên đăng nhập</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              />
            </div>
            <div className="col-span-1">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Vai trò</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              >
                <option value="customer">Khách hàng</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Trạng thái</label>
              <select
                value={formData.account_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    account_status: e.target.value as User['account_status'],
                  })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              >
                <option value="normal">Normal</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Nguồn tài khoản</label>
              <select
                value={formData.account_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    account_type: e.target.value as User['account_type'],
                  })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              >
                <option value="local">Local</option>
                <option value="google">Google</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Gói VIP</label>
              <select
                value={formData.vip_package_type || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vip_package_type: e.target.value as User['vip_package_type'] || null,
                  })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              >
                <option value="">Không có gói</option>
                <option value="lifetime">Vĩnh viễn</option>
                <option value="one_day">1 Ngày</option>
                <option value="one_week">1 Tuần</option>
                <option value="one_month">1 Tháng</option>
                <option value="one_year">1 Năm</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Hạn VIP (Ngày & Giờ)</label>
              <input
                type="datetime-local"
                value={formData.vip_expires_at}
                onChange={(e) =>
                  setFormData({ ...formData, vip_expires_at: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Địa chỉ
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                placeholder="Số nhà, đường, phường/xã..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Tỉnh / Thành phố
              </label>
              <select
                value={formData.province}
                onChange={(e) =>
                  setFormData({ ...formData, province: e.target.value })
                }
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              >
                <option value="">Chọn tỉnh / thành phố</option>
                {FIXED_PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Miền
              </label>
              <select
                value={formData.region}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    region: e.target.value as User["region"],
                  })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              >
                <option value="">Không chọn</option>
                <option value="bac">Miền Bắc</option>
                <option value="trung">Miền Trung</option>
                <option value="nam">Miền Nam</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Trạng thái email</p>
                <p className="text-xs text-gray-500">
                  {formData.email_confirmed ? 'Đã xác thực' : 'Chưa xác thực - yêu cầu người dùng nhập mã'}
                </p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.email_confirmed}
                  onChange={(e) =>
                    setFormData({ ...formData, email_confirmed: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-500 transition-all relative">
                  <div className="absolute top-[2px] left-[2px] bg-white peer-checked:translate-x-5 rounded-full h-5 w-5 transition-all"></div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full md:w-1/3 border border-gray-300 rounded-xl px-4 py-3 text-gray-600 font-semibold hover:bg-gray-50 transition shadow-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl px-4 py-3 font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50"
            >
              {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

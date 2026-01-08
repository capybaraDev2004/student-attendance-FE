"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

// Interface cho tin tức
interface News {
  id: number;
  title: string;
  content: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export default function NewsManagement() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Lấy dữ liệu
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated" || !accessToken) {
      setLoading(false);
      setErrorMessage("Bạn cần đăng nhập với quyền quản trị để truy cập trang này.");
      return;
    }

    fetchNews(accessToken);
  }, [status, accessToken]);

  // Lọc dữ liệu khi search thay đổi
  useEffect(() => {
    let filtered = news;

    // Lọc theo search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm)
      );
    }

    setFilteredNews(filtered);
  }, [news, searchTerm]);

  const fetchNews = async (token: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const data = await apiFetch<News[]>('/news', { authToken: token });
      const safeData = Array.isArray(data) ? data : [];
      setNews(safeData);
      setFilteredNews(safeData);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setErrorMessage((error as Error)?.message || 'Lỗi khi tải dữ liệu');
      setNews([]);
      setFilteredNews([]);
    } finally {
      setLoading(false);
    }
  };

  // Xóa tin tức
  const deleteNews = async (newsId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin tức này?')) {
      return;
    }

    if (!accessToken) {
      alert('Không tìm thấy token truy cập. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      await apiFetch(`/news/${newsId}`, {
        method: 'DELETE',
        authToken: accessToken,
      });

      const updatedNews = news.filter(item => item.id !== newsId);
      setNews(updatedNews);
      setFilteredNews(updatedNews);
      alert('Xóa tin tức thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa tin tức:', error);
      alert((error as Error)?.message || 'Lỗi khi xóa tin tức!');
    }
  };

  // Kiểm tra tin tức có đang active không
  const isActive = (item: News) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(item.start_date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(item.end_date);
    endDate.setHours(0, 0, 0, 0);
    return today >= startDate && today <= endDate;
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
        Bạn cần đăng nhập với quyền quản trị để truy cập trang quản lý tin tức.
      </div>
    );
  }

  if (session?.user?.role !== 'admin') {
    return (
      <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg p-4">
        Bạn không có quyền truy cập trang này.
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
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Quản lý Tin tức
          </h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý tin tức hiển thị cho người dùng</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm tin tức mới
        </button>
      </div>

      {/* Thông báo lỗi */}
      {errorMessage && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
          {errorMessage}
        </div>
      )}

      {/* Bộ lọc và tìm kiếm */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Tìm kiếm */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>
          </div>

          {/* Hiển thị số kết quả */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Hiển thị {filteredNews.length} / {news.length} tin tức
            </div>
          </div>
        </div>
      </div>

      {/* Bảng danh sách tin tức */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-600">
              <tr>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider w-16">
                  STT
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Ngày bắt đầu
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Ngày kết thúc
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Không có tin tức nào
                  </td>
                </tr>
              ) : (
                filteredNews.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-normal break-words text-sm text-gray-900 max-w-md">
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{item.content.substring(0, 100)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {new Date(item.start_date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {new Date(item.end_date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          isActive(item)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {isActive(item) ? 'Đang hiển thị' : 'Không hiển thị'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {new Date(item.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 text-center">
                      <button
                        onClick={() => setEditingNews(item)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Chỉnh sửa"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteNews(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm tin tức */}
      {showAddModal && (
        <AddNewsModal
          authToken={accessToken}
          onClose={() => setShowAddModal(false)}
          onSuccess={(created) => {
            setShowAddModal(false);
            setNews((prev) => [created, ...prev]);
            setFilteredNews((prev) => [created, ...prev]);
          }}
        />
      )}

      {/* Modal chỉnh sửa tin tức */}
      {editingNews && (
        <EditNewsModal
          news={editingNews}
          authToken={accessToken}
          onClose={() => setEditingNews(null)}
          onSuccess={(updated) => {
            setEditingNews(null);
            setNews((prev) =>
              prev.map((item) =>
                item.id === updated.id ? { ...item, ...updated } : item,
              ),
            );
            setFilteredNews((prev) =>
              prev.map((item) =>
                item.id === updated.id ? { ...item, ...updated } : item,
              ),
            );
          }}
        />
      )}
    </div>
  );
}

// Component modal thêm tin tức
function AddNewsModal({
  authToken,
  onClose,
  onSuccess,
}: {
  authToken: string;
  onClose: () => void;
  onSuccess: (created: News) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    start_date: '',
    end_date: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default dates
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    setFormData({
      title: '',
      content: '',
      start_date: today.toISOString().split('T')[0],
      end_date: nextMonth.toISOString().split('T')[0],
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const created = await apiFetch<News>('/news', {
        method: 'POST',
        body: JSON.stringify(formData),
        authToken: authToken,
      });

      alert('Thêm tin tức thành công!');
      onSuccess(created);
    } catch (error) {
      console.error('Lỗi khi thêm tin tức:', error);
      alert((error as Error)?.message || 'Lỗi khi thêm tin tức!');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-purple-600 px-6 py-4 rounded-t-xl">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Thêm tin tức mới
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tiêu đề */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
              placeholder="Nhập tiêu đề tin tức"
            />
          </div>

          {/* Nội dung */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base resize-y"
              placeholder="Nhập nội dung tin tức"
            />
          </div>

          {/* Ngày bắt đầu và kết thúc */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Đang thêm...' : 'Thêm tin tức'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Component modal chỉnh sửa tin tức
function EditNewsModal({
  news,
  authToken,
  onClose,
  onSuccess,
}: {
  news: News;
  authToken: string;
  onClose: () => void;
  onSuccess: (updated: News) => void;
}) {
  const [formData, setFormData] = useState({
    title: news.title,
    content: news.content,
    start_date: news.start_date.split('T')[0],
    end_date: news.end_date.split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await apiFetch(`/news/${news.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
        authToken: authToken,
      });

      alert('Cập nhật tin tức thành công!');
      onSuccess({ ...news, ...updated } as News);
    } catch (error) {
      console.error('Lỗi khi cập nhật tin tức:', error);
      alert((error as Error)?.message || 'Lỗi khi cập nhật tin tức!');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-purple-600 px-6 py-4 rounded-t-xl">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Chỉnh sửa tin tức
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tiêu đề */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
              placeholder="Nhập tiêu đề tin tức"
            />
          </div>

          {/* Nội dung */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base resize-y"
              placeholder="Nhập nội dung tin tức"
            />
          </div>

          {/* Ngày bắt đầu và kết thúc */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật tin tức'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

// Interface cho câu nói
interface Sentence {
  id: number;
  chinese_simplified?: string;
  pinyin?: string;
  vietnamese?: string;
  category_id: number;
  category?: {
    name_vi?: string;
    name_en?: string;
  };
}

// Interface cho danh mục câu nói
interface SentenceCategory {
  id: number;
  name_vi?: string;
  name_en?: string;
}

// Interface cho bài học
export default function SentencesManagement() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [filteredSentences, setFilteredSentences] = useState<Sentence[]>([]);
  const [categories, setCategories] = useState<SentenceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSentence, setEditingSentence] = useState<Sentence | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    fetchData(accessToken);
  }, [status, accessToken]);

  // Lọc dữ liệu khi search hoặc filter thay đổi
  useEffect(() => {
    let filtered = sentences;

    // Lọc theo search term
    if (searchTerm) {
      filtered = filtered.filter(sentence => 
        (sentence.chinese_simplified && sentence.chinese_simplified.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sentence.pinyin && sentence.pinyin.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sentence.vietnamese && sentence.vietnamese.toLowerCase().includes(searchTerm.toLowerCase())) ||
        sentence.id.toString().includes(searchTerm)
      );
    }

    // Lọc theo danh mục
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(sentence => sentence.category_id.toString() === categoryFilter);
    }

    setFilteredSentences(filtered);
  }, [sentences, searchTerm, categoryFilter]);

  const fetchData = async (token: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const [sentencesData, categoriesData] = await Promise.all([
        apiFetch<Sentence[]>('/admin/sentences', { authToken: token }),
        apiFetch<SentenceCategory[]>('/admin/sentence-categories', { authToken: token }),
      ]);

      const safeSentencesData = Array.isArray(sentencesData) ? sentencesData : [];
      setSentences(safeSentencesData);
      setFilteredSentences(safeSentencesData);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setErrorMessage((error as Error)?.message || 'Lỗi khi tải dữ liệu');
      setSentences([]);
      setFilteredSentences([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Xóa câu nói
  const deleteSentence = async (sentenceId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa câu nói này?')) {
      return;
    }

    if (!accessToken) {
      alert('Không tìm thấy token truy cập. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      await apiFetch(`/admin/sentences/${sentenceId}`, {
        method: 'DELETE',
        authToken: accessToken,
      });

      const updatedSentences = sentences.filter(sentence => sentence.id !== sentenceId);
      setSentences(updatedSentences);
      setFilteredSentences(updatedSentences);
      alert('Xóa câu nói thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa câu nói:', error);
      alert((error as Error)?.message || 'Lỗi khi xóa câu nói!');
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
        Bạn cần đăng nhập với quyền quản trị để truy cập trang quản lý câu nói.
      </div>
    );
  }

  if (session?.user?.role !== 'admin') {
    return (
      <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg p-4">
        Tài khoản của bạn không có quyền truy cập chức năng quản trị câu nói.
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
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span>Quản lý câu nói</span>
            </h1>
            <p className="text-gray-600 mt-2 ml-13">
              Quản lý câu nói tiếng Trung trong hệ thống
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
            disabled={!!errorMessage}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Thêm câu nói</span>
          </button>
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
                placeholder="Tìm kiếm theo câu tiếng Trung, pinyin, nghĩa hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Bộ lọc danh mục */}
          <div className="md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">Tất cả danh mục</option>
              {Array.isArray(categories) && categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name_vi || category.name_en}
                </option>
              ))}
            </select>
          </div>

          {/* Hiển thị số kết quả */}
          <div className="flex items-center text-sm text-gray-600">
            Hiển thị {filteredSentences.length} / {sentences.length} câu nói
          </div>
        </div>
        
        {/* Hiển thị tiêu chí đang tìm kiếm */}
        {(searchTerm || categoryFilter !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Tiêu chí đang áp dụng:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  <span>Từ khóa: "{searchTerm}"</span>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:bg-amber-200 rounded-full p-0.5 transition-colors"
                    title="Xóa từ khóa"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {categoryFilter !== 'all' && (() => {
                const selectedCategory = categories.find(cat => cat.id?.toString() === categoryFilter);
                return (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                    <span>Danh mục: {selectedCategory?.name_vi || selectedCategory?.name_en || categoryFilter}</span>
                    <button
                      onClick={() => setCategoryFilter('all')}
                      className="hover:bg-amber-200 rounded-full p-0.5 transition-colors"
                      title="Xóa bộ lọc danh mục"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                );
              })()}
              {(searchTerm || categoryFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
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

      {/* Bảng danh sách câu nói */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <colgroup>
              <col className="w-16" />
              <col className="w-[28%]" />
              <col className="w-[22%]" />
              <col className="w-[28%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-28" />
            </colgroup>
            <thead className="bg-gradient-to-r from-amber-600 to-orange-700">
              <tr>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>ID</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Câu tiếng Trung</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span>Pinyin</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Nghĩa tiếng Việt</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Danh mục</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
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
              {filteredSentences.map((sentence) => (
                <tr key={sentence.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sentence.id}
                  </td>
                  <td className="px-6 py-4 whitespace-normal break-words max-w-[320px]">
                    <div className="text-sm font-medium text-gray-900">
                      {sentence.chinese_simplified || 'Chưa có'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-normal break-words text-sm text-gray-900 max-w-[260px]">
                    {sentence.pinyin || 'Chưa có'}
                  </td>
                  <td className="px-6 py-4 whitespace-normal break-words text-sm text-gray-900 max-w-[320px]">
                    {sentence.vietnamese || 'Chưa có'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sentence.category?.name_vi || sentence.category?.name_en || 'Chưa phân loại'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingSentence(sentence)}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteSentence(sentence.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm câu nói */}
      {showAddModal && (
        <AddSentenceModal
          categories={categories}
          authToken={accessToken}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchData(accessToken);
          }}
        />
      )}

      {/* Modal chỉnh sửa câu nói */}
      {editingSentence && (
        <EditSentenceModal
          sentence={editingSentence}
          categories={categories}
          authToken={accessToken}
          onClose={() => setEditingSentence(null)}
          onSuccess={() => {
            setEditingSentence(null);
            fetchData(accessToken);
          }}
        />
      )}
    </div>
  );
}

// Component modal thêm câu nói
function AddSentenceModal({
  categories,
  authToken,
  onClose,
  onSuccess,
}: {
  categories: SentenceCategory[];
  authToken: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    chinese_simplified: '',
    pinyin: '',
    vietnamese: '',
    category_id: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch('/admin/sentences', {
        method: 'POST',
        authToken,
        body: JSON.stringify({
          ...formData,
          category_id: parseInt(formData.category_id),
        }),
      });

      alert('Thêm câu nói thành công!');
      onSuccess();
    } catch (error) {
      console.error('Lỗi khi thêm câu nói:', error);
      alert((error as Error)?.message || 'Lỗi khi thêm câu nói!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-500/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thêm câu nói mới</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Câu tiếng Trung
              </label>
              <input
                type="text"
                value={formData.chinese_simplified}
                onChange={(e) => setFormData({ ...formData, chinese_simplified: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pinyin
              </label>
              <input
                type="text"
                value={formData.pinyin}
                onChange={(e) => setFormData({ ...formData, pinyin: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nghĩa tiếng Việt
              </label>
              <input
                type="text"
                value={formData.vietnamese}
                onChange={(e) => setFormData({ ...formData, vietnamese: e.target.value })}
                placeholder="Ví dụ: Tôi là học sinh..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục *
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_vi || category.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? 'Đang thêm...' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Component modal chỉnh sửa câu nói
function EditSentenceModal({
  sentence,
  categories,
  authToken,
  onClose,
  onSuccess,
}: {
  sentence: Sentence;
  categories: SentenceCategory[];
  authToken: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    chinese_simplified: sentence.chinese_simplified || '',
    pinyin: sentence.pinyin || '',
    vietnamese: sentence.vietnamese || '',
    category_id: sentence.category_id.toString()
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch(`/admin/sentences/${sentence.id}`, {
        method: 'PATCH',
        authToken,
        body: JSON.stringify({
          ...formData,
          category_id: parseInt(formData.category_id),
        }),
      });

      alert('Cập nhật câu nói thành công!');
      onSuccess();
    } catch (error) {
      console.error('Lỗi khi cập nhật câu nói:', error);
      alert((error as Error)?.message || 'Lỗi khi cập nhật câu nói!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-500/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Chỉnh sửa câu nói</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Câu tiếng Trung
              </label>
              <input
                type="text"
                value={formData.chinese_simplified}
                onChange={(e) => setFormData({ ...formData, chinese_simplified: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pinyin
              </label>
              <input
                type="text"
                value={formData.pinyin}
                onChange={(e) => setFormData({ ...formData, pinyin: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nghĩa tiếng Việt
              </label>
              <input
                type="text"
                value={formData.vietnamese}
                onChange={(e) => setFormData({ ...formData, vietnamese: e.target.value })}
                placeholder="Ví dụ: Tôi là học sinh..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục *
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_vi || category.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

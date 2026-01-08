"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

// Interface cho từ vựng
interface Vocabulary {
  vocab_id: number;
  chinese_word: string;
  pinyin: string;
  meaning_vn: string;
  audio_url?: string;
  example_sentence?: string;
  category_id?: number;
  category?: {
    name_vi?: string;
    name_en?: string;
  };
}

// Interface cho danh mục từ vựng
interface VocabularyCategory {
  id: number;
  name_vi?: string;
  name_en?: string;
}

// Interface cho bài học
export default function VocabularyManagement() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [filteredVocabularies, setFilteredVocabularies] = useState<Vocabulary[]>([]);
  const [categories, setCategories] = useState<VocabularyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVocabulary, setEditingVocabulary] = useState<Vocabulary | null>(null);
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
    let filtered = vocabularies;

    // Lọc theo search term
    if (searchTerm) {
      filtered = filtered.filter(vocab => 
        vocab.chinese_word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vocab.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vocab.meaning_vn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vocab.vocab_id.toString().includes(searchTerm)
      );
    }

    // Lọc theo danh mục
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(vocab => vocab.category_id?.toString() === categoryFilter);
    }

    setFilteredVocabularies(filtered);
  }, [vocabularies, searchTerm, categoryFilter]);

  const fetchData = async (token: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const [vocabData, categoriesData] = await Promise.all([
        apiFetch<Vocabulary[]>('/admin/vocabulary', { authToken: token }),
        apiFetch<VocabularyCategory[]>('/admin/vocabulary-categories', { authToken: token }),
      ]);

      const safeVocabData = Array.isArray(vocabData) ? vocabData : [];
      setVocabularies(safeVocabData);
      setFilteredVocabularies(safeVocabData);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setErrorMessage((error as Error)?.message || 'Lỗi khi tải dữ liệu');
      setVocabularies([]);
      setFilteredVocabularies([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Xóa từ vựng
  const deleteVocabulary = async (vocabId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa từ vựng này?')) {
      return;
    }

    if (!accessToken) {
      alert('Không tìm thấy token truy cập. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      await apiFetch(`/admin/vocabulary/${vocabId}`, {
        method: 'DELETE',
        authToken: accessToken,
      });

      const updatedVocabularies = vocabularies.filter(vocab => vocab.vocab_id !== vocabId);
      setVocabularies(updatedVocabularies);
      setFilteredVocabularies(updatedVocabularies);
      alert('Xóa từ vựng thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa từ vựng:', error);
      alert((error as Error)?.message || 'Lỗi khi xóa từ vựng!');
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
        Bạn cần đăng nhập với quyền quản trị để truy cập trang quản lý từ vựng.
      </div>
    );
  }

  if (session?.user?.role !== 'admin') {
    return (
      <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg p-4">
        Tài khoản của bạn không có quyền truy cập chức năng quản trị từ vựng.
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
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span>Quản lý từ vựng</span>
            </h1>
            <p className="text-gray-600 mt-2 ml-13">
              Quản lý từ vựng tiếng Trung trong hệ thống
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Thêm từ vựng</span>
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
                placeholder="Tìm kiếm theo từ tiếng Trung, pinyin, nghĩa hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Bộ lọc danh mục */}
          <div className="md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
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
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-sm text-gray-600">
              Hiển thị {filteredVocabularies.length} / {vocabularies.length} từ vựng
            </div>
          </div>
        </div>
        
        {/* Hiển thị tiêu chí đang tìm kiếm */}
        {(searchTerm || categoryFilter !== 'all') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Tiêu chí đang áp dụng:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                  <span>Từ khóa: "{searchTerm}"</span>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
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
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                    <span>Danh mục: {selectedCategory?.name_vi || selectedCategory?.name_en || categoryFilter}</span>
                    <button
                      onClick={() => setCategoryFilter('all')}
                      className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
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

      {/* Bảng danh sách từ vựng - responsive mobile */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <colgroup>
              <col className="w-16" />
              <col className="w-[22%]" />
              <col className="w-[22%]" />
              <col className="w-[26%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-28" />
            </colgroup>
            <thead className="bg-gradient-to-r from-emerald-600 to-teal-700">
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
                    <span>Từ tiếng Trung</span>
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
              {filteredVocabularies.map((vocab) => (
                <tr key={vocab.vocab_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vocab.vocab_id}
                  </td>
                  <td className="px-6 py-4 whitespace-normal break-words text-sm font-medium text-gray-900 max-w-[240px]">
                    {vocab.chinese_word}
                  </td>
                  <td className="px-6 py-4 whitespace-normal break-words text-sm text-gray-900 max-w-[240px]">
                    {vocab.pinyin}
                  </td>
                  <td className="px-6 py-4 whitespace-normal break-words max-w-[300px]">
                    <div className="text-sm font-medium text-gray-900">
                      {vocab.meaning_vn || 'Chưa có nghĩa'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vocab.category?.name_vi || vocab.category?.name_en || 'Chưa phân loại'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingVocabulary(vocab)}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteVocabulary(vocab.vocab_id)}
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

      {/* Modal thêm từ vựng */}
      {showAddModal && (
        <AddVocabularyModal
          categories={categories}
          authToken={accessToken}
          onClose={() => setShowAddModal(false)}
          onSuccess={(created) => {
            setShowAddModal(false);
            setVocabularies((prev) => {
              // Thêm từ mới lên đầu danh sách, giữ nguyên các từ còn lại
              const next = [created, ...prev];
              return next;
            });
          }}
        />
      )}

      {/* Modal chỉnh sửa từ vựng */}
      {editingVocabulary && (
        <EditVocabularyModal
          vocabulary={editingVocabulary}
          categories={categories}
          authToken={accessToken}
          onClose={() => setEditingVocabulary(null)}
          onSuccess={(updated) => {
            setEditingVocabulary(null);
            setVocabularies((prev) =>
              prev.map((vocab) =>
                vocab.vocab_id === updated.vocab_id ? { ...vocab, ...updated } : vocab,
              ),
            );
          }}
        />
      )}
    </div>
  );
}

// Component modal thêm từ vựng
function AddVocabularyModal({
  categories,
  authToken,
  onClose,
  onSuccess,
}: {
  categories: VocabularyCategory[];
  authToken: string;
  onClose: () => void;
  onSuccess: (created: Vocabulary) => void;
}) {
  const [formData, setFormData] = useState({
    chinese_word: '',
    pinyin: '',
    meaning_vn: '',
    category_id: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const created = await apiFetch<Vocabulary>('/admin/vocabulary', {
        method: 'POST',
        authToken,
        body: JSON.stringify({
          ...formData,
          example_sentence: undefined,
          category_id: formData.category_id ? parseInt(formData.category_id) : null,
        }),
      });

      alert('Thêm từ vựng thành công!');
      onSuccess(created);
    } catch (error) {
      console.error('Lỗi khi thêm từ vựng:', error);
      alert((error as Error)?.message || 'Lỗi khi thêm từ vựng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-500/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thêm từ vựng mới</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ tiếng Trung *
              </label>
              <input
                type="text"
                required
                value={formData.chinese_word}
                onChange={(e) => setFormData({ ...formData, chinese_word: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Trường chữ giản thể đã loại bỏ theo schema DB hiện tại */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pinyin *
              </label>
              <input
                type="text"
                required
                value={formData.pinyin}
                onChange={(e) => setFormData({ ...formData, pinyin: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nghĩa tiếng Việt *
              </label>
              <input
                type="text"
                required
                value={formData.meaning_vn}
                onChange={(e) => setFormData({ ...formData, meaning_vn: e.target.value })}
                placeholder="Ví dụ: học sinh, người học..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Trường vietnamese đã loại bỏ theo schema DB hiện tại */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Chọn danh mục</option>
                {Array.isArray(categories) && categories.map((category) => (
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

// Component modal chỉnh sửa từ vựng
function EditVocabularyModal({
  vocabulary,
  categories,
  authToken,
  onClose,
  onSuccess,
}: {
  vocabulary: Vocabulary;
  categories: VocabularyCategory[];
  authToken: string;
  onClose: () => void;
  onSuccess: (updated: Vocabulary) => void;
}) {
  const [formData, setFormData] = useState({
    chinese_word: vocabulary.chinese_word,
    pinyin: vocabulary.pinyin,
    meaning_vn: vocabulary.meaning_vn,
    category_id: vocabulary.category_id?.toString() || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await apiFetch<Vocabulary>(`/admin/vocabulary/${vocabulary.vocab_id}`, {
        method: 'PATCH',
        authToken,
        body: JSON.stringify({
          ...formData,
          example_sentence: undefined,
          category_id: formData.category_id ? parseInt(formData.category_id) : null,
        }),
      });

      alert('Cập nhật từ vựng thành công!');
      onSuccess(updated);
    } catch (error) {
      console.error('Lỗi khi cập nhật từ vựng:', error);
      alert((error as Error)?.message || 'Lỗi khi cập nhật từ vựng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-500/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Chỉnh sửa từ vựng</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ tiếng Trung *
              </label>
              <input
                type="text"
                required
                value={formData.chinese_word}
                onChange={(e) => setFormData({ ...formData, chinese_word: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Trường chữ giản thể đã loại bỏ theo schema DB hiện tại */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pinyin *
              </label>
              <input
                type="text"
                required
                value={formData.pinyin}
                onChange={(e) => setFormData({ ...formData, pinyin: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nghĩa tiếng Việt *
              </label>
              <input
                type="text"
                required
                value={formData.meaning_vn}
                onChange={(e) => setFormData({ ...formData, meaning_vn: e.target.value })}
                placeholder="Ví dụ: học sinh, người học..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Trường vietnamese đã loại bỏ theo schema DB hiện tại */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Chọn danh mục</option>
                {Array.isArray(categories) && categories.map((category) => (
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

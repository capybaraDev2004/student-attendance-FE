"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

// Interface cho flashcard
interface Flashcard {
  id: number;
  image_url?: string | null;
  answer: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Hàm lấy tên file từ đường dẫn URL
function getFileNameFromUrl(url: string | null | undefined): string {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const fileName = pathname.split('/').pop() || '';
    return decodeURIComponent(fileName);
  } catch {
    // Nếu không phải URL đầy đủ, lấy phần cuối của đường dẫn
    const parts = url.split('/');
    return decodeURIComponent(parts[parts.length - 1]);
  }
}

export default function FlashcardsManagement() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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

    fetchFlashcards(accessToken);
  }, [status, accessToken]);

  // Lọc dữ liệu khi search hoặc filter thay đổi
  useEffect(() => {
    let filtered = flashcards;

    // Lọc theo search term
    if (searchTerm) {
      filtered = filtered.filter(flashcard => 
        flashcard.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flashcard.id.toString().includes(searchTerm) ||
        (flashcard.image_url && flashcard.image_url.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Lọc theo trạng thái
    if (statusFilter !== 'all') {
      filtered = filtered.filter(flashcard => flashcard.status === statusFilter);
    }

    setFilteredFlashcards(filtered);
  }, [flashcards, searchTerm, statusFilter]);

  const fetchFlashcards = async (token: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const data = await apiFetch<Flashcard[]>('/admin/flashcards', { authToken: token });
      const safeData = Array.isArray(data) ? data : [];
      setFlashcards(safeData);
      setFilteredFlashcards(safeData);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setErrorMessage((error as Error)?.message || 'Lỗi khi tải dữ liệu');
      setFlashcards([]);
      setFilteredFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  // Xóa flashcard
  const deleteFlashcard = async (flashcardId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa flashcard này?')) {
      return;
    }

    if (!accessToken) {
      alert('Không tìm thấy token truy cập. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      await apiFetch(`/admin/flashcards/${flashcardId}`, {
        method: 'DELETE',
        authToken: accessToken,
      });

      const updatedFlashcards = flashcards.filter(flashcard => flashcard.id !== flashcardId);
      setFlashcards(updatedFlashcards);
      setFilteredFlashcards(updatedFlashcards);
      alert('Xóa flashcard thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa flashcard:', error);
      alert((error as Error)?.message || 'Lỗi khi xóa flashcard!');
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
        Bạn cần đăng nhập với quyền quản trị để truy cập trang quản lý flashcard.
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Flashcard</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý câu hỏi flashcard cho người học</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm flashcard mới
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
                placeholder="Tìm kiếm theo câu trả lời, ID hoặc URL ảnh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Bộ lọc trạng thái */}
          <div className="md:w-56 flex-shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>

          {/* Hiển thị số kết quả */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-sm text-gray-600">
              Hiển thị {filteredFlashcards.length} / {flashcards.length} flashcard
            </div>
          </div>
        </div>
        
        {/* Hiển thị tiêu chí đang tìm kiếm */}
        {(searchTerm || statusFilter !== 'all') && (
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
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                  <span>Trạng thái: {statusFilter === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}</span>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                    title="Xóa bộ lọc trạng thái"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
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

      {/* Bảng danh sách flashcard */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-emerald-600 to-teal-700">
              <tr>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider w-16">
                  STT
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Ảnh flashcard
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Câu trả lời
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
              {filteredFlashcards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Không có flashcard nào
                  </td>
                </tr>
              ) : (
                filteredFlashcards.map((flashcard, index) => (
                  <tr key={flashcard.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                      {flashcard.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {flashcard.image_url ? (() => {
                        // Đảm bảo URL đúng format
                        let imageUrl = flashcard.image_url.trim();
                        if (!imageUrl.startsWith('http')) {
                          if (!imageUrl.startsWith('/')) {
                            imageUrl = `/${imageUrl}`;
                          }
                          // Loại bỏ dấu / trùng lặp
                          imageUrl = imageUrl.replace(/\/+/g, '/');
                          imageUrl = `${API_BASE_URL}${imageUrl}`;
                        }
                        return (
                          <img
                            src={imageUrl}
                            alt="Flashcard"
                            className="h-20 w-20 object-cover rounded-lg mx-auto"
                            onLoad={() => {
                              console.log('✅ Ảnh load thành công trong bảng:', imageUrl);
                            }}
                            onError={(e) => {
                              console.error('❌ Lỗi tải ảnh trong bảng:', imageUrl, 'Original URL:', flashcard.image_url);
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="h-20 w-20 bg-gray-200 rounded-lg mx-auto flex items-center justify-center"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>';
                              }
                            }}
                          />
                        );
                      })() : (
                        <div className="h-20 w-20 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-normal break-words text-sm text-gray-900 max-w-md">
                      {flashcard.answer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          flashcard.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {flashcard.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {new Date(flashcard.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 text-center">
                      <button
                        onClick={() => setEditingFlashcard(flashcard)}
                        className="text-emerald-600 hover:text-emerald-900"
                        title="Chỉnh sửa"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteFlashcard(flashcard.id)}
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

      {/* Modal thêm flashcard */}
      {showAddModal && (
        <AddFlashcardModal
          authToken={accessToken}
          onClose={() => setShowAddModal(false)}
          onSuccess={(created) => {
            setShowAddModal(false);
            setFlashcards((prev) => [created, ...prev]);
            setFilteredFlashcards((prev) => [created, ...prev]);
          }}
        />
      )}

      {/* Modal chỉnh sửa flashcard */}
      {editingFlashcard && (
        <EditFlashcardModal
          flashcard={editingFlashcard}
          authToken={accessToken}
          onClose={() => setEditingFlashcard(null)}
          onSuccess={(updated) => {
            setEditingFlashcard(null);
            setFlashcards((prev) =>
              prev.map((flashcard) =>
                flashcard.id === updated.id ? { ...flashcard, ...updated } : flashcard,
              ),
            );
            setFilteredFlashcards((prev) =>
              prev.map((flashcard) =>
                flashcard.id === updated.id ? { ...flashcard, ...updated } : flashcard,
              ),
            );
          }}
        />
      )}
    </div>
  );
}

// Component modal thêm flashcard
function AddFlashcardModal({
  authToken,
  onClose,
  onSuccess,
}: {
  authToken: string;
  onClose: () => void;
  onSuccess: (created: Flashcard) => void;
}) {
  const [formData, setFormData] = useState({
    answer: '',
    status: 'active',
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('answer', formData.answer);
      formDataToSend.append('status', formData.status);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${API_BASE_URL}/admin/flashcards`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Lỗi khi thêm flashcard');
      }

      const created = await response.json();
      alert('Thêm flashcard thành công!');
      onSuccess(created);
    } catch (error) {
      console.error('Lỗi khi thêm flashcard:', error);
      alert((error as Error)?.message || 'Lỗi khi thêm flashcard!');
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
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 md:px-6 py-3 md:py-4 rounded-t-xl">
          <h2 className="text-lg md:text-xl font-bold text-white flex items-center">
            <svg className="w-5 h-5 md:w-6 md:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm flashcard mới
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5 md:space-y-6">
          {/* Ảnh flashcard */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2.5">
              Ảnh flashcard
            </label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-base text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
              {imagePreview && (
                <div className="mt-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-emerald-200">
                  <p className="text-sm font-medium text-gray-700 mb-2.5">Preview ảnh đã chọn:</p>
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-48 w-auto max-w-full object-contain rounded-lg shadow-md border-2 border-white"
                      onLoad={() => {
                        console.log('✅ Ảnh load thành công:', imagePreview);
                      }}
                      onError={(e) => {
                        console.error('❌ Lỗi tải ảnh preview (form thêm):', imagePreview);
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                        const parent = img.parentElement;
                        if (parent && !parent.querySelector('.error-placeholder')) {
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'error-placeholder h-48 w-full bg-gray-200 rounded-lg flex flex-col items-center justify-center';
                          const shortUrl = imagePreview ? (imagePreview.length > 60 ? imagePreview.substring(0, 60) + '...' : imagePreview) : 'N/A';
                          errorDiv.innerHTML = `<svg class="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-sm text-gray-500 font-medium">Không thể tải ảnh</p><p class="text-xs text-gray-400 mt-1 text-center px-2 break-all">${shortUrl}</p>`;
                          parent.appendChild(errorDiv);
                        }
                      }}
                    />
                    {formData.image && (
                      <div className="absolute top-2 right-2 bg-emerald-600 text-white text-sm px-3 py-1 rounded-full font-semibold max-w-[200px] truncate" title={formData.image.name}>
                        {formData.image.name}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Câu trả lời và Trạng thái cùng hàng */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <label className="block text-lg font-semibold text-gray-800 mb-2.5">
                Câu trả lời <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full min-h-[4rem] h-[4rem] border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none bg-gray-50 hover:bg-white leading-relaxed"
                placeholder="Nhập câu trả lời cho flashcard..."
                style={{ height: '4rem', lineHeight: '1.5rem' }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-lg font-semibold text-gray-800 mb-2.5">
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-[4rem] border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-gray-50 hover:bg-white font-medium"
              >
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 text-base border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 text-base bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang thêm...
                </span>
              ) : (
                'Thêm flashcard'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Component modal chỉnh sửa flashcard
function EditFlashcardModal({
  flashcard,
  authToken,
  onClose,
  onSuccess,
}: {
  flashcard: Flashcard;
  authToken: string;
  onClose: () => void;
  onSuccess: (updated: Flashcard) => void;
}) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const [formData, setFormData] = useState({
    answer: flashcard.answer,
    status: flashcard.status,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load ảnh hiện tại khi component mount hoặc flashcard thay đổi
  useEffect(() => {
    if (flashcard.image_url) {
      // Đảm bảo đường dẫn đúng format - image_url từ DB đã có dạng /uploads/flashcards/filename.png
      let imageUrl = flashcard.image_url.trim();
      
      // Nếu không bắt đầu bằng http, thêm API_BASE_URL
      if (!imageUrl.startsWith('http')) {
        // Đảm bảo có dấu / ở đầu
        if (!imageUrl.startsWith('/')) {
          imageUrl = `/${imageUrl}`;
        }
        // Loại bỏ dấu / trùng lặp
        imageUrl = imageUrl.replace(/\/+/g, '/');
        imageUrl = `${API_BASE_URL}${imageUrl}`;
      }
      
      console.log('Loading image from URL:', imageUrl);
      
      // Set URL trực tiếp, browser sẽ tự xử lý load
      // Nếu lỗi sẽ được xử lý bởi onError handler của img tag
      console.log('Setting image preview URL:', imageUrl, 'from original:', flashcard.image_url);
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  }, [flashcard.image_url, API_BASE_URL]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('answer', formData.answer);
      formDataToSend.append('status', formData.status);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${API_BASE_URL}/admin/flashcards/${flashcard.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Lỗi khi cập nhật flashcard');
      }

      const updated = await response.json();
      alert('Cập nhật flashcard thành công!');
      onSuccess(updated);
    } catch (error) {
      console.error('Lỗi khi cập nhật flashcard:', error);
      alert((error as Error)?.message || 'Lỗi khi cập nhật flashcard!');
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 md:px-6 py-3 md:py-4 rounded-t-xl">
          <h2 className="text-lg md:text-xl font-bold text-white flex items-center">
            <svg className="w-5 h-5 md:w-6 md:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Chỉnh sửa flashcard
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5 md:space-y-6">
          {/* Ảnh flashcard */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2.5">
              Ảnh flashcard
            </label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-base text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              {imagePreview && (
                <div className="mt-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-blue-200">
                  <p className="text-sm font-medium text-gray-700 mb-2.5">
                    {formData.image ? 'Preview ảnh mới đã chọn:' : 'Ảnh hiện tại:'}
                  </p>
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-48 w-auto max-w-full object-contain rounded-lg shadow-md border-2 border-white"
                      onLoad={() => {
                        console.log('✅ Ảnh load thành công (form sửa):', imagePreview);
                      }}
                      onError={(e) => {
                        console.error('❌ Lỗi tải ảnh preview (form sửa):', imagePreview);
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                        const parent = img.parentElement;
                        if (parent && !parent.querySelector('.error-placeholder')) {
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'error-placeholder h-48 w-full bg-gray-200 rounded-lg flex flex-col items-center justify-center';
                          const shortUrl = imagePreview ? (imagePreview.length > 60 ? imagePreview.substring(0, 60) + '...' : imagePreview) : 'N/A';
                          errorDiv.innerHTML = `<svg class="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-sm text-gray-500 font-medium">Không thể tải ảnh</p><p class="text-xs text-gray-400 mt-1 text-center px-2 break-all">${shortUrl}</p>`;
                          parent.appendChild(errorDiv);
                        }
                      }}
                    />
                    {formData.image && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-semibold max-w-[200px] truncate" title={formData.image.name}>
                        {formData.image.name}
                      </div>
                    )}
                    {!formData.image && flashcard.image_url && (
                      <div className="absolute top-2 right-2 bg-gray-600 text-white text-sm px-3 py-1 rounded-full font-semibold max-w-[200px] truncate" title={getFileNameFromUrl(flashcard.image_url)}>
                        {getFileNameFromUrl(flashcard.image_url) || 'Ảnh hiện tại'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Câu trả lời và Trạng thái cùng hàng */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Câu trả lời <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full min-h-[3.5rem] h-[3.5rem] border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none bg-gray-50 hover:bg-white leading-normal"
                placeholder="Nhập câu trả lời cho flashcard..."
                style={{ height: '3.5rem', lineHeight: '1.5rem' }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-[3.5rem] border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white font-medium"
              >
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 text-base border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang cập nhật...
                </span>
              ) : (
                'Cập nhật flashcard'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


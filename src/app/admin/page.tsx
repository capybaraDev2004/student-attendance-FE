"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

// Interface cho thống kê
interface AdminStats {
  totalUsers: number;
  totalVocabulary: number;
  totalSentences: number;
  totalFlashcards: number;
  totalNews: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string | undefined;
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVocabulary: 0,
    totalSentences: 0,
    totalFlashcards: 0,
    totalNews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lấy thống kê từ API (gộp 1 request để nhanh hơn)
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated" || !accessToken) {
      setLoading(false);
      setErrorMessage("Bạn cần đăng nhập với quyền quản trị để xem thống kê.");
      return;
    }

    const fetchStats = async () => {
      try {
        setErrorMessage(null);
        const data = await apiFetch<{ users: number; flashcards: number; vocabulary: number; sentences: number; news: number }>("/admin/stats", {
          authToken: accessToken,
        });
        setStats({
          totalUsers: data?.users ?? 0,
          totalSentences: data?.sentences ?? 0,
          totalFlashcards: data?.flashcards ?? 0,
          totalVocabulary: data?.vocabulary ?? 0,
          totalNews: data?.news ?? 0,
        });
      } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
        setErrorMessage((error as Error)?.message || 'Lỗi khi tải thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [status, accessToken]);

  // Có thể bật refresh định kỳ nếu thật sự cần realtime số từ vựng
  // useEffect(() => {
  //   const id = setInterval(async () => {
  //     try {
  //       const res = await fetch(`/api/admin/stats?ts=${Date.now()}` as any, { cache: 'no-store' });
  //       if (res.ok) {
  //         const data = await res.json();
  //         setStats(prev => ({ ...prev, totalVocabulary: data?.totalVocabulary ?? prev.totalVocabulary }));
  //       }
  //     } catch {}
  //   }, 30000);
  //   return () => clearInterval(id);
  // }, []);

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
        Bạn cần đăng nhập với quyền quản trị để truy cập Admin Dashboard.
      </div>
    );
  }

  if (session?.user?.role !== 'admin') {
    return (
      <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg p-4">
        Tài khoản của bạn không có quyền truy cập Admin Dashboard.
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
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl shadow-sm border border-emerald-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
          </div>
          <span>Chào mừng đến với Admin Dashboard</span>
        </h1>
        <p className="text-gray-600 mt-3 ml-15">
          Xin chào, <span className="font-semibold text-emerald-700">{session?.user?.name || session?.user?.email}</span>! 
          Quản lý hệ thống học tiếng Trung một cách hiệu quả.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
          {errorMessage}
        </div>
      )}

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Tổng số người dùng */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tổng số từ vựng */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng từ vựng</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalVocabulary}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tổng số câu nói */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng câu nói</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSentences}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tổng số flashcard */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng flashcard</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalFlashcards}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tổng số tin tức */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng tin tức</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalNews}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Các hành động nhanh */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/users"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Quản lý người dùng</p>
              <p className="text-sm text-gray-600">Thêm, sửa, xóa người dùng</p>
            </div>
          </a>

          <a
            href="/admin/vocabulary"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Quản lý từ vựng</p>
              <p className="text-sm text-gray-600">Thêm, sửa, xóa từ vựng</p>
            </div>
          </a>

          <a
            href="/admin/sentences"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Quản lý câu nói</p>
              <p className="text-sm text-gray-600">Thêm, sửa, xóa câu nói</p>
            </div>
          </a>

          <a
            href="/admin/flashcards"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Quản lý flashcard</p>
              <p className="text-sm text-gray-600">Thêm, sửa, xóa flashcard</p>
            </div>
          </a>

          <a
            href="/admin/news"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Quản lý tin tức</p>
              <p className="text-sm text-gray-600">Thêm, sửa, xóa tin tức</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

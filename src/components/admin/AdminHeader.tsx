"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminHeader({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo và tiêu đề */}
        <div className="flex items-center space-x-4">
          {/* Nút mở sidebar trên mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Mở menu quản trị"
            onClick={onToggleSidebar}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              管
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </Link>
        </div>

        {/* Thông tin người dùng */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-sm font-medium text-emerald-700">
                {session?.user?.name?.charAt(0).toUpperCase() ||
                 session?.user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.name || session?.user?.email}
              </p>
              <p className="text-xs text-gray-500">Quản trị viên</p>
            </div>
          </div>

          {/* Nút quay về trang chủ */}
          <Link
            href="/"
            className="hidden md:flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Về trang chủ</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

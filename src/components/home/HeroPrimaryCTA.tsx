"use client";

import { useSession } from "next-auth/react";

export default function HeroPrimaryCTA() {
  const { data: session, status } = useSession();

  // Đợi trạng thái session để tránh nhấp nháy
  if (status === "loading") {
    return null;
  }

  // Đã đăng nhập thì ẩn nút
  if (session?.user) {
    return null;
  }

  return (
    <a
      href="/register"
      className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-emerald-500/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <span className="relative z-10">Bắt đầu miễn phí</span>
      <svg
        className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </a>
  );
}


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginRequiredModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoToLogin = () => {
    router.push("/login");
    onClose();
  };

  const handleGoHome = () => {
    router.push("/");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg
              className="h-8 w-8 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            Yêu cầu đăng nhập
          </h2>
          <p className="mb-6 text-slate-600">
            Bạn phải đăng nhập thì mới được học. Vui lòng đăng nhập để tiếp tục.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoToLogin}
              className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
            >
              Đăng nhập ngay
            </button>
            <button
              onClick={handleGoHome}
              className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-300"
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

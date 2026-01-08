"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function SetPasswordPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }

  const mustSetPassword = session?.user?.mustSetPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) {
      setErrorMessage("Không tìm thấy token đăng nhập. Vui lòng đăng nhập lại.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await apiFetch("/auth/set-password", {
        method: "POST",
        authToken: session.accessToken,
        body: JSON.stringify({ password, confirmPassword }),
      });
      setSuccessMessage("Đặt mật khẩu thành công! Đang chuyển về trang chính...");
      setPassword("");
      setConfirmPassword("");
      await update({ mustSetPassword: false });
      setTimeout(() => router.replace("/dashboard"), 1200);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 11c-1.105 0-2 .672-2 1.5S10.895 14 12 14s2-.672 2-1.5S13.105 11 12 11z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17 11V7a5 5 0 10-10 0v4m-2 0h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Đặt mật khẩu cho CapyChina</h1>
          <p className="text-gray-600 text-sm">
            {mustSetPassword
              ? "Vì bạn đăng nhập bằng Google lần đầu, hãy đặt mật khẩu để đăng nhập cho những lần sau."
              : "Bạn có thể thay đổi mật khẩu để bảo vệ tài khoản tốt hơn."}
          </p>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg px-4 py-3">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ít nhất 6 ký tự"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Đang cập nhật..." : "Lưu mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}


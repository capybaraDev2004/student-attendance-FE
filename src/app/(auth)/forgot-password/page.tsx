"use client";

import axios from "axios";
import { signIn } from "next-auth/react";
import { useMemo, useState, useEffect } from "react";

type Step = "request" | "reset";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>("request");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formattedCountdown = useMemo(() => {
    const m = Math.floor(countdown / 60)
      .toString()
      .padStart(2, "0");
    const s = (countdown % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [countdown]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setMessage(res.data?.message || "Đã gửi mã OTP. Vui lòng kiểm tra email.");
      setCountdown(Number(res.data?.expiresIn) || 300);
      setStep("reset");
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Không thể gửi OTP. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await axios.post("/api/auth/reset-password", {
        email,
        code: code.trim(),
        password,
        confirmPassword,
      });
      setMessage("Đặt lại mật khẩu thành công! Đang đăng nhập...");
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.ok) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/login";
      }
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Không thể đặt lại mật khẩu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card max-w-lg">
        <div className="auth-header">
          <div className="auth-icon">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.6}
                d="M12 11c-1.105 0-2 .672-2 1.5S10.895 14 12 14s2-.672 2-1.5S13.105 11 12 11z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.6}
                d="M17 11V7a5 5 0 10-10 0v4m-2 0h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z"
              />
            </svg>
          </div>
          <h1 className="auth-title">Quên mật khẩu</h1>
          <p className="auth-subtitle">
            Nhập email để nhận mã OTP, sau đó đặt lại mật khẩu và đăng nhập.
          </p>
        </div>

        {message && (
          <div className="success-notification">
            <div className="success-content">
              <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="success-text">
                <div className="success-message">{message}</div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-notification">
            <div className="error-content">
              <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="error-text">
                <div className="error-message">{error}</div>
              </div>
            </div>
          </div>
        )}

        {step === "request" ? (
          <form onSubmit={handleRequestOtp} className="auth-form space-y-4">
            <div className="auth-input-group">
              <svg className="auth-input-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <input
                type="email"
                className="auth-input"
                placeholder="Nhập email đã đăng ký"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Đang gửi mã..." : "Gửi mã OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="auth-form space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  className="auth-input tracking-[0.4em] text-center font-semibold"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                {countdown > 0 && (
                  <p className="text-xs text-gray-500 mt-1">Mã hết hạn sau {formattedCountdown}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  className="auth-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="auth-button"
              disabled={loading || code.length !== 6}
            >
              {loading ? "Đang đặt mật khẩu..." : "Đặt mật khẩu & đăng nhập"}
            </button>
          </form>
        )}

        <div className="auth-link">
          <p>
            Quay lại{" "}
            <a href="/login" className="text-emerald-600 font-semibold">
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


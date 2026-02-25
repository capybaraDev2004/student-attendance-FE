"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formattedCountdown = useMemo(() => {
    const minutes = Math.floor(countdown / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (countdown % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [countdown]);

  const attemptCredentialsLogin = () =>
    signIn("credentials", {
      redirect: false,
      email,
      password,
    });

  const parseErrorResponse = (raw?: string | null) => {
    if (!raw) {
      return null;
    }
    const cleaned = raw.startsWith("Error: ") ? raw.replace("Error: ", "") : raw;
    try {
      return JSON.parse(cleaned);
    } catch {
      return { message: cleaned };
    }
  };

  // Tích hợp NextAuth credentials
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowErrorMessage(false);
    
    const result = await attemptCredentialsLogin();
    const parsedError = parseErrorResponse(result?.error);
    
    if (result?.ok) {
      // Hiển thị thông báo thành công
      setShowSuccessMessage(true);
      
      // Delay 1 giây rồi điều hướng
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } else {
      if (parsedError?.code === "EMAIL_NOT_VERIFIED") {
        setNeedsVerification(true);
        setVerificationEmail(parsedError.email || email);
        setCountdown(Number(parsedError.expiresIn) || 300);
        setErrorMessage("Tài khoản chưa được kích hoạt. Vui lòng xác thực email trước khi đăng nhập.");
      } else {
        setErrorMessage(parsedError?.message || "Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      }
      setShowErrorMessage(true);
    }
    
    setIsLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationEmail) {
      return;
    }
    setVerifyLoading(true);
    setVerifyError("");

    try {
      await axios.post("/api/auth/verify-email", {
        email: verificationEmail,
        code: verificationCode.trim(),
      });
      setNeedsVerification(false);
      setShowErrorMessage(false);
      const result = await attemptCredentialsLogin();
      if (result?.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => (window.location.href = "/dashboard"), 1000);
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Xác thực thất bại.";
      setVerifyError(message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!verificationEmail) {
      return;
    }
    setResendLoading(true);
    setVerifyError("");
    try {
      const response = await axios.post("/api/auth/resend-code", {
        email: verificationEmail,
      });
      const expires = Number(response.data?.expiresIn) || 300;
      setCountdown(expires);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Không thể gửi lại mã.";
      setVerifyError(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card relative">
        <div className="auth-header">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang chủ
          </button>
          <div className="auth-icon">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="auth-title">Chào mừng trở lại!</h1>
          <p className="auth-subtitle">Đăng nhập để tiếp tục học tiếng Trung</p>
        </div>

        {/* Thông báo thành công */}
        {showSuccessMessage && (
          <div className="success-notification">
            <div className="success-content">
              <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="success-text">
                <div className="success-title">Đăng nhập thành công!</div>
                <div className="success-message">Đã đăng nhập thành công, bạn vui lòng chờ chút để được điều hướng</div>
              </div>
            </div>
          </div>
        )}

        {/* Thông báo lỗi */}
        {showErrorMessage && (
          <div className="error-notification">
            <div className="error-content">
              <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="error-text">
                <div className="error-title">Đăng nhập thất bại</div>
                <div className="error-message">{errorMessage}</div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <svg className="auth-input-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <input
              type="email"
              className="auth-input"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <svg className="auth-input-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <input
              type="password"
              className="auth-input"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading || showSuccessMessage}>
            <span className="flex items-center justify-center">
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5z"/>
                  </svg>
                  Đăng nhập
                </>
              )}
            </span>
          </button>
        </form>

        <div className="mt-6 mb-6">
          <a
            href="/forgot-password"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 5v2m0 10v2m6-6h2M4 12H2m15.364-5.364l1.414 1.414M5.222 18.778l-1.414 1.414M5.222 5.222L3.808 6.636M18.778 18.778l1.414 1.414" />
            </svg>
            Quên mật khẩu? Nhấn để nhận lại
          </a>
        </div>

        {needsVerification && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3 mb-6">
            <p className="text-sm text-emerald-700">
              Tài khoản chưa được kích hoạt. Nhập mã xác thực gửi tới{" "}
              <span className="font-semibold">{verificationEmail}</span> để tiếp tục.
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-3">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Nhập mã gồm 6 ký tự"
                maxLength={6}
                className="w-full border border-emerald-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 tracking-[0.4em] text-center font-semibold bg-white"
                required
              />

              {verifyError && (
                <p className="text-sm text-red-600 text-center">{verifyError}</p>
              )}

              <button
                type="submit"
                disabled={verifyLoading || verificationCode.length !== 6}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                {verifyLoading ? "Đang xác thực..." : "Kích hoạt và đăng nhập"}
              </button>
            </form>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading || countdown > 0}
              className="w-full text-sm text-emerald-700 underline disabled:text-gray-500"
            >
              {resendLoading ? "Đang gửi lại..." : countdown > 0 ? `Có thể gửi lại sau ${formattedCountdown}` : "Gửi lại mã xác thực"}
            </button>
          </div>
        )}

        <div className="auth-divider">
          <span>hoặc</span>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="auth-social-btn mx-auto transition transform hover:-translate-y-0.5 hover:shadow-lg"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <svg className="auth-social-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Đăng nhập với Google
          </button>
          <button
            type="button"
            className="auth-social-btn facebook mx-auto"
            onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
          >
            <svg className="auth-social-icon text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.497v-9.294H9.691V11.01h3.131V8.41c0-3.1 1.892-4.788 4.657-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.716-1.796 1.767v2.316h3.587l-.467 3.696h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/>
            </svg>
            Đăng nhập với Facebook
          </button>
        </div>

        <div className="auth-link">
          <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
        </div>
      </div>
    </div>
  );
}



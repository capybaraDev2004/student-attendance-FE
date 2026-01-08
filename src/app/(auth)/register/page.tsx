"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";

type Region = "bac" | "trung" | "nam";

const REGISTER_PROVINCES = [
  "Hà Nội",
  "Hồ Chí Minh City",
  "Hải Phòng",
  "Đà Nẵng",
  "Cần Thơ",
  "Huế",
  "Lai Châu",
  "Điện Biên",
  "Sơn La",
  "Lào Cai",
  "Lạng Sơn",
  "Cao Bằng",
  "Thái Nguyên",
  "Phú Thọ",
  "Bắc Ninh",
  "Hưng Yên",
  "Ninh Bình",
  "Quảng Ninh",
  "Thanh Hóa",
  "Nghệ An",
  "Hà Tĩnh",
  "Quảng Trị",
  "Quảng Ngãi",
  "Gia Lai",
  "Khánh Hòa",
  "Lâm Đồng",
  "Đắk Lắk",
  "Đồng Nai",
  "Tây Ninh",
  "Vĩnh Long",
  "Đồng Tháp",
  "Cà Mau",
  "An Giang",
];

type RegisterStep = "form" | "verify";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState<Region | "">("");
  const [province, setProvince] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState<RegisterStep>("form");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!region || !province) {
      setErrorMessage("Vui lòng chọn đầy đủ miền và tỉnh/thành phố.");
      setShowErrorMessage(true);
      return;
    }
    setIsLoading(true);
    setShowErrorMessage(false);

    try {
      const res = await axios.post("/api/auth/register", {
        username,
        email,
        password,
        region,
        province,
      });
      if (res.status === 201) {
        const expires = Number(res.data?.expiresIn) || 300;
        setCountdown(expires);
        setVerificationEmail(email);
        setVerificationCode("");
        setStep("verify");
        setShowSuccessMessage(false);
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Đăng ký thất bại.";
      setErrorMessage(message);
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
      setShowSuccessMessage(true);
      setVerifyError("");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
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
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h1 className="auth-title">Tham gia CapyChina!</h1>
          <p className="auth-subtitle">Tạo tài khoản để bắt đầu hành trình học tiếng Trung</p>
        </div>

        {/* Thông báo thành công */}
        {showSuccessMessage && (
          <div className="success-notification">
            <div className="success-content">
              <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="success-text">
                <div className="success-title">Kích hoạt thành công!</div>
                <div className="success-message">Bạn sẽ được chuyển đến trang đăng nhập để bắt đầu trải nghiệm CapyChina.</div>
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
                <div className="error-title">Đăng ký thất bại</div>
                <div className="error-message">{errorMessage}</div>
              </div>
            </div>
          </div>
        )}

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <svg className="auth-input-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <input
                type="text"
                className="auth-input"
                placeholder="Tên người dùng"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="auth-input-group">
                <svg className="auth-input-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z" />
                </svg>
                <select
                  className="auth-input"
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region | "")}
                  required
                >
                  <option value="">Chọn miền</option>
                  <option value="bac">Miền Bắc</option>
                  <option value="trung">Miền Trung</option>
                  <option value="nam">Miền Nam</option>
                </select>
              </div>
              <div className="auth-input-group">
                <svg className="auth-input-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                </svg>
                <select
                  className="auth-input"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                >
                  <option value="">Chọn tỉnh / thành phố</option>
                  {REGISTER_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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

            <button type="submit" className="auth-button" disabled={isLoading}>
              <span className="flex items-center justify-center">
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    Tạo tài khoản
                  </>
                )}
              </span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="auth-form space-y-4">
            <div className="text-center text-gray-700">
              <p className="font-semibold">Nhập mã xác thực</p>
              <p className="text-sm mt-1">
                Mã đã được gửi tới <span className="font-medium text-emerald-600">{verificationEmail}</span>. Mã có hiệu lực trong {formattedCountdown}.
              </p>
            </div>

            <div className="auth-input-group">
              <svg className="auth-input-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 112.21 11H5l4 4-4 4H2.21A9.004 9.004 0 1021 12.79z" />
              </svg>
              <input
                type="text"
                className="auth-input tracking-[0.4em] text-center uppercase"
                placeholder="Nhập mã gồm 6 ký tự"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            {verifyError && (
              <p className="text-sm text-red-600 text-center">{verifyError}</p>
            )}

            <button type="submit" className="auth-button" disabled={verifyLoading || verificationCode.length !== 6}>
              <span className="flex items-center justify-center">
                {verifyLoading ? (
                  <>
                    <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Đang xác thực...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 5v14m7-7H5" />
                    </svg>
                    Kích hoạt tài khoản
                  </>
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading || countdown > 0}
              className="text-sm text-emerald-600 hover:text-emerald-700 underline disabled:text-gray-400"
            >
              {resendLoading ? "Đang gửi lại mã..." : countdown > 0 ? `Có thể gửi lại sau ${formattedCountdown}` : "Gửi lại mã xác thực"}
            </button>
          </form>
        )}

        <div className="auth-link">
          <p>Đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
        </div>
      </div>
    </div>
  );
}



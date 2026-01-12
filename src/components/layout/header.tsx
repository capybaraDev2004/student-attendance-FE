"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import LoginRequiredModal from "../auth/LoginRequiredModal";
import VipPackageModal from "../payment/VipPackageModal";

export default function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showVipModal, setShowVipModal] = useState(false);
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isAdmin = mounted && session?.user?.role === "admin";
    const isLoggedIn = mounted && !!session?.user; // Cho phép hiển thị Dashboard cho mọi người dùng đã đăng nhập

	const handleStartLearningClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!isLoggedIn) {
			e.preventDefault();
			setShowLoginModal(true);
		}
	};

	return (
		<>
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
                <div className="container">
					<div className="flex h-16 items-center justify-between">
						{/* Logo */}
						<Link href="/" className="flex items-center space-x-2 group">
							<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm transform group-hover:scale-105 transition-transform duration-300">
								中
							</div>
							<span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
								CapyChina
							</span>
						</Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
							<Link 
								className={`nav-link ${pathname === "/" ? "active" : ""}`} 
								href="/"
							>
								Trang chủ
							</Link>
                            {isLoggedIn && (
                                <Link 
                                    className={`nav-link ${pathname?.startsWith("/dashboard") ? "active" : ""}`} 
                                    href="/dashboard"
                                >
                                    Dashboard
                                </Link>
                            )}
							<Link 
								className={`nav-link ${pathname?.startsWith("/roadmap") ? "active" : ""}`} 
								href="/roadmap"
							>
								Lộ trình
							</Link>
						<Link 
							className={`nav-link ${pathname?.startsWith("/capychina") ? "active" : ""}`} 
							href="/capychina"
							onClick={handleStartLearningClick}
						>
							Bắt đầu học
						</Link>
							<Link 
								className={`nav-link ${pathname?.startsWith("/vocabulary") ? "active" : ""}`} 
								href="/vocabulary"
							>
								Từ vựng
							</Link>
						</nav>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center space-x-3">
                            {!mounted || status === "loading" ? (
                                <>
                                    <span className="btn btn-ghost btn-sm pointer-events-none opacity-60">Đăng nhập</span>
                                    <span className="btn btn-primary btn-sm pointer-events-none opacity-60">Đăng ký</span>
                                </>
                            ) : !session?.user ? (
                                <>
                                    <Link href="/login" className="btn btn-ghost btn-sm">Đăng nhập</Link>
                                    <Link href="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
                                </>
                            ) : (
                                <div className="relative">
                                    {/* Tên người dùng với dropdown trigger */}
                                    <button
                                        className={`flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-lg hover:shadow-amber-200/70 transition ${
                                            session.user.account_status === 'vip'
                                                ? 'border border-amber-300'
                                                : 'border border-slate-200'
                                        }`}
                                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    >
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-semibold">
                                            {session.user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-sm font-semibold text-slate-800">
                                                {session.user.name}
                                            </span>
                                            {session.user.account_status === 'vip' && (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                        <path d="M12 2l2.39 5.3L20 7.58l-4 3.89.95 5.66L12 14.77l-4.95 2.36L8 11.47 4 7.58l5.61-.28L12 2z"/>
                                                    </svg>
                                                    VIP
                                                </span>
                                            )}
                                        </div>
                                        <svg
                                            className={`w-4 h-4 text-slate-500 transition ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown menu */}
                                    {isUserDropdownOpen && (
                                        <div 
                                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50"
                                        >
                                            {session.user.account_status !== 'vip' && (
                                                <button
                                                    onClick={() => {
                                                        setIsUserDropdownOpen(false);
                                                        setShowVipModal(true);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors duration-200 font-semibold"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2l2.39 5.3L20 7.58l-4 3.89.95 5.66L12 14.77l-4.95 2.36L8 11.47 4 7.58l5.61-.28L12 2z"/>
                                                        </svg>
                                                        <span>Mua VIP Ngay</span>
                                                    </div>
                                                </button>
                                            )}
                                            
                                            <Link 
                                                href="/profile" 
                                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span>Cập nhật tài khoản</span>
                                                </div>
                                            </Link>
                                            
                                            {isAdmin && (
                                                <Link 
                                                    href="/admin" 
                                                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                        </svg>
                                                        <span>Admin Dashboard</span>
                                                    </div>
                                                </Link>
                                            )}
                                            
                                            <button 
                                                onClick={() => {
                                                    signOut({ callbackUrl: "/" });
                                                    setIsUserDropdownOpen(false);
                                                }} 
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    <span>Đăng xuất</span>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

						{/* Mobile Menu Button */}
						<button 
							className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-300"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							aria-label="Toggle mobile menu"
						>
							<div className="w-6 h-6 flex flex-col justify-center items-center">
								<span className={`block h-0.5 w-6 bg-slate-600 transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
								<span className={`block h-0.5 w-6 bg-slate-600 transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'mt-1'}`} />
								<span className={`block h-0.5 w-6 bg-slate-600 transform transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'mt-1'}`} />
							</div>
						</button>
					</div>
				</div>
			</header>

            {/* Mobile Menu Overlay: thiết kế mới với chia ô rõ ràng */}
			{isMobileMenuOpen && (
				<div className="mobile-menu">
					{/* Nút đóng menu */}
					<button 
						className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
						onClick={() => setIsMobileMenuOpen(false)}
						aria-label="Đóng menu"
					>
						<svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>

					<div className="mobile-menu-content">
						{/* Phần menu chính */}
						<div className="mobile-menu-section">
							<Link 
								href="/" 
								className={`mobile-menu-item ${pathname === "/" ? "active" : ""}`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
								</svg>
								<span className="mobile-menu-text">Trang chủ</span>
							</Link>

							{isLoggedIn && (
								<Link 
									href="/dashboard" 
									className={`mobile-menu-item ${pathname?.startsWith("/dashboard") ? "active" : ""}`}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
									</svg>
									<span className="mobile-menu-text">Dashboard</span>
								</Link>
							)}

							<Link 
								href="/roadmap" 
								className={`mobile-menu-item ${pathname?.startsWith("/roadmap") ? "active" : ""}`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
								</svg>
								<span className="mobile-menu-text">Lộ trình</span>
							</Link>

						<Link 
							href="/capychina" 
							className={`mobile-menu-item ${pathname?.startsWith("/capychina") ? "active" : ""}`}
							onClick={(e) => {
								if (!isLoggedIn) {
									e.preventDefault();
									setIsMobileMenuOpen(false);
									setShowLoginModal(true);
								} else {
									setIsMobileMenuOpen(false);
								}
							}}
						>
							<svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-8V6a2 2 0 012-2h2a2 2 0 012 2v2M7 7h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" />
							</svg>
							<span className="mobile-menu-text">Bắt đầu học</span>
						</Link>

							<Link 
								href="/vocabulary" 
								className={`mobile-menu-item ${pathname?.startsWith("/vocabulary") ? "active" : ""}`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<svg className="mobile-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								<span className="mobile-menu-text">Từ vựng</span>
							</Link>
						</div>

						{/* Phần thông tin user hoặc nút đăng nhập/đăng ký */}
						{!mounted || status === "loading" ? (
							<div className="mobile-auth-section">
								<span className="mobile-auth-btn mobile-auth-btn-outline pointer-events-none opacity-60">
									<svg className="mobile-auth-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
									</svg>
									Đăng nhập
								</span>
								<span className="mobile-auth-btn mobile-auth-btn-primary pointer-events-none opacity-60">
									<svg className="mobile-auth-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
									</svg>
									Đăng ký
								</span>
							</div>
						) : !session?.user ? (
							<div className="mobile-auth-section">
								<Link 
									href="/login" 
									className="mobile-auth-btn mobile-auth-btn-outline"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<svg className="mobile-auth-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
									</svg>
									Đăng nhập
								</Link>
								<Link 
									href="/register" 
									className="mobile-auth-btn mobile-auth-btn-primary"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<svg className="mobile-auth-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
									</svg>
									Đăng ký
								</Link>
							</div>
						) : (
							<>
								{/* Thông tin user với dropdown */}
								<div className="mobile-user-section">
									<button 
										className="mobile-user-info"
										onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
									>
										<div className="mobile-user-avatar">
											{session.user.name?.charAt(0).toUpperCase() || 'U'}
										</div>
										<span className="mobile-user-name">{session.user.name}</span>
										<svg className={`w-5 h-5 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</button>

									{/* Mobile dropdown menu */}
									{isUserDropdownOpen && (
										<div className="mobile-dropdown-section">
											{session.user.account_status !== 'vip' && (
												<button
													onClick={() => {
														setIsUserDropdownOpen(false);
														setIsMobileMenuOpen(false);
														setShowVipModal(true);
													}}
													className="mobile-dropdown-item"
													style={{ color: '#d97706', fontWeight: '600' }}
												>
													<svg className="mobile-dropdown-icon" fill="currentColor" viewBox="0 0 24 24">
														<path d="M12 2l2.39 5.3L20 7.58l-4 3.89.95 5.66L12 14.77l-4.95 2.36L8 11.47 4 7.58l5.61-.28L12 2z"/>
													</svg>
													<span className="mobile-dropdown-text">Mua VIP Ngay</span>
												</button>
											)}
											
											<Link 
												href="/profile" 
												className="mobile-dropdown-item"
												onClick={() => {
													setIsUserDropdownOpen(false);
													setIsMobileMenuOpen(false);
												}}
											>
												<svg className="mobile-dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
												</svg>
												<span className="mobile-dropdown-text">Cập nhật tài khoản</span>
											</Link>

											{isAdmin && (
												<Link 
													href="/admin" 
													className="mobile-dropdown-item"
													onClick={() => {
														setIsUserDropdownOpen(false);
														setIsMobileMenuOpen(false);
													}}
												>
													<svg className="mobile-dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
													</svg>
													<span className="mobile-dropdown-text">Admin Dashboard</span>
												</Link>
											)}

											<button 
												onClick={() => {
													signOut({ callbackUrl: "/" });
													setIsUserDropdownOpen(false);
													setIsMobileMenuOpen(false);
												}} 
												className="mobile-dropdown-item mobile-dropdown-logout"
											>
												<svg className="mobile-dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
												</svg>
												<span className="mobile-dropdown-text">Đăng xuất</span>
											</button>
										</div>
									)}
								</div>
							</>
						)}
					</div>
				</div>
			)}

			{/* Modal yêu cầu đăng nhập */}
			<LoginRequiredModal 
				isOpen={showLoginModal} 
				onClose={() => setShowLoginModal(false)} 
			/>

			{/* Modal chọn gói VIP */}
			{isLoggedIn && (
				<VipPackageModal 
					isOpen={showVipModal} 
					onClose={() => setShowVipModal(false)} 
				/>
			)}
		</>
	);
}
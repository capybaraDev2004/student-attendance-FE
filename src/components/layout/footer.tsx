"use client";

import { useEffect, useState } from "react";

function YearNow() {
	// Hiển thị năm ở client để tránh sai lệch múi giờ giữa server/client
	const [year, setYear] = useState<string>("");
	useEffect(() => {
		setYear(String(new Date().getFullYear()));
	}, []);
	return <span suppressHydrationWarning>{year}</span>;
}

export default function Footer() {
	return (
        <footer className="bg-slate-900 border-t border-slate-800">
            <div className="container">
                <div className="py-3">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Brand & Description */}
						<div>
							<div className="flex items-center space-x-2 mb-4">
								<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
									中
								</div>
								<span className="text-2xl font-bold text-white">
									CapyChina
								</span>
							</div>
							<p className="text-slate-400 leading-relaxed mb-6">
								Nền tảng học tiếng Trung hiện đại, giúp bạn tiếp thu kiến thức một cách hiệu quả và thú vị nhất.
							</p>
							
							{/* Contact Info */}
							<div className="space-y-3">
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
										<svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
											<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
										</svg>
									</div>
									<span className="text-slate-400 text-sm">capybaradev2004@gmail.com</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
										<svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
											<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
										</svg>
									</div>
									<span className="text-slate-400 text-sm">+84 352 135 115</span>
								</div>
							</div>
						</div>
						
						{/* Links & Support */}
						<div className="grid grid-cols-2 gap-6">
							<div>
								<h3 className="text-white font-semibold mb-4 text-lg">Liên kết nhanh</h3>
								<ul className="space-y-3">
									<li><a href="/lessons" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-2">
										<span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
										<span>Bài học</span>
									</a></li>
									<li><a href="/vocabulary" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-2">
										<span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
										<span>Từ vựng</span>
									</a></li>
									<li><a href="/progress" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-2">
										<span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
										<span>Tiến độ</span>
									</a></li>
								</ul>
							</div>
							
							<div>
								<h3 className="text-white font-semibold mb-4 text-lg">Hỗ trợ</h3>
								<ul className="space-y-3">
									<li><a href="/help" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-2">
										<span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
										<span>Trung tâm trợ giúp</span>
									</a></li>
									<li><a href="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-2">
										<span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
										<span>Liên hệ</span>
									</a></li>
									<li><a href="/privacy" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-2">
										<span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
										<span>Chính sách bảo mật</span>
									</a></li>
									<li><a href="/terms" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-2">
										<span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
										<span>Điều khoản</span>
									</a></li>
								</ul>
							</div>
						</div>
						
						{/* Map */}
						<div>
							<h3 className="text-white font-semibold mb-4 text-lg">Vị trí</h3>
							<div className="rounded-xl overflow-hidden shadow-lg border border-slate-700">
								<iframe 
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.640805332153!2d105.75986217597001!3d21.04705358714864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454c3ce577141%3A0xb1a1ac92701777bc!2sHanoi%20University%20of%20Natural%20Resources%20and%20Environment!5e0!3m2!1sen!2s!4v1760027551502!5m2!1sen!2s" 
									width="100%" 
									height="200" 
									style={{border: 0}} 
									allowFullScreen 
									loading="lazy" 
									referrerPolicy="no-referrer-when-downgrade"
									title="CapyChina Location"
								></iframe>
							</div>
							<p className="text-slate-400 text-sm mt-3">
								Trường Đại học Tài nguyên và Môi trường Hà Nội
							</p>
						</div>
					</div>
					
                    {/* Bottom */}
                    <div className="pt-8 mt-8 border-t border-slate-800">
						<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
							<p className="text-slate-400 text-sm">
								© <YearNow /> CapyChina. All rights reserved.
							</p>
                            <div className="flex items-center space-x-4">
                                {/* Facebook */}
                                <a href="https://www.facebook.com/capybara.nguyen.282198?locale=vi_VN" aria-label="Facebook" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.3V12h2.3V9.8c0-2.3 1.37-3.6 3.47-3.6.99 0 2.03.18 2.03.18v2.24h-1.14c-1.12 0-1.46.7-1.46 1.42V12h2.49l-.4 2.9h-2.09v7A10 10 0 0 0 22 12z"/>
                                    </svg>
                                </a>
                                {/* Instagram */}
                                <a href="#" aria-label="Instagram" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                                    </svg>
                                </a>
                                {/* YouTube */}
                                <a href="#" aria-label="YouTube" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.8 3.5 12 3.5 12 3.5s-7.8 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .6 5.8 3 3 0 0 0 2.1 2.1C4.2 20.5 12 20.5 12 20.5s7.8 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.75 15.5v-7L16 12l-6.25 3.5z"/>
                                    </svg>
                                </a>
                                {/* Twitter/X */}
                                <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M3 3h3.9l4.2 6 4.1-6H19l-6.2 8.9L19.5 21h-3.9l-4.5-6.6L6.6 21H5l6.6-9.5L3 3z"/>
                                    </svg>
                                </a>
                            </div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

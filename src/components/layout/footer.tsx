"use client";

import Link from "next/link";
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
		<footer className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-t border-slate-800/50 overflow-hidden">
			{/* Decorative background elements */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
			</div>

			<div className="container relative z-10">
				<div className="py-12 lg:py-16">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
						{/* Brand & Description */}
						<div className="lg:col-span-1">
							<Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
								<div className="relative">
									<div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
									<div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
										中
									</div>
								</div>
								<span className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
									CapyChina
								</span>
							</Link>
							<p className="text-slate-400 leading-relaxed mb-6 text-sm lg:text-base">
								Nền tảng học tiếng Trung hiện đại, giúp bạn tiếp thu kiến thức một cách hiệu quả và thú vị nhất.
							</p>
							
							{/* Contact Info */}
							<div className="space-y-3">
								<a 
									href="mailto:capybaradev2004@gmail.com" 
									className="group flex items-center space-x-3 text-slate-400 hover:text-emerald-400 transition-all duration-300"
								>
									<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-emerald-600/30 transition-all duration-300 group-hover:scale-110">
										<svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
									</div>
									<span className="text-sm group-hover:translate-x-1 transition-transform inline-block">capybaradev2004@gmail.com</span>
								</a>
								<a 
									href="tel:+84352135115" 
									className="group flex items-center space-x-3 text-slate-400 hover:text-emerald-400 transition-all duration-300"
								>
									<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-emerald-600/30 transition-all duration-300 group-hover:scale-110">
										<svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
										</svg>
									</div>
									<span className="text-sm group-hover:translate-x-1 transition-transform inline-block">+84 352 135 115</span>
								</a>
							</div>
						</div>
						
						{/* Quick Links */}
						<div>
							<h3 className="text-white font-bold mb-6 text-lg relative inline-block">
								Liên kết nhanh
								<span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-transparent"></span>
							</h3>
							<ul className="space-y-3">
								<li>
									<Link href="/roadmap" className="group flex items-center space-x-3 text-slate-400 hover:text-emerald-400 transition-all duration-300">
										<span className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></span>
										<span className="group-hover:translate-x-1 transition-transform inline-block">Lộ trình học</span>
									</Link>
								</li>
								<li>
									<Link href="/vocabulary" className="group flex items-center space-x-3 text-slate-400 hover:text-emerald-400 transition-all duration-300">
										<span className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></span>
										<span className="group-hover:translate-x-1 transition-transform inline-block">Từ vựng</span>
									</Link>
								</li>
								<li>
									<Link href="/dashboard" className="group flex items-center space-x-3 text-slate-400 hover:text-emerald-400 transition-all duration-300">
										<span className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></span>
										<span className="group-hover:translate-x-1 transition-transform inline-block">Bảng điều khiển</span>
									</Link>
								</li>
								<li>
									<Link href="/profile" className="group flex items-center space-x-3 text-slate-400 hover:text-emerald-400 transition-all duration-300">
										<span className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></span>
										<span className="group-hover:translate-x-1 transition-transform inline-block">Hồ sơ</span>
									</Link>
								</li>
							</ul>
						</div>
						
						{/* Study Links */}
						<div>
							<h3 className="text-white font-bold mb-6 text-lg relative inline-block">
								Học tập
								<span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-transparent"></span>
							</h3>
							<ul className="space-y-3">
								<li>
									<Link href="/capychina" className="group flex items-center space-x-3 text-slate-400 hover:text-emerald-400 transition-all duration-300">
										<span className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></span>
										<span className="group-hover:translate-x-1 transition-transform inline-block">Học từ vựng</span>
									</Link>
								</li>
								<li>
									<Link href="/capychina" className="group flex items-center space-x-3 text-slate-400 hover:text-emerald-400 transition-all duration-300">
										<span className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></span>
										<span className="group-hover:translate-x-1 transition-transform inline-block">Đọc hiểu</span>
									</Link>
								</li>
								<li>
									<Link href="/capychina" className="group flex items-center space-x-3 text-slate-400 hover:text-emerald-400 transition-all duration-300">
										<span className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></span>
										<span className="group-hover:translate-x-1 transition-transform inline-block">Nghe hiểu</span>
									</Link>
								</li>
								<li>
									<Link href="/capychina" className="group flex items-center space-x-3 text-slate-400 hover:text-emerald-400 transition-all duration-300">
										<span className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform"></span>
										<span className="group-hover:translate-x-1 transition-transform inline-block">Luyện viết</span>
									</Link>
								</li>
							</ul>
						</div>
						
						{/* Location */}
						<div className="lg:col-span-1">
							<h3 className="text-white font-bold mb-6 text-lg relative inline-block">
								Vị trí
								<span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-transparent"></span>
							</h3>
							<div className="relative group rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300">
								<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
								<iframe 
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.640805332153!2d105.75986217597001!3d21.04705358714864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454c3ce577141%3A0xb1a1ac92701777bc!2sHanoi%20University%20of%20Natural%20Resources%20and%20Environment!5e0!3m2!1sen!2s!4v1760027551502!5m2!1sen!2s" 
									width="100%" 
									height="200" 
									style={{border: 0}} 
									allowFullScreen 
									loading="lazy" 
									referrerPolicy="no-referrer-when-downgrade"
									title="CapyChina Location"
									className="relative z-0"
								></iframe>
							</div>
							<p className="text-slate-400 text-sm mt-4 leading-relaxed">
								Trường Đại học Tài nguyên và Môi trường Hà Nội
							</p>
						</div>
					</div>
					
					{/* Bottom */}
					<div className="pt-12 mt-12 border-t border-slate-800/50">
						<div className="flex flex-col md:flex-row justify-between items-center gap-6">
							<div className="flex flex-col md:flex-row items-center gap-4">
								<p className="text-slate-400 text-sm">
									© <YearNow /> <span className="text-emerald-400 font-semibold">CapyChina</span>. All rights reserved.
								</p>
								<div className="flex items-center gap-2 text-slate-500 text-xs">
									<span>Made with</span>
									<svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
									</svg>
									<span>in Vietnam</span>
								</div>
							</div>
							
							{/* Social Media */}
							<div className="flex items-center space-x-4">
								<a 
									href="https://www.facebook.com/capybara.nguyen.282198?locale=vi_VN" 
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Facebook" 
									className="group relative w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
								>
									<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.3V12h2.3V9.8c0-2.3 1.37-3.6 3.47-3.6.99 0 2.03.18 2.03.18v2.24h-1.14c-1.12 0-1.46.7-1.46 1.42V12h2.49l-.4 2.9h-2.09v7A10 10 0 0 0 22 12z"/>
									</svg>
								</a>
								<a 
									href="#" 
									aria-label="Instagram" 
									className="group relative w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50"
								>
									<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
									</svg>
								</a>
								<a 
									href="#" 
									aria-label="YouTube" 
									className="group relative w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-red-500/50"
								>
									<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.8 3.5 12 3.5 12 3.5s-7.8 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .6 5.8 3 3 0 0 0 2.1 2.1C4.2 20.5 12 20.5 12 20.5s7.8 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.75 15.5v-7L16 12l-6.25 3.5z"/>
									</svg>
								</a>
								<a 
									href="#" 
									aria-label="Twitter" 
									className="group relative w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-gradient-to-br hover:from-sky-500 hover:to-sky-600 text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-sky-500/50"
								>
									<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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

"use client";

import { useSession } from "next-auth/react";

export default function FinalCTASection() {
  const { data: session, status } = useSession();
  
  // Chỉ hiển thị khi chưa đăng nhập
  if (status === "loading") {
    return null; // Hoặc loading skeleton nếu muốn
  }
  
  if (session?.user) {
    return null; // Đã đăng nhập thì không hiển thị
  }

  return (
    <section className="section relative overflow-hidden pb-2 pt-2">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-blue-500 to-amber-500 opacity-10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-amber-500/20 animate-gradient-x"></div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full text-emerald-700 font-semibold text-sm shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Bắt đầu hành trình của bạn ngay hôm nay
          </div>

          {/* Main heading */}
          <h2 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight">
            Sẵn sàng chinh phục<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-amber-600">
              tiếng Trung
            </span> chưa?
          </h2>

          {/* Description */}
          <p className="text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tham gia cùng hàng ngàn học viên đang thành công với phương pháp học hiện đại và khoa học
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a 
              href="/register" 
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-xl overflow-hidden"
            >
              <span className="relative z-10">Đăng ký miễn phí ngay</span>
              <svg className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            
            <a 
              href="/roadmap" 
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-2xl shadow-lg hover:shadow-xl hover:border-emerald-500 hover:text-emerald-600 transform hover:scale-105 transition-all duration-300 text-xl"
            >
              <span>Xem lộ trình học</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-slate-600">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-medium">Không cần thẻ tín dụng</span>
            </div>
            
            <div className="flex items-center gap-2 text-slate-600">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-medium">Hủy bất cứ lúc nào</span>
            </div>
            
            <div className="flex items-center gap-2 text-slate-600">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-medium">Học thử miễn phí 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
    </section>
  );
}

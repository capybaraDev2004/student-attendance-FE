export const dynamic = 'force-static';

import FinalCTASection from "@/components/home/FinalCTASection";
import HeroPrimaryCTA from "@/components/home/HeroPrimaryCTA";

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Enhanced with modern design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="section pb-2">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center">
              {/* Left: Content */}
              <div className="text-left space-y-7 animate-fade-in-up max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 font-semibold text-sm shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Nền tảng học tiếng Trung hiện đại
                </div>
                
                <h1 className="hero-title hero-title--home text-balance">
                  {/* Desktop/tablet: 2 lines */}
                  <span className="hidden sm:block">
                    <span className="block">
                      Học Tiếng Trung
                    </span>
                    <span className="block mt-3 text-emerald-700/90">
                      thông minh <span className="text-emerald-700/60"></span>
                    </span>
                  </span>

                  {/* Mobile: 3 lines (avoid awkward wraps) */}
                  <span className="block sm:hidden">
                    <span className="block">Học Tiếng Trung</span>
                    <span className="block mt-2">thông minh</span>
                    <span className="block mt-2 text-emerald-700/90">
                      và bền vững
                    </span>
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-2xl">
                  Lộ trình rõ ràng, flashcards SRS, luyện phát âm bằng AI và hệ thống gamification
                  giúp bạn giữ động lực mỗi ngày cho đến khi chinh phục HSK.
                </p>

                <div className="flex flex-wrap gap-4 lg:gap-5 pt-4">
                  <HeroPrimaryCTA />
                  
                  <a href="#features" className="group inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-emerald-600 text-emerald-700 font-bold rounded-2xl shadow-md hover:shadow-lg hover:bg-emerald-50 transform hover:-translate-y-1 transition-all duration-300">
                    <span>Khám phá tính năng</span>
                    <svg className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Right: Interactive visual */}
              <div className="relative animate-slide-in-right">
                {/* Main card with 3D effect */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 space-y-6 border border-slate-200">
                    {/* Header */}
                    <div className="text-center pb-4 border-b border-slate-100">
                      <h3 className="text-lg font-bold text-slate-800 mb-1">Tính năng nổi bật</h3>
                      <p className="text-sm text-slate-500">Khám phá những công cụ học tập hiện đại</p>
                    </div>

                    {/* Feature list with icons and labels */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { 
                          icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', 
                          label: 'Khóa học theo cấp độ',
                          color: 'primary' 
                        },
                        { 
                          icon: 'M13 10V3L4 14h7v7l9-11h-7z', 
                          label: 'Flashcards SRS',
                          color: 'secondary' 
                        },
                        { 
                          icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 
                          label: 'Video & Audio',
                          color: 'accent' 
                        },
                        { 
                          icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z', 
                          label: 'Luyện phát âm AI',
                          color: 'primary' 
                        },
                        { 
                          icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', 
                          label: 'Đọc & Viết chữ Hán',
                          color: 'secondary' 
                        },
                        { 
                          icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', 
                          label: 'Gamification',
                          color: 'accent' 
                        }
                      ].map((item, i) => (
                        <div 
                          key={i} 
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 group cursor-pointer"
                        >
                          <div className={`feature-icon-modern ${item.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            <svg className="icon-md text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                      <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl">
                        <p className="text-3xl font-bold text-emerald-600">5,500+</p>
                        <p className="text-sm text-slate-600 mt-1">Từ vựng HSK</p>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
                        <p className="text-3xl font-bold text-blue-600">1,500+</p>
                        <p className="text-sm text-slate-600 mt-1">Bài học</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-6 bg-white">
            <svg className="w-8 h-8 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.39 5.3L20 7.58l-4 3.89.95 5.66L12 14.77l-4.95 2.36L8 11.47 4 7.58l5.61-.28L12 2z"/>
            </svg>
          </span>
        </div>
      </div>

      {/* Lộ trình học HSK - Modern Timeline */}
      <section className="section bg-gradient-to-b from-transparent via-slate-50/50 to-transparent pb-2 pt-2">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 font-semibold text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              Lộ trình học tập
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900">
              Lộ trình <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-amber-600">HSK</span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
              Chinh phục tiếng Trung từ cơ bản đến nâng cao với lộ trình được thiết kế khoa học
            </p>
          </div>

          <div className="mt-12">
            {/* Modern Roadmap Container */}
            <div className="relative">
              {/* Animated gradient line */}
              <div className="absolute top-20 left-0 right-0 h-1 hidden lg:block overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 animate-gradient-x"></div>
              </div>
              
              {/* Roadmap Steps */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
                {/* Step 1: XÂY NỀN */}
                <div className="roadmap-step-modern group">
                  <div className="roadmap-number-modern bg-gradient-to-br from-emerald-500 to-emerald-600 group-hover:scale-110 group-hover:rotate-12">
                    1
                  </div>
                  <div className="roadmap-card-modern border-emerald-200 group-hover:border-emerald-400 group-hover:shadow-emerald-200/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <div className="relative">
                      <div className="roadmap-header">
                        <h3 className="roadmap-title-modern text-emerald-700">XÂY NỀN</h3>
                        <p className="roadmap-level-modern bg-emerald-100 text-emerald-700">HSK 0 - 2</p>
                      </div>
                      <div className="roadmap-content space-y-3 mt-4">
                        <div className="roadmap-item-modern">
                          <span className="roadmap-icon-modern bg-emerald-100 text-emerald-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                          </span>
                          <span className="text-slate-700">600 từ vựng, 92 điểm ngữ pháp</span>
                        </div>
                        <div className="roadmap-item-modern">
                          <span className="roadmap-icon-modern bg-emerald-100 text-emerald-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                          </span>
                          <span className="text-slate-700">Giao tiếp cơ bản hàng ngày</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: KHỞI ĐỘNG */}
                <div className="roadmap-step-modern group">
                  <div className="roadmap-number-modern bg-gradient-to-br from-blue-500 to-blue-600 group-hover:scale-110 group-hover:rotate-12">
                    2
                  </div>
                  <div className="roadmap-card-modern border-blue-200 group-hover:border-blue-400 group-hover:shadow-blue-200/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <div className="relative">
                      <div className="roadmap-header">
                        <h3 className="roadmap-title-modern text-blue-700">KHỞI ĐỘNG</h3>
                        <p className="roadmap-level-modern bg-blue-100 text-blue-700">HSK 3</p>
                      </div>
                      <div className="roadmap-content space-y-3 mt-4">
                        <div className="roadmap-item-modern">
                          <span className="roadmap-icon-modern bg-blue-100 text-blue-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                          </span>
                          <span className="text-slate-700">2,200 từ vựng, 110 điểm ngữ pháp</span>
                        </div>
                        <div className="roadmap-item-modern">
                          <span className="roadmap-icon-modern bg-blue-100 text-blue-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          </span>
                          <span className="text-slate-700">Giao tiếp linh hoạt trong công việc</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: TÍCH LUỸ */}
                <div className="roadmap-step-modern group">
                  <div className="roadmap-number-modern bg-gradient-to-br from-amber-500 to-amber-600 group-hover:scale-110 group-hover:rotate-12">
                    3
                  </div>
                  <div className="roadmap-card-modern border-amber-200 group-hover:border-amber-400 group-hover:shadow-amber-200/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <div className="relative">
                      <div className="roadmap-header">
                        <h3 className="roadmap-title-modern text-amber-700">TÍCH LUỸ</h3>
                        <p className="roadmap-level-modern bg-amber-100 text-amber-700">HSK 4</p>
                      </div>
                      <div className="roadmap-content space-y-3 mt-4">
                        <div className="roadmap-item-modern">
                          <span className="roadmap-icon-modern bg-amber-100 text-amber-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                          </span>
                          <span className="text-slate-700">3,200 từ vựng, 286 điểm ngữ pháp</span>
                        </div>
                        <div className="roadmap-item-modern">
                          <span className="roadmap-icon-modern bg-amber-100 text-amber-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                            </svg>
                          </span>
                          <span className="text-slate-700">Phát triển toàn diện 4 kỹ năng</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: BỨT PHÁ */}
                <div className="roadmap-step-modern group">
                  <div className="roadmap-number-modern bg-gradient-to-br from-emerald-600 to-teal-600 group-hover:scale-110 group-hover:rotate-12">
                    4
                  </div>
                  <div className="roadmap-card-modern border-teal-200 group-hover:border-teal-400 group-hover:shadow-teal-200/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <div className="relative">
                      <div className="roadmap-header">
                        <h3 className="roadmap-title-modern text-teal-700">BỨT PHÁ</h3>
                        <p className="roadmap-level-modern bg-teal-100 text-teal-700">HSK 5</p>
                      </div>
                      <div className="roadmap-content space-y-3 mt-4">
                        <div className="roadmap-item-modern">
                          <span className="roadmap-icon-modern bg-teal-100 text-teal-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                          </span>
                          <span className="text-slate-700">4,300 từ vựng, 357 điểm ngữ pháp</span>
                        </div>
                        <div className="roadmap-item-modern">
                          <span className="roadmap-icon-modern bg-teal-100 text-teal-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                          </span>
                          <span className="text-slate-700">Biện luận & thuyết trình chuyên nghiệp</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 5: VƯỢT VŨ MÔN */}
                <div className="roadmap-step-modern group">
                  <div className="roadmap-number-modern bg-gradient-to-br from-purple-500 to-pink-600 group-hover:scale-110 group-hover:rotate-12">
                    5
                  </div>
                  <div className="roadmap-card-modern border-purple-200 group-hover:border-purple-400 group-hover:shadow-purple-200/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <div className="relative">
                      <div className="roadmap-header">
                        <h3 className="roadmap-title-modern text-purple-700">VƯỢT VŨ MÔN</h3>
                        <p className="roadmap-level-modern bg-purple-100 text-purple-700">HSK 6</p>
                      </div>
                      <div className="roadmap-content space-y-3 mt-4">
                        <div className="roadmap-item-modern">
                          <span className="roadmap-icon-modern bg-purple-100 text-purple-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                          </span>
                          <span className="text-slate-700">5,500 từ vựng, 424 điểm ngữ pháp</span>
                        </div>
                        <div className="roadmap-item-modern">
                          <span className="roadmap-icon-modern bg-purple-100 text-purple-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l-9-5v5.5A2.5 2.5 0 005.5 17h13a2.5 2.5 0 002.5-2.5V9l-9 5z"/>
                            </svg>
                          </span>
                          <span className="text-slate-700">Diễn đạt tự nhiên như người bản xứ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="relative py-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-6 bg-white">
            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </span>
        </div>
      </div>

      {/* CapyChina sẽ giúp bạn - Modern Grid */}
      <section className="section relative overflow-hidden pb-2 pt-2">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 font-semibold text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Lợi ích vượt trội
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900">
              CapyChina sẽ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">giúp bạn</span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
              Chinh phục tiếng Trung với phương pháp học hiện đại và hiệu quả
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12">
            <div className="help-card-modern group">
              <div className="help-icon-modern bg-gradient-to-br from-emerald-500 to-emerald-600">
                <svg className="icon text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800 group-hover:text-emerald-600 transition-colors">
                Đạt HSK mong muốn
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Đạt trình độ HSK mong muốn mà không cần đăng ký thêm bất kỳ lớp bổ trợ ngoài nào
              </p>
            </div>

            <div className="help-card-modern group">
              <div className="help-icon-modern bg-gradient-to-br from-blue-500 to-blue-600">
                <svg className="icon text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800 group-hover:text-blue-600 transition-colors">
                Thành thạo 4 kỹ năng
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Nghe - nói - đọc - viết được phát triển toàn diện với phương pháp học hiện đại
              </p>
            </div>

            <div className="help-card-modern group">
              <div className="help-icon-modern bg-gradient-to-br from-amber-500 to-amber-600">
                <svg className="icon text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800 group-hover:text-amber-600 transition-colors">
                Tư duy phản biện
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Giao tiếp lưu loát, làm chủ tiếng Trung trong mọi tình huống thực tế
              </p>
            </div>

            <div className="help-card-modern group">
              <div className="help-icon-modern bg-gradient-to-br from-teal-500 to-teal-600">
                <svg className="icon text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800 group-hover:text-teal-600 transition-colors">
                Luyện thi thực chiến
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Thi thử định kỳ bám sát đề thi thật theo đúng format HSK
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="relative py-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-6 bg-white">
            <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
          </span>
        </div>
      </div>

      {/* Tính năng cốt lõi - Enhanced grid with hover effects */}
      <section id="features" className="section bg-gradient-to-b from-slate-50 to-white pb-2 pt-2">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-amber-700 font-semibold text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
              Tính năng toàn diện
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-amber-600">
                Tất cả trong một
              </span>
              <br />cho việc học HSK
            </h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
              Thiết kế để bạn không lạc hướng và học hiệu quả mỗi ngày
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-12">
            {/* Modern Feature Cards */}
            {[
              {
                icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
                title: 'Khóa học theo cấp độ',
                desc: 'Lộ trình rõ ràng A1→C1, bài học mạch lạc',
                gradient: 'from-emerald-500 to-emerald-600',
                bg: 'bg-emerald-50',
                hover: 'hover:shadow-emerald-200/50'
              },
              {
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                title: 'SRS/Flashcards',
                desc: 'Ôn tập thông minh, ghi nhớ lâu dài',
                gradient: 'from-blue-500 to-blue-600',
                bg: 'bg-blue-50',
                hover: 'hover:shadow-blue-200/50'
              },
              {
                icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
                title: 'Nghe & Phát âm AI',
                desc: 'Luyện phát âm với công nghệ nhận diện giọng nói',
                gradient: 'from-amber-500 to-orange-600',
                bg: 'bg-amber-50',
                hover: 'hover:shadow-amber-200/50'
              },
              {
                icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
                title: 'Lớp học trực tuyến',
                desc: 'Tương tác với giáo viên và học viên',
                gradient: 'from-teal-500 to-cyan-600',
                bg: 'bg-teal-50',
                hover: 'hover:shadow-teal-200/50'
              },
              {
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                title: 'Đọc & Viết chữ Hán',
                desc: 'Luyện bút thuận, nhận diện bộ thủ',
                gradient: 'from-purple-500 to-pink-600',
                bg: 'bg-purple-50',
                hover: 'hover:shadow-purple-200/50'
              },
              {
                icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                title: 'Theo dõi tiến độ',
                desc: 'Dashboard, chuỗi ngày học, huy hiệu',
                gradient: 'from-emerald-600 to-teal-600',
                bg: 'bg-emerald-50',
                hover: 'hover:shadow-emerald-200/50'
              },
              {
                icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
                title: 'Gamification',
                desc: 'Nhiệm vụ, cấp bậc, phần thưởng',
                gradient: 'from-amber-500 to-yellow-600',
                bg: 'bg-amber-50',
                hover: 'hover:shadow-amber-200/50'
              },
              {
                icon: 'M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z',
                title: 'Video & Audio',
                desc: 'Thư viện tài liệu đa dạng',
                gradient: 'from-blue-600 to-indigo-600',
                bg: 'bg-blue-50',
                hover: 'hover:shadow-blue-200/50'
              },
              {
                icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2',
                title: 'Hỗ trợ offline',
                desc: 'Tải tài liệu, học mọi lúc mọi nơi',
                gradient: 'from-slate-500 to-slate-600',
                bg: 'bg-slate-50',
                hover: 'hover:shadow-slate-200/50'
              },
              {
                icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                title: 'Bảo mật cao',
                desc: 'An toàn thông tin, quản lý quyền hạn',
                gradient: 'from-emerald-500 to-green-600',
                bg: 'bg-emerald-50',
                hover: 'hover:shadow-emerald-200/50'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group relative bg-white rounded-2xl p-6 border border-slate-200 ${feature.hover} hover:border-transparent transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-pointer shadow-md hover:shadow-xl`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                
                <div className="relative space-y-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                    </svg>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-900">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.desc}
                  </p>

                  {/* Hover indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Modern animated cards */}
      <section className="section-sm bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden pb-2 pt-2">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Stat 1 */}
              <div className="group relative bg-white rounded-3xl p-8 border-2 border-emerald-200 hover:border-emerald-400 shadow-lg hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                
                <div className="relative text-center space-y-4">
                  <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  </div>
                  
                  <div>
                    <div className="text-5xl font-bold text-emerald-600 mb-2">10,000+</div>
                    <div className="text-slate-600 font-medium">Người học đang hoạt động</div>
                  </div>

                  {/* Animated progress bar */}
                  <div className="h-1 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-progress"></div>
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="group relative bg-white rounded-3xl p-8 border-2 border-blue-200 hover:border-blue-400 shadow-lg hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                
                <div className="relative text-center space-y-4">
                  <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                  
                  <div>
                    <div className="text-5xl font-bold text-blue-600 mb-2">1,500+</div>
                    <div className="text-slate-600 font-medium">Bài học & bài tập</div>
                  </div>

                  {/* Animated progress bar */}
                  <div className="h-1 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-progress animation-delay-500"></div>
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="group relative bg-white rounded-3xl p-8 border-2 border-amber-200 hover:border-amber-400 shadow-lg hover:shadow-2xl hover:shadow-amber-200/50 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                
                <div className="relative text-center space-y-4">
                  <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l2.39 5.3L20 7.58l-4 3.89.95 5.66L12 14.77l-4.95 2.36L8 11.47 4 7.58l5.61-.28L12 2z"/>
                    </svg>
                  </div>
                  
                  <div>
                    <div className="text-5xl font-bold text-amber-600 mb-2 flex items-center justify-center gap-2">
                      4.9
                      <span className="text-2xl text-slate-400">/5</span>
                    </div>
                    <div className="text-slate-600 font-medium">Đánh giá trung bình</div>
                  </div>

                  {/* Star rating */}
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l2.39 5.3L20 7.58l-4 3.89.95 5.66L12 14.77l-4.95 2.36L8 11.47 4 7.58l5.61-.28L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Chỉ hiển thị khi chưa đăng nhập */}
      <FinalCTASection />
    </>
  );
}



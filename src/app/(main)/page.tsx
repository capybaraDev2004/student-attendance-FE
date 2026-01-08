export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <>
      {/* Hero Section: trình bày giá trị cốt lõi, CTA rõ ràng */}
      <section className="section">
        <div className="container grid-responsive-2 items-center">
          <div className="text-left animate-fade-in-up">
            <h1 className="hero-title">Học Tiếng Trung thông minh và bền vững</h1>
            <p className="mt-4 text-slate-600 text-lg">
              Khóa học theo cấp độ, từ vựng với SRS/flashcards, nghe & video, phát âm/nhận diện giọng nói, đọc viết chữ Hán, theo dõi tiến độ, gamification và hơn thế nữa.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/register" className="btn btn-primary btn-lg">Bắt đầu miễn phí</a>
              <a href="#features" className="btn btn-outline btn-lg">Khám phá tính năng</a>
            </div>
          </div>

          {/* Ảnh minh họa đơn giản bằng SVG */}
          <div className="animate-slide-in-right">
            <div className="card-elevated">
              <div className="card-body">
                <div className="grid grid-cols-3 gap-3">
                  <div className="feature-icon primary">
                    <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M6 4h9a3 3 0 0 1 3 3v13H9a3 3 0 0 1-3-3V4z"/>
                    </svg>
                  </div>
                  <div className="feature-icon secondary">
                    <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M13 2L3 14h7v8l11-14h-8z"/>
                    </svg>
                  </div>
                  <div className="feature-icon accent">
                    <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M6 4v16l12-8L6 4z"/>
                    </svg>
                  </div>
                  <div className="feature-icon primary">
                    <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 3a9 9 0 1 0 0 18 4 4 0 0 0 4-4v-3h-2v3a2 2 0 0 1-2 2 7 7 0 1 1 7-7h2a9 9 0 0 0-9-9z"/>
                    </svg>
                  </div>
                  <div className="feature-icon secondary">
                    <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 1a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4zm-6 9a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.938V22h-2v-4.062A8 8 0 0 1 4 10h2z"/>
                    </svg>
                  </div>
                  <div className="feature-icon accent">
                    <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20 4H4v12h4v4l6-4h6V4z"/>
                    </svg>
                  </div>
                  <div className="feature-icon primary">
                    <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h12v2H3v-2z"/>
                    </svg>
                  </div>
                  <div className="feature-icon secondary">
                    <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2l7 4v6c0 5-3.5 9.5-7 10-3.5-.5-7-5-7-10V6l7-4z"/>
                    </svg>
                  </div>
                  <div className="feature-icon accent">
                    <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 17l-5 3 2-5-4-4 6-.5L12 6l2 4.5 6 .5-4 4 2 5-5-3z"/>
                    </svg>
                  </div>
                </div>
                <p className="mt-4 text-slate-600 text-sm">
                  Minh họa UI: thẻ nội dung, màu gradient hiện đại.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider divider-tight" />

      {/* Lộ trình học HSK */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title heading-underline">Lộ trình học HSK</h2>
            <p className="section-subtitle">Chinh phục tiếng Trung từ cơ bản đến nâng cao với lộ trình rõ ràng</p>
          </div>

          <div className="mt-10">
            {/* Roadmap Container */}
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-200 via-blue-200 to-amber-200 transform -translate-y-1/2 hidden lg:block"></div>
              
              {/* Roadmap Steps */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4">
                {/* Step 1: XÂY NỀN */}
                <div className="roadmap-step">
                  <div className="roadmap-number">1</div>
                  <div className="roadmap-card">
                    <div className="roadmap-header">
                      <h3 className="roadmap-title">XÂY NỀN</h3>
                      <p className="roadmap-level">HSK 0 - 2</p>
                    </div>
                    <div className="roadmap-content">
                      <div className="roadmap-item">
                        <span className="roadmap-icon">📚</span>
                        <span>Tích lũy 600 từ vựng, 92 chủ điểm ngữ pháp</span>
                      </div>
                      <div className="roadmap-item">
                        <span className="roadmap-icon">💬</span>
                        <span>Có thể giao tiếp cơ bản trong đời sống, học tập, công việc, du lịch</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: KHỞI ĐỘNG */}
                <div className="roadmap-step">
                  <div className="roadmap-number">2</div>
                  <div className="roadmap-card">
                    <div className="roadmap-header">
                      <h3 className="roadmap-title">KHỞI ĐỘNG</h3>
                      <p className="roadmap-level">HSK 3</p>
                    </div>
                    <div className="roadmap-content">
                      <div className="roadmap-item">
                        <span className="roadmap-icon">📖</span>
                        <span>Tích lũy 2200 từ vựng, 110 chủ điểm ngữ pháp</span>
                      </div>
                      <div className="roadmap-item">
                        <span className="roadmap-icon">🎯</span>
                        <span>Có thể giao tiếp linh hoạt trong sinh hoạt, học tập, công việc</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: TÍCH LUỸ */}
                <div className="roadmap-step">
                  <div className="roadmap-number">3</div>
                  <div className="roadmap-card">
                    <div className="roadmap-header">
                      <h3 className="roadmap-title">TÍCH LUỸ</h3>
                      <p className="roadmap-level">HSK 4</p>
                    </div>
                    <div className="roadmap-content">
                      <div className="roadmap-item">
                        <span className="roadmap-icon">📝</span>
                        <span>Tích lũy 3200 từ vựng, 286 chủ điểm ngữ pháp</span>
                      </div>
                      <div className="roadmap-item">
                        <span className="roadmap-icon">🌟</span>
                        <span>Phát triển toàn diện kỹ năng nghe, nói, đọc, viết</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: BỨT PHÁ */}
                <div className="roadmap-step">
                  <div className="roadmap-number">4</div>
                  <div className="roadmap-card">
                    <div className="roadmap-header">
                      <h3 className="roadmap-title">BỨT PHÁ</h3>
                      <p className="roadmap-level">HSK 5</p>
                    </div>
                    <div className="roadmap-content">
                      <div className="roadmap-item">
                        <span className="roadmap-icon">🚀</span>
                        <span>Tích lũy 4300 từ vựng, 357 chủ điểm ngữ pháp</span>
                      </div>
                      <div className="roadmap-item">
                        <span className="roadmap-icon">💡</span>
                        <span>Nâng cao khả năng giao tiếp, biện luận, thuyết trình</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 5: VƯỢT VŨ MÔN */}
                <div className="roadmap-step">
                  <div className="roadmap-number">5</div>
                  <div className="roadmap-card">
                    <div className="roadmap-header">
                      <h3 className="roadmap-title">VƯỢT VŨ MÔN</h3>
                      <p className="roadmap-level">HSK 6</p>
                    </div>
                    <div className="roadmap-content">
                      <div className="roadmap-item">
                        <span className="roadmap-icon">🏆</span>
                        <span>Tích lũy 5500 từ vựng, 424 chủ điểm ngữ pháp</span>
                      </div>
                      <div className="roadmap-item">
                        <span className="roadmap-icon">🎓</span>
                        <span>Diễn đạt ý tưởng tự nhiên, thuyết trình và tranh luận ở mức độ học thuật</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider divider-tight" />

      {/* CapyChina sẽ giúp bạn */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title heading-underline">CapyChina sẽ giúp bạn</h2>
            <p className="section-subtitle">Chinh phục tiếng Trung với phương pháp học hiện đại và hiệu quả</p>
          </div>

          <div className="grid-responsive mt-10">
            <div className="help-card">
              <div className="help-icon">
                <svg className="icon text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l7 4v6c0 5-3.5 9.5-7 10-3.5-.5-7-5-7-10V6l7-4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Đạt HSK mong muốn</h3>
              <p className="text-slate-600">
                Đạt trình độ HSK mong muốn mà không cần đăng ký thêm bất kỳ lớp bổ trợ ngoài nào
              </p>
            </div>

            <div className="help-card">
              <div className="help-icon">
                <svg className="icon text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 1a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4zm-6 9a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.938V22h-2v-4.062A8 8 0 0 1 4 10h2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Thành thạo 4 kỹ năng</h3>
              <p className="text-slate-600">
                Nghe - nói - đọc - viết được phát triển toàn diện với phương pháp học hiện đại
              </p>
            </div>

            <div className="help-card">
              <div className="help-icon">
                <svg className="icon text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 17l-5 3 2-5-4-4 6-.5L12 6l2 4.5 6 .5-4 4 2 5-5-3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Phát triển tư duy phản biện</h3>
              <p className="text-slate-600">
                Giao tiếp lưu loát, làm chủ tiếng Trung trong mọi tình huống thực tế
              </p>
            </div>

            <div className="help-card">
              <div className="help-icon">
                <svg className="icon text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4 6a2 2 0 0 1 2-2h9a3 3 0 0 1 3 3v13H9a3 3 0 0 1-3-3V6H4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Luyện thi thực chiến</h3>
              <p className="text-slate-600">
                Thi thử định kỳ bám sát đề thi thật theo đúng format HSK
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider divider-tight" />

      {/* Tính năng cốt lõi theo yêu cầu người dùng */}
      <section id="features" className="section">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title heading-underline">Tất cả trong một cho việc học HSK</h2>
            <p className="section-subtitle">Thiết kế để bạn không lạc hướng và học hiệu quả mỗi ngày</p>
          </div>

          <div className="grid-responsive mt-10">
            {/* 1. Khóa học theo cấp độ */}
            <div className="feature-card">
              <div className="feature-icon primary">
                <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4 6a2 2 0 0 1 2-2h9a3 3 0 0 1 3 3v13H9a3 3 0 0 1-3-3V6H4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Khóa học theo cấp độ</h3>
              <p className="mt-2 text-slate-600">
                Lộ trình rõ ràng A1→C1, bài học mạch lạc để bạn luôn biết học gì tiếp theo.
              </p>
            </div>

            {/* 2. SRS/Flashcards */}
            <div className="feature-card">
              <div className="feature-icon secondary">
                <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13 2L3 14h7v8l11-14h-8z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Từ vựng & SRS/Flashcards</h3>
              <p className="mt-2 text-slate-600">
                Ôn tập theo khoảng cách lặp lại thông minh để ghi nhớ lâu và đúng trọng tâm.
              </p>
            </div>

            {/* 3. Nghe & phát âm/nhận diện giọng nói */}
            <div className="feature-card">
              <div className="feature-icon accent">
                <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 1a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4zm-6 9a6 6 0 0 0 12 0h2a8 8 0 0 1-7 7.938V22h-2v-4.062A8 8 0 0 1 4 10h2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Nghe & Phát âm</h3>
              <p className="mt-2 text-slate-600">
                Nội dung audio/video và bài tập nhận diện giọng nói để luyện nghe nói tự nhiên.
              </p>
            </div>

            {/* 4. Lớp học trực tuyến */}
            <div className="feature-card">
              <div className="feature-icon primary">
                <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20 4H4v12h4v4l6-4h6V4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Lớp học trực tuyến</h3>
              <p className="mt-2 text-slate-600">
                Kết nối giáo viên và học viên, tương tác người thật để sửa lỗi và luyện giao tiếp.
              </p>
            </div>

            {/* 5. Đọc & viết chữ Hán */}
            <div className="feature-card">
              <div className="feature-icon secondary">
                <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h12v2H3v-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Đọc & Viết chữ Hán</h3>
              <p className="mt-2 text-slate-600">
                Luyện bút thuận, nhận diện bộ thủ, bài đọc hiểu tăng dần độ khó.
              </p>
            </div>

            {/* 6. Theo dõi tiến độ */}
            <div className="feature-card">
              <div className="feature-icon accent">
                <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l7 4v6c0 5-3.5 9.5-7 10-3.5-.5-7-5-7-10V6l7-4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Theo dõi tiến độ</h3>
              <p className="mt-2 text-slate-600">
                Dashboard điểm, chuỗi ngày học, huy hiệu để đo lường và duy trì động lực.
              </p>
            </div>

            {/* 7. Gamification */}
            <div className="feature-card">
              <div className="feature-icon primary">
                <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 17l-5 3 2-5-4-4 6-.5L12 6l2 4.5 6 .5-4 4 2 5-5-3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Gamification & Phần thưởng</h3>
              <p className="mt-2 text-slate-600">
                Nhiệm vụ, cấp bậc, phần thưởng mở khóa để bạn gắn bó dài lâu.
              </p>
            </div>

            {/* 8. Tài liệu bổ trợ */}
            <div className="feature-card">
              <div className="feature-icon secondary">
                <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6 4v16l12-8L6 4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Tài liệu bổ trợ / Thư viện</h3>
              <p className="mt-2 text-slate-600">
                Giáo trình, bài đọc, audio, video đa dạng để học theo sở thích.
              </p>
            </div>

            {/* 9. Hỗ trợ offline */}
            <div className="feature-card">
              <div className="feature-icon accent">
                <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4 4h16v10H9l-5 4V4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Hỗ trợ offline</h3>
              <p className="mt-2 text-slate-600">
                Tải tài liệu, học không cần mạng cho các buổi di chuyển.
              </p>
            </div>

            {/* 10. Bảo mật & quản lý người dùng */}
            <div className="feature-card">
              <div className="feature-icon primary">
                <svg className="icon-lg text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l7 4v6a10 10 0 0 1-14 9.165A10 10 0 0 1 5 12V6l7-4zm0 5l-5 3v2a7 7 0 0 0 10 6.326A7 7 0 0 0 17 12V10l-5-3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Bảo mật & Quyền truy cập</h3>
              <p className="mt-2 text-slate-600">
                Hỗ trợ đăng nhập, vai trò quản trị, phân quyền tài nguyên đúng chuẩn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nhóm số liệu nhanh tạo niềm tin */}
      <section className="section-xs">
        <div className="container">
          <div className="stats-surface">
            <div className="stats-grid">
              <div className="stats-card stats-emerald">
                <div className="stats-icon emerald">
                  <svg className="icon text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2z"/></svg>
                </div>
                <div className="stats-value">10k+</div>
                <div className="stats-label">Người học đang hoạt động</div>
              </div>
              <div className="stats-card stats-blue">
                <div className="stats-icon blue">
                  <svg className="icon text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h12v2H3v-2z"/></svg>
                </div>
                <div className="stats-value">1,500+</div>
                <div className="stats-label">Bài học & bài tập</div>
              </div>
              <div className="stats-card stats-amber">
                <div className="stats-icon amber">
                  <svg className="icon text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17l-5 3 2-5-4-4 6-.5L12 6l2 4.5 6 .5-4 4 2 5-5-3z"/></svg>
                </div>
                <div className="stats-value">4.9/5</div>
                <div className="stats-label">Đánh giá trung bình</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}



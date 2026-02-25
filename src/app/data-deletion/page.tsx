export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">
          Xóa dữ liệu người dùng
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Hướng dẫn yêu cầu xóa tài khoản và dữ liệu cá nhân.
        </p>

        <section className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            Theo yêu cầu của các nền tảng như Facebook, chúng tôi cung cấp trang này để mô
            tả rõ cách người dùng có thể yêu cầu xóa dữ liệu của mình khỏi hệ thống ứng
            dụng học tiếng Trung.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            1. Xóa dữ liệu trực tiếp trong ứng dụng
          </h2>
          <p>
            Nếu trong ứng dụng có mục quản lý tài khoản / hồ sơ, bạn có thể tìm nút{" "}
            <span className="font-semibold">“Xóa tài khoản”</span> (nếu được cung cấp). Khi
            xác nhận, tài khoản và dữ liệu liên quan sẽ được xóa hoặc ẩn danh khỏi hệ
            thống trong một khoảng thời gian hợp lý.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            2. Yêu cầu xóa dữ liệu qua email
          </h2>
          <p>Trong trường hợp bạn không thể xóa trực tiếp trong ứng dụng, vui lòng:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              Gửi email tới&nbsp;
              <a
                href="mailto:support@example.com"
                className="font-medium text-emerald-700 hover:underline"
              >
                support@example.com
              </a>
              .
            </li>
            <li>Tiêu đề email: “Yêu cầu xóa tài khoản &amp; dữ liệu”.</li>
            <li>
              Nội dung bao gồm: email dùng để đăng ký tài khoản, và (nếu có) ID Facebook /
              Google đã liên kết.
            </li>
          </ol>
          <p>
            Sau khi nhận được yêu cầu hợp lệ, chúng tôi sẽ xử lý và phản hồi trong vòng tối
            đa 30 ngày làm việc.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            3. Phạm vi dữ liệu được xóa
          </h2>
          <p>
            Khi yêu cầu được chấp nhận, chúng tôi sẽ xóa hoặc ẩn danh các dữ liệu sau (trong
            phạm vi pháp luật cho phép):
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Thông tin tài khoản (email, tên hiển thị, ảnh đại diện).</li>
            <li>Tiến trình học, lịch sử bài làm, cấu hình cá nhân.</li>
            <li>Các metadata liên quan đến hoạt động trong ứng dụng.</li>
          </ul>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            4. Liên hệ hỗ trợ
          </h2>
          <p>
            Nếu bạn gặp khó khăn khi yêu cầu xóa dữ liệu hoặc có câu hỏi thêm, hãy liên hệ
            với chúng tôi qua email:&nbsp;
            <a
              href="mailto:support@example.com"
              className="font-medium text-emerald-700 hover:underline"
            >
              support@example.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}


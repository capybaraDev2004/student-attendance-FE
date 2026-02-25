export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">
          Chính sách quyền riêng tư
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Phiên bản cập nhật gần nhất: 25/02/2026
        </p>

        <section className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            Chúng tôi tôn trọng và cam kết bảo vệ quyền riêng tư của người dùng khi sử dụng
            ứng dụng học tiếng Trung của chúng tôi. Chính sách này giải thích cách chúng tôi
            thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            1. Dữ liệu chúng tôi thu thập
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Thông tin tài khoản: email, tên hiển thị, ảnh đại diện (nếu có).</li>
            <li>
              Dữ liệu đăng nhập mạng xã hội (Google, Facebook): chúng tôi chỉ nhận thông
              tin cơ bản do bạn cho phép, chủ yếu là email và tên.
            </li>
            <li>
              Dữ liệu sử dụng dịch vụ: tiến trình học, bài luyện tập, lịch sử thanh toán VIP
              (nếu có).
            </li>
          </ul>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            2. Mục đích sử dụng dữ liệu
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Tạo và quản lý tài khoản học tập của bạn.</li>
            <li>Đồng bộ tiến trình học giữa các thiết bị.</li>
            <li>Cải thiện chất lượng nội dung và tính năng của ứng dụng.</li>
            <li>Hỗ trợ khách hàng và xử lý các yêu cầu từ bạn.</li>
          </ul>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            3. Chia sẻ dữ liệu với bên thứ ba
          </h2>
          <p>
            Chúng tôi KHÔNG bán dữ liệu cá nhân của bạn cho bên thứ ba. Dữ liệu chỉ được
            chia sẻ với các nhà cung cấp dịch vụ cần thiết cho việc vận hành hệ thống
            (ví dụ: nhà cung cấp hạ tầng máy chủ, dịch vụ thanh toán) và luôn tuân thủ các
            quy định bảo mật hiện hành.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            4. Thời gian lưu trữ dữ liệu
          </h2>
          <p>
            Dữ liệu của bạn được lưu trữ trong suốt thời gian tài khoản còn hoạt động. Khi
            bạn yêu cầu xóa tài khoản, chúng tôi sẽ xóa hoặc ẩn danh dữ liệu cá nhân trong
            một khoảng thời gian hợp lý theo quy định pháp luật.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            5. Quyền của người dùng
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Quyền truy cập và cập nhật thông tin cá nhân.</li>
            <li>Quyền yêu cầu xóa tài khoản và dữ liệu liên quan.</li>
            <li>Quyền khiếu nại khi cho rằng dữ liệu bị sử dụng sai mục đích.</li>
          </ul>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            6. Liên hệ
          </h2>
          <p>
            Nếu bạn có bất kỳ câu hỏi nào liên quan đến chính sách quyền riêng tư hoặc việc
            xử lý dữ liệu cá nhân, vui lòng liên hệ qua email:&nbsp;
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


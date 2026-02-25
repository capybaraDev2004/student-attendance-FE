export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">
          Điều khoản dịch vụ
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Vui lòng đọc kỹ trước khi sử dụng ứng dụng.
        </p>

        <section className="space-y-4 text-sm leading-relaxed text-slate-700">
          <h2 className="mt-2 text-base font-semibold text-slate-900">
            1. Chấp nhận điều khoản
          </h2>
          <p>
            Bằng việc tạo tài khoản hoặc sử dụng ứng dụng học tiếng Trung này, bạn xác nhận
            rằng đã đọc, hiểu và đồng ý tuân thủ các Điều khoản dịch vụ này cũng như các
            chính sách liên quan (bao gồm nhưng không giới hạn ở Chính sách quyền riêng tư).
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            2. Tài khoản và bảo mật
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Bạn chịu trách nhiệm giữ bí mật thông tin đăng nhập của mình.</li>
            <li>
              Bạn không được chia sẻ tài khoản cho người khác sử dụng chung, trừ khi có
              thỏa thuận bằng văn bản.
            </li>
            <li>
              Nếu phát hiện truy cập trái phép, bạn cần thông báo cho chúng tôi trong thời
              gian sớm nhất.
            </li>
          </ul>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            3. Quyền sử dụng dịch vụ
          </h2>
          <p>
            Bạn được cấp quyền sử dụng cá nhân, không độc quyền và không thể chuyển nhượng
            đối với ứng dụng và nội dung học tập. Bạn không được phép sao chép, phân phối
            lại, bán hoặc khai thác nội dung cho mục đích thương mại nếu không có sự đồng ý
            bằng văn bản của chúng tôi.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            4. Nội dung và hành vi bị cấm
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Đăng tải nội dung vi phạm pháp luật, phản cảm hoặc gây hại cho người khác.</li>
            <li>Thử can thiệp, phá hoại hoặc truy cập trái phép vào hệ thống.</li>
            <li>Sử dụng ứng dụng cho các mục đích gian lận, spam hoặc lừa đảo.</li>
          </ul>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            5. Thanh toán và gói VIP (nếu có)
          </h2>
          <p>
            Các khoản phí, gói học và chính sách hoàn tiền (nếu áp dụng) sẽ được mô tả rõ
            trên trang thanh toán. Việc bạn hoàn tất thanh toán đồng nghĩa với việc chấp
            nhận các điều khoản liên quan đến gói dịch vụ đó.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            6. Chấm dứt dịch vụ
          </h2>
          <p>
            Chúng tôi có quyền tạm ngưng hoặc chấm dứt quyền truy cập của bạn nếu phát hiện
            hành vi vi phạm Điều khoản dịch vụ hoặc sử dụng trái phép. Bạn cũng có thể chủ
            động yêu cầu xóa tài khoản theo hướng dẫn tại trang Xóa dữ liệu người dùng.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            7. Thay đổi điều khoản
          </h2>
          <p>
            Chúng tôi có thể cập nhật Điều khoản dịch vụ theo thời gian để phù hợp với quy
            định pháp luật và hoạt động của sản phẩm. Phiên bản cập nhật sẽ được công bố
            trên trang này, và việc bạn tiếp tục sử dụng dịch vụ sau khi điều khoản thay
            đổi đồng nghĩa với việc bạn chấp nhận phiên bản mới.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900">
            8. Liên hệ
          </h2>
          <p>
            Mọi thắc mắc liên quan đến Điều khoản dịch vụ, vui lòng liên hệ:&nbsp;
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


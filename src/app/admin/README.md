# Admin Dashboard - Hướng dẫn sử dụng

## Tổng quan
Admin Dashboard là hệ thống quản lý dành cho quản trị viên của ứng dụng học tiếng Trung CapyChina.

## Tính năng chính

### 1. Dashboard chính (`/admin`)
- Hiển thị thống kê tổng quan về hệ thống
- Số lượng người dùng, từ vựng, câu nói, bài học
- Các hành động nhanh để truy cập các chức năng quản lý

### 2. Quản lý người dùng (`/admin/users`)
- Xem danh sách tất cả người dùng trong hệ thống
- Thêm người dùng mới với đầy đủ thông tin
- Chỉnh sửa thông tin người dùng (username, email, role)
- Thay đổi vai trò người dùng (admin/customer)
- Xóa người dùng (không thể xóa chính mình)

### 3. Quản lý từ vựng (`/admin/vocabulary`)
- Xem danh sách tất cả từ vựng trong hệ thống
- Thêm từ vựng mới với đầy đủ thông tin:
  - Từ tiếng Trung (bắt buộc)
  - Chữ giản thể
  - Pinyin (bắt buộc)
  - Nghĩa tiếng Việt (bắt buộc)
  - Nghĩa tiếng Việt (phiên âm)
  - Từ loại
  - Câu ví dụ
  - Bài học liên quan (bắt buộc)
  - Danh mục từ vựng
- Chỉnh sửa thông tin từ vựng
- Xóa từ vựng

### 4. Quản lý câu nói (`/admin/sentences`)
- Xem danh sách tất cả câu nói trong hệ thống
- Thêm câu nói mới với đầy đủ thông tin:
  - Câu tiếng Trung
  - Pinyin
  - Nghĩa tiếng Việt
  - Bài học liên quan (bắt buộc)
  - Danh mục câu nói (bắt buộc)
- Chỉnh sửa thông tin câu nói
- Xóa câu nói

## Bảo mật

### Kiểm tra quyền truy cập
- Chỉ người dùng có role "admin" mới có thể truy cập Admin Dashboard
- Middleware tự động kiểm tra quyền và chuyển hướng người dùng không có quyền
- Tất cả API endpoints đều có kiểm tra quyền admin

### Bảo vệ dữ liệu
- Không thể xóa chính mình trong quản lý người dùng
- Validate dữ liệu đầu vào ở cả frontend và backend
- Kiểm tra tồn tại của các bản ghi liên quan trước khi thao tác

## Giao diện

### Thiết kế
- Giao diện tối giản, dễ sử dụng
- Sử dụng màu emerald làm màu chủ đạo (không sử dụng màu tím theo yêu cầu)
- Responsive design, hoạt động tốt trên mọi thiết bị
- Sidebar cố định với menu điều hướng rõ ràng

### Tính năng UI/UX
- Modal popup cho việc thêm/sửa dữ liệu
- Loading states khi thực hiện các thao tác
- Thông báo thành công/lỗi rõ ràng
- Bảng dữ liệu có thể cuộn ngang trên mobile
- Hover effects và transitions mượt mà

## Cách sử dụng

### Truy cập Admin Dashboard
1. Đăng nhập với tài khoản có role "admin"
2. Trong dropdown menu người dùng, chọn "Admin Dashboard"
3. Hoặc truy cập trực tiếp `/admin`

### Thêm dữ liệu mới
1. Nhấn nút "Thêm [loại dữ liệu]" ở góc trên bên phải
2. Điền đầy đủ thông tin trong form
3. Nhấn "Thêm" để lưu

### Chỉnh sửa dữ liệu
1. Nhấn icon chỉnh sửa (bút chì) trong bảng dữ liệu
2. Chỉnh sửa thông tin trong form
3. Nhấn "Cập nhật" để lưu

### Xóa dữ liệu
1. Nhấn icon xóa (thùng rác) trong bảng dữ liệu
2. Xác nhận việc xóa trong dialog
3. Dữ liệu sẽ được xóa vĩnh viễn

## Lưu ý quan trọng

1. **Backup dữ liệu**: Luôn backup dữ liệu trước khi thực hiện các thao tác xóa hàng loạt
2. **Kiểm tra liên kết**: Khi xóa từ vựng hoặc câu nói, kiểm tra xem có bài học nào đang sử dụng không
3. **Phân quyền**: Chỉ cấp quyền admin cho những người thực sự cần thiết
4. **Monitoring**: Theo dõi logs để phát hiện các hoạt động bất thường

## API Endpoints

### Admin Stats
- `GET /api/admin/stats` - Lấy thống kê tổng quan

### Quản lý người dùng
- `GET /api/admin/users` - Lấy danh sách người dùng
- `POST /api/admin/users` - Tạo người dùng mới
- `PATCH /api/admin/users/[id]` - Cập nhật người dùng
- `DELETE /api/admin/users/[id]` - Xóa người dùng

### Quản lý từ vựng
- `GET /api/admin/vocabulary` - Lấy danh sách từ vựng
- `POST /api/admin/vocabulary` - Tạo từ vựng mới
- `PATCH /api/admin/vocabulary/[id]` - Cập nhật từ vựng
- `DELETE /api/admin/vocabulary/[id]` - Xóa từ vựng
- `GET /api/admin/vocabulary-categories` - Lấy danh mục từ vựng

### Quản lý câu nói
- `GET /api/admin/sentences` - Lấy danh sách câu nói
- `POST /api/admin/sentences` - Tạo câu nói mới
- `PATCH /api/admin/sentences/[id]` - Cập nhật câu nói
- `DELETE /api/admin/sentences/[id]` - Xóa câu nói
- `GET /api/admin/sentence-categories` - Lấy danh mục câu nói

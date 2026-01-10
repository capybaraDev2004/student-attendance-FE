# 🚀 Hướng dẫn Deploy Frontend lên Vercel - Kết nối với Backend Render

## 📋 Yêu cầu
- Backend đã deploy thành công trên Render: `https://student-attendance-be.onrender.com`
- Tài khoản Vercel
- GitHub repository đã push code

## 🔗 Cấu hình Backend API URL

### Bước 1: Thêm Environment Variables trong Vercel

1. **Vào Vercel Dashboard:**
   - Đăng nhập [Vercel.com](https://vercel.com)
   - Chọn project của bạn

2. **Vào Settings → Environment Variables:**
   - Click vào project
   - Vào tab **Settings**
   - Click **Environment Variables**

3. **Thêm các biến sau cho Production:**

```bash
# Backend API URL - QUAN TRỌNG NHẤT
NEXT_PUBLIC_API_URL=https://student-attendance-be.onrender.com

# NEST_API_URL (một số file dùng biến này)
NEST_API_URL=https://student-attendance-be.onrender.com

# NextAuth Configuration
NEXTAUTH_URL=https://your-vercel-app.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth (nếu dùng)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Lưu ý quan trọng:**
- ✅ Chọn đúng environment: **Production** (hoặc tất cả environments)
- ✅ `NEXT_PUBLIC_API_URL` phải bắt đầu bằng `https://` (không có dấu `/` ở cuối)
- ✅ URL backend: `https://student-attendance-be.onrender.com` (không có trailing slash)

### Bước 2: Cấu hình CORS trong Backend (Render)

1. **Vào Render Dashboard → Web Service → Environment**
2. **Thêm/Sửa `FRONTEND_URL`:**
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app,https://your-vercel-app-git-main.vercel.app
   ```
3. **Save** - Render sẽ tự động restart

### Bước 3: Redeploy Frontend

1. **Vercel sẽ tự động redeploy** sau khi thêm environment variables
2. **Hoặc manual deploy:**
   - Vào Vercel Dashboard → Deployments
   - Click "Redeploy" trên deployment mới nhất

## 📝 Checklist

### Frontend (Vercel):
- [ ] Đã thêm `NEXT_PUBLIC_API_URL=https://student-attendance-be.onrender.com`
- [ ] Đã thêm `NEST_API_URL=https://student-attendance-be.onrender.com` (nếu code dùng)
- [ ] Đã thêm `NEXTAUTH_URL` = URL của Vercel app
- [ ] Đã thêm `NEXTAUTH_SECRET`
- [ ] Đã chọn đúng environment (Production)
- [ ] Đã redeploy sau khi thêm env variables

### Backend (Render):
- [ ] Đã thêm `FRONTEND_URL` với URL của Vercel app
- [ ] Backend đã start thành công
- [ ] Test API endpoint hoạt động: `https://student-attendance-be.onrender.com/`

## 🧪 Test kết nối

### Test từ Browser Console:
```javascript
// Mở browser console trên Vercel app
fetch('https://student-attendance-be.onrender.com/')
  .then(r => r.text())
  .then(console.log)
```

### Test từ Terminal:
```bash
# Test backend
curl https://student-attendance-be.onrender.com/

# Test với API endpoint
curl https://student-attendance-be.onrender.com/auth/health
```

## ⚠️ Lưu ý quan trọng

1. **NEXT_PUBLIC_API_URL phải có `NEXT_PUBLIC_` prefix:**
   - Đây là cách Next.js expose biến ra client-side
   - Không có prefix này, biến sẽ không available ở client

2. **URL không có trailing slash:**
   - ✅ Đúng: `https://student-attendance-be.onrender.com`
   - ❌ Sai: `https://student-attendance-be.onrender.com/`

3. **CORS phải được cấu hình đúng:**
   - Backend phải có `FRONTEND_URL` trong Render
   - Backend code phải cho phép origin từ Vercel

4. **Render free tier có thể spin down:**
   - Request đầu tiên sau khi spin down có thể mất ~50 giây
   - Có thể upgrade lên paid plan để tránh spin down

## 🔍 Debug nếu Frontend không kết nối được Backend

1. **Kiểm tra Environment Variables:**
   - Vào Vercel Dashboard → Settings → Environment Variables
   - Đảm bảo `NEXT_PUBLIC_API_URL` đã được set

2. **Kiểm tra trong Browser Console:**
   - Mở DevTools → Console
   - Kiểm tra có lỗi CORS không
   - Kiểm tra network requests có gửi đến đúng URL không

3. **Kiểm tra Backend CORS:**
   - Vào Render Dashboard → Environment
   - Đảm bảo `FRONTEND_URL` có URL của Vercel app

4. **Test API trực tiếp:**
   ```bash
   curl https://student-attendance-be.onrender.com/
   ```

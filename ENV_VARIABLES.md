# Environment Variables Reference

## 📝 Danh sách Environment Variables cần thiết

### Frontend (Next.js - Vercel)

#### Bắt buộc:
```bash
# NextAuth Configuration
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<generate-random-32-chars-secret>

# Backend API URL (BẮT BUỘC cho production)
NEXT_PUBLIC_API_URL=https://student-attendance-be.onrender.com
# Hoặc dùng alias này (một số file dùng NEST_API_URL)
NEST_API_URL=https://student-attendance-be.onrender.com

# Lưu ý: NEXT_PUBLIC_API_URL sẽ được expose ra client-side
# Đảm bảo backend có CORS được cấu hình đúng

# Database Connection
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
```

#### Tùy chọn (nếu dùng Google OAuth):
```bash
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Tạo NEXTAUTH_SECRET:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Hoặc online: https://generate-secret.vercel.app/32
```

---

### Backend (NestJS - Railway/Render)

#### Bắt buộc:
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database?schema=public

# JWT Secrets
JWT_ACCESS_SECRET=<generate-random-secret>
JWT_REFRESH_SECRET=<generate-random-secret>

# Frontend URL (cho CORS)
FRONTEND_URL=https://your-app.vercel.app,https://your-app-git-main.vercel.app

# Server Port (Railway tự động set PORT)
PORT=3001
HOST=0.0.0.0
```

#### Tùy chọn:
```bash
# Node Environment
NODE_ENV=production

# Azure Speech Services (nếu dùng tính năng speech)
AZURE_SPEECH_KEY=your-azure-speech-key
AZURE_SPEECH_REGION=your-azure-region

# Email Configuration (nếu dùng nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 🔐 Cách tạo Secrets

### 1. NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### 2. JWT Secrets
```bash
# Tạo 2 secrets khác nhau cho access và refresh token
openssl rand -base64 64
```

### 3. Database Password
- Tạo trong database provider dashboard
- Hoặc dùng password generator

---

## 📋 Checklist Environment Variables

### Vercel (Frontend):
- [ ] `NEXTAUTH_URL` - URL của Vercel app
- [ ] `NEXTAUTH_SECRET` - Secret key (32+ chars)
- [ ] `NEXT_PUBLIC_API_URL` - Backend API URL
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `GOOGLE_CLIENT_ID` - (Nếu dùng Google OAuth)
- [ ] `GOOGLE_CLIENT_SECRET` - (Nếu dùng Google OAuth)

### Railway/Render (Backend):
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_ACCESS_SECRET` - JWT access token secret
- [ ] `JWT_REFRESH_SECRET` - JWT refresh token secret
- [ ] `FRONTEND_URL` - Vercel app URL (cho CORS)
- [ ] `PORT` - Server port (thường tự động)
- [ ] `AZURE_SPEECH_KEY` - (Nếu dùng)
- [ ] `AZURE_SPEECH_REGION` - (Nếu dùng)

---

## ⚠️ Lưu ý

1. **Không commit secrets vào Git** - Luôn dùng environment variables
2. **Mỗi môi trường có secrets riêng** - Development, Staging, Production
3. **Rotate secrets định kỳ** - Đặc biệt nếu bị lộ
4. **Sử dụng Vercel Environment Variables** - Không hardcode trong code
5. **Backend và Frontend có thể dùng chung DATABASE_URL** - Nhưng tốt nhất là tách riêng

---

## 🔄 Cập nhật Environment Variables

### Trong Vercel (Frontend - Production):
1. Vào Vercel Dashboard → Project của bạn
2. Vào **Settings** → **Environment Variables**
3. Thêm/Sửa các biến sau cho **Production** environment:
   - `NEXT_PUBLIC_API_URL` = `https://student-attendance-be.onrender.com`
   - `NEST_API_URL` = `https://student-attendance-be.onrender.com` (nếu code dùng)
   - `NEXTAUTH_URL` = URL của Vercel app (ví dụ: `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET` = (tạo mới hoặc dùng secret từ .env local)
4. **Quan trọng:** Chọn đúng environment (Production, Preview, Development)
5. **Save** và **Redeploy** để áp dụng thay đổi

### Trong Render (Backend - Production):
1. Vào Render Dashboard → Web Service của bạn
2. Vào tab **Environment**
3. Thêm/Sửa `FRONTEND_URL` để cho phép CORS:
   - `FRONTEND_URL` = `https://your-vercel-app.vercel.app,https://your-vercel-app-git-main.vercel.app`
4. **Save** - Render sẽ tự động restart

### Trong Railway:
1. Vào Project → Variables
2. Thêm/Sửa variables
3. Service sẽ tự động restart

---

## 🧪 Test Environment Variables

### Frontend:
```bash
# Pull env từ Vercel
vercel env pull .env.local

# Test build
npm run build
```

### Backend:
```bash
# Test connection
npm run start:prod
```


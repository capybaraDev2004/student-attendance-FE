# Hướng dẫn Deploy lên Vercel

## 📋 Yêu cầu

1. Tài khoản Vercel
2. Database PostgreSQL (có thể dùng Vercel Postgres, Supabase, hoặc Railway)
3. Backend API (NestJS) đã được deploy (Railway, Render, hoặc Vercel Functions)

## 🔧 Các bước deploy

### 1. Chuẩn bị Environment Variables

Trong Vercel Dashboard, thêm các biến môi trường sau:

#### Bắt buộc:
```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<tạo secret ngẫu nhiên, ít nhất 32 ký tự>
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

#### Tùy chọn (nếu dùng Google OAuth):
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Tạo NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
# hoặc
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Deploy Backend API (NestJS Server)

**Lưu ý:** NestJS không thể deploy trực tiếp lên Vercel như Next.js. Bạn cần deploy server lên một trong các platform sau:

#### Option 1: Railway (Khuyến nghị)
1. Đăng ký tại [Railway.app](https://railway.app)
2. Tạo project mới từ GitHub repo
3. Chọn thư mục `server`
4. Thêm environment variables:
   - `DATABASE_URL`
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `AZURE_SPEECH_KEY` (nếu dùng)
   - `AZURE_SPEECH_REGION` (nếu dùng)
   - `FRONTEND_URL` (URL của Vercel app)
5. Railway sẽ tự động build và deploy

#### Option 2: Render
1. Đăng ký tại [Render.com](https://render.com)
2. Tạo Web Service mới
3. Connect GitHub repo, chọn thư mục `server`
4. Build command: `npm install && npm run build`
5. Start command: `npm run start:prod`
6. Thêm environment variables tương tự Railway

#### Option 3: Vercel Functions (Advanced)
Có thể convert NestJS thành serverless functions, nhưng phức tạp hơn.

### 3. Deploy Frontend (Next.js) lên Vercel

#### Cách 1: Deploy qua Vercel Dashboard
1. Đăng nhập [Vercel Dashboard](https://vercel.com)
2. Click "Add New Project"
3. Import GitHub repository
4. **Quan trọng:** Chọn **Root Directory** là `web` (không phải root của repo)
5. Framework Preset: Next.js (tự động detect)
6. Thêm tất cả environment variables đã chuẩn bị
7. Click "Deploy"

#### Cách 2: Deploy qua Vercel CLI
```bash
cd web
npm i -g vercel
vercel login
vercel
# Follow prompts, chọn production
```

### 4. Cấu hình Database

#### Nếu dùng Vercel Postgres:
1. Trong Vercel Dashboard, vào Storage tab
2. Tạo Postgres database mới
3. Copy connection string vào `DATABASE_URL`
4. Chạy migrations:
```bash
cd web
npx prisma migrate deploy
```

#### Nếu dùng Supabase/Railway/External DB:
1. Tạo database mới
2. Copy connection string vào `DATABASE_URL` trong Vercel
3. Chạy migrations:
```bash
cd web
DATABASE_URL="your-connection-string" npx prisma migrate deploy
```

### 5. Chạy Database Migrations

Sau khi deploy, cần chạy Prisma migrations:

```bash
# Trong Vercel Dashboard, vào project settings
# Thêm Build Command:
npm run build && npx prisma migrate deploy

# Hoặc chạy thủ công sau khi deploy:
vercel env pull .env.local
npx prisma migrate deploy
```

### 6. Cấu hình CORS và Environment

Đảm bảo backend API cho phép requests từ domain Vercel:

Trong `server/src/main.ts`, kiểm tra:
```typescript
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
  : ['http://localhost:3000'];
```

Set `FRONTEND_URL` trong backend environment:
```
FRONTEND_URL=https://your-app.vercel.app,https://your-app-git-main.vercel.app
```

## 📝 Checklist trước khi deploy

- [ ] Backend API đã được deploy và hoạt động
- [ ] Database đã được tạo và migrations đã chạy
- [ ] Tất cả environment variables đã được set trong Vercel
- [ ] `NEXTAUTH_URL` trỏ đúng domain Vercel
- [ ] `NEXT_PUBLIC_API_URL` trỏ đúng backend API URL
- [ ] CORS đã được cấu hình đúng trong backend
- [ ] Google OAuth credentials đã được cấu hình (nếu dùng)

## 🔍 Troubleshooting

### Lỗi: "Prisma Client not generated"
Thêm vào `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Lỗi: "Database connection failed"
- Kiểm tra `DATABASE_URL` format đúng
- Kiểm tra database có cho phép connections từ Vercel IPs
- Nếu dùng Supabase, cần whitelist Vercel IPs

### Lỗi: "API calls failed"
- Kiểm tra `NEXT_PUBLIC_API_URL` đúng
- Kiểm tra CORS settings trong backend
- Kiểm tra backend có đang chạy và accessible

### Lỗi: "NextAuth session error"
- Kiểm tra `NEXTAUTH_SECRET` đã được set
- Kiểm tra `NEXTAUTH_URL` đúng với domain Vercel
- Clear cookies và thử lại

## 🚀 Sau khi deploy

1. Test tất cả chức năng:
   - Đăng ký/Đăng nhập
   - API calls
   - Database operations
   - File uploads (nếu có)

2. Monitor logs trong Vercel Dashboard

3. Setup custom domain (nếu cần)

4. Enable Analytics và Speed Insights

## 📚 Tài liệu tham khảo

- [Vercel Deployment Guide](https://vercel.com/docs)
- [Next.js on Vercel](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/configuration/options)


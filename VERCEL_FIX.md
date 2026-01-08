# Fix lỗi "No Next.js version detected" trên Vercel

## 🔍 Nguyên nhân

Lỗi này xảy ra khi Vercel không tìm thấy Next.js trong `package.json` ở root của repository.

## ✅ Giải pháp

### Bước 1: Kiểm tra Root Directory trên Vercel

1. Vào Vercel Dashboard → Project Settings → General
2. Kiểm tra **Root Directory**:
   - Phải là `./` (root của repo)
   - KHÔNG phải `web/` hoặc bất kỳ thư mục con nào

### Bước 2: Kiểm tra package.json trên GitHub

Đảm bảo `package.json` ở **root của repository** trên GitHub có:

```json
{
  "dependencies": {
    "next": "15.5.4",
    ...
  }
}
```

**Kiểm tra:**
1. Vào GitHub repo: `https://github.com/capybaraDev2004/student-attendance-FE`
2. Xem file `package.json` ở root
3. Đảm bảo có `"next": "15.5.4"` trong `dependencies`

### Bước 3: Nếu package.json không có Next.js trên GitHub

**Option 1: Commit và push package.json mới**
```bash
cd web
git add package.json
git commit -m "Add Next.js to dependencies"
git push origin main
```

**Option 2: Sửa trực tiếp trên GitHub**
1. Vào GitHub repo
2. Edit file `package.json`
3. Thêm vào `dependencies`:
   ```json
   "next": "15.5.4"
   ```

### Bước 4: Cập nhật Framework Preset trên Vercel

1. Vào Vercel Dashboard → Project Settings → General
2. **Framework Preset** phải là: `Next.js`
3. Nếu đang là `Other` hoặc `Vite`, chọn lại `Next.js`

### Bước 5: Redeploy

1. Vào Vercel Dashboard
2. Click "Redeploy" hoặc push commit mới
3. Kiểm tra build logs

## 🔧 Cấu hình Vercel đúng

### Trên Vercel UI:
- **Root Directory:** `./` (root của repo)
- **Framework Preset:** `Next.js`
- **Build Command:** `npm run build` (tự động)
- **Output Directory:** `.next` (tự động)
- **Install Command:** `npm install` (tự động)

### File vercel.json (đã có):
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

## 📋 Checklist

- [ ] Root Directory trên Vercel = `./`
- [ ] Framework Preset = `Next.js`
- [ ] `package.json` trên GitHub có `"next": "15.5.4"` trong `dependencies`
- [ ] `package.json` ở root của repo (không phải trong thư mục con)
- [ ] Đã commit và push `package.json` mới (nếu cần)

## 🚨 Nếu vẫn lỗi

1. **Xóa project trên Vercel và tạo lại:**
   - Vào Settings → Delete Project
   - Tạo project mới
   - Import lại từ GitHub
   - Chọn Root Directory = `./`
   - Chọn Framework = `Next.js`

2. **Kiểm tra cấu trúc repo trên GitHub:**
   ```
   student-attendance-FE/
   ├── package.json  ← Phải có file này ở root
   ├── next.config.ts
   ├── src/
   ├── public/
   └── ...
   ```

3. **Kiểm tra build logs trên Vercel:**
   - Xem phần "Installing dependencies"
   - Kiểm tra xem có install Next.js không
   - Xem error message chi tiết


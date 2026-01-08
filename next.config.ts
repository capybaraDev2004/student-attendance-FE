import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bật strict để bắt lỗi sớm, và chuyển tiếp env cho client nếu cần
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Đảm bảo Prisma client được generate trong build
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;

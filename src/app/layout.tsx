import type { Metadata } from "next";
import "./globals.css";
import NextAuthSessionProvider from "@/components/providers/session-provider";
import type { Viewport } from "next";
import PasswordSetupWatcher from "@/components/auth/PasswordSetupWatcher";
import ChatbotWidget from "@/components/chat/ChatbotWidget";
import SessionSyncProvider from "@/components/providers/SessionSyncProvider";
import NotificationSystem from "@/components/notification/NotificationSystem";

export const metadata: Metadata = {
  title: {
    default: "Học Tiếng Trung | CapyChina",
    template: "%s | CapyChina",
  },
  description: "Nền tảng học tiếng Trung hiện đại: khóa học theo cấp độ, SRS, nghe nói, đọc viết, theo dõi tiến độ và hơn thế nữa.",
  metadataBase: new URL("https://capychina.example.com"),
  alternates: { canonical: "/" },
  keywords: [
    "học tiếng Trung",
    "HSK",
    "pinyin",
    "từ vựng tiếng Trung",
    "CapyChina",
  ],
  openGraph: {
    type: "website",
    siteName: "CapyChina",
    title: "Học Tiếng Trung | CapyChina",
    description: "Nền tảng học tiếng Trung hiện đại.",
    url: "https://capychina.example.com",
    images: [{ url: "/window.svg", width: 1200, height: 630, alt: "CapyChina" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Học Tiếng Trung | CapyChina",
    description: "Nền tảng học tiếng Trung hiện đại.",
    images: ["/window.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#10b981", // emerald-500
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextAuthSessionProvider>
          <SessionSyncProvider />
          <PasswordSetupWatcher />
          {children}
          <ChatbotWidget />
          <NotificationSystem />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
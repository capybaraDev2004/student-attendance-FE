"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  useEffect(() => setMounted(true), []);

  // Kiểm tra quyền admin
  useEffect(() => {
    if (mounted && status !== "loading") {
      if (!session?.user) {
        router.push("/login");
        return;
      }
      
      const userRole = session.user?.role;
      if (userRole !== "admin") {
        router.push("/dashboard");
        return;
      }
    }
  }, [session, status, mounted, router]);

  // Hiển thị loading khi đang kiểm tra quyền
  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" suppressHydrationWarning>
        <div className="flex flex-col items-center space-y-4" suppressHydrationWarning>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" suppressHydrationWarning></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Không hiển thị gì nếu không có quyền
  // Cho phép hiển thị layout để tránh hydration mismatch tạm thời; các trang vẫn sẽ gọi API và nhận 401/403 khi không có quyền

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <AdminHeader onToggleSidebar={() => setIsSidebarOpenMobile(prev => !prev)} />
      <div className="flex" suppressHydrationWarning>
        {/* Sidebar desktop luôn hiển thị; mobile có thể bật/tắt */}
        <AdminSidebar isOpen={isSidebarOpenMobile} onClose={() => setIsSidebarOpenMobile(false)} />
        <main className="flex-1 md:ml-64 p-6 pt-20" suppressHydrationWarning>
          {children}
        </main>
      </div>
      {/* Overlay mờ khi mở sidebar trên mobile để đóng nhanh */}
      {isSidebarOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setIsSidebarOpenMobile(false)}
          suppressHydrationWarning
        />
      )}
    </div>
  );
}

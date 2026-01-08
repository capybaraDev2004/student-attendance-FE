import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Bật ISR mặc định cho toàn bộ segment (main)
// Trang trong khu vực này sẽ được tái tạo mỗi 5 phút khi có request mới
export const revalidate = 300;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container !py-0 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Chặn truy cập đường dẫn yêu cầu đăng nhập; /dashboard là trang chung cho mọi role
export default withAuth(
	function middleware(req) {
		const pathname = req.nextUrl.pathname;
		const token = req.nextauth.token;

		// Nếu không có token => redirect đến trang đăng nhập
		if (!token) {
			return NextResponse.redirect(new URL("/login", req.url));
		}

		// Kiểm tra nếu token có lỗi (ví dụ: lỗi đăng nhập Google) => redirect về login
		if (token?.error) {
			return NextResponse.redirect(new URL("/login?error=auth_error", req.url));
		}

		// Kiểm tra quyền admin cho các route admin
		if (pathname.startsWith("/admin")) {
			const userRole = typeof token.role === "string" ? token.role : undefined;
			if (userRole !== "admin") {
				return NextResponse.redirect(new URL("/dashboard", req.url));
			}
		}

		// Cho phép truy cập các route khác nếu đã đăng nhập
		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: () => true,
		},
	}
);

export const config = {
	matcher: ["/dashboard/:path*", "/lesson/:path*", "/quiz/:path*", "/profile/:path*", "/admin/:path*"],
};

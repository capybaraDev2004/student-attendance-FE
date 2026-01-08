import NextAuth, { type NextAuthOptions, type User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";

const API_BASE_URL =
	process.env.NEST_API_URL ||
	process.env.NEXT_PUBLIC_API_URL ||
	"http://localhost:3001";

type NestLoginResponse = {
	user: {
		user_id: number;
		username: string;
		email: string;
		role: string;
		account_type: string;
		account_status: string;
		email_confirmed: boolean;
		must_set_password?: boolean;
    image_url?: string | null;
    address?: string | null;
    province?: string | null;
    region?: string | null;
	};
	tokens: {
		accessToken: string;
		refreshToken: string;
		expiresIn: number;
	};
};

async function loginWithNest(email: string, password: string): Promise<NestLoginResponse> {
	const response = await fetch(`${API_BASE_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(body || "LOGIN_FAILED");
	}

	return response.json() as Promise<NestLoginResponse>;
}

type GoogleProfile = {
	email?: string;
	name?: string | null;
	sub?: string;
};

async function loginWithGoogleProfile(profile: GoogleProfile): Promise<NestLoginResponse> {
	if (!profile.email || !profile.sub) {
		throw new Error("Thiếu thông tin Google");
	}

	const response = await fetch(`${API_BASE_URL}/auth/google`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email: profile.email,
			name: profile.name,
			providerId: profile.sub,
		}),
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(body || "GOOGLE_LOGIN_FAILED");
	}

	return response.json() as Promise<NestLoginResponse>;
}

type ExtendedToken = JWT & {
	refreshToken?: string;
	accessTokenExpires?: number;
	role?: string;
	userId?: string | number;
	error?: string;
	mustSetPassword?: boolean;
  imageUrl?: string | null;
  address?: string | null;
  province?: string | null;
  region?: string | null;
  accountStatus?: string;
};

async function refreshAccessToken(token: ExtendedToken): Promise<ExtendedToken> {
	try {
		const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refreshToken: token.refreshToken }),
		});

		if (!response.ok) {
			throw new Error("Failed to refresh access token");
		}

		const data = await response.json();
		return {
			...token,
			accessToken: data.tokens.accessToken,
			refreshToken: data.tokens.refreshToken ?? token.refreshToken,
			accessTokenExpires: Date.now() + data.tokens.expiresIn * 1000,
			role: data.user.role,
			userId: data.user.user_id,
			mustSetPassword: data.user.must_set_password,
			error: undefined,
		};
	} catch (error) {
		console.error("Refresh token error:", error);
		return { ...token, error: "RefreshAccessTokenError" };
	}
}

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	session: { strategy: "jwt" },
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Mật khẩu", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				try {
					const data = await loginWithNest(credentials.email, credentials.password);
					const { user, tokens } = data;

					return {
						id: String(user.user_id),
						name: user.username,
						email: user.email,
						role: user.role,
						accessToken: tokens.accessToken,
						refreshToken: tokens.refreshToken,
						accessTokenExpires: Date.now() + tokens.expiresIn * 1000,
						mustSetPassword: user.must_set_password,
            image_url: user.image_url,
            address: user.address,
            province: user.province,
            region: user.region,
            account_status: user.account_status,
					};
				} catch (error) {
					throw new Error(error instanceof Error ? error.message : "LOGIN_FAILED");
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		}),
	],
	callbacks: {
		async jwt({ token, user, account, profile, trigger, session }: { token: ExtendedToken; user?: NextAuthUser; account?: any; profile?: any; trigger?: "signIn" | "signUp" | "update"; session?: any }) {
			if (trigger === "update" && session) {
    if (typeof session.mustSetPassword !== "undefined") {
      token.mustSetPassword = session.mustSetPassword;
    }
    if (typeof (session as any).image_url !== "undefined") {
      token.imageUrl = (session as any).image_url ?? null;
    }
    if (typeof (session as any).address !== "undefined") {
      token.address = (session as any).address ?? null;
    }
    if (typeof (session as any).province !== "undefined") {
      token.province = (session as any).province ?? null;
    }
    if (typeof (session as any).region !== "undefined") {
      token.region = (session as any).region ?? null;
    }
    if (typeof (session as any).account_status !== "undefined") {
      token.accountStatus = (session as any).account_status;
    }
			}

		if (account?.provider === "google" && profile) {
			try {
				const data = await loginWithGoogleProfile(profile as GoogleProfile);
				const { user: nestUser, tokens } = data;

				token.accessToken = tokens.accessToken;
				token.refreshToken = tokens.refreshToken;
				token.accessTokenExpires = Date.now() + tokens.expiresIn * 1000;
				token.role = nestUser.role;
				token.userId = nestUser.user_id;
				token.mustSetPassword = nestUser.must_set_password;
        token.imageUrl = nestUser.image_url ?? null;
        token.address = nestUser.address ?? null;
        token.province = nestUser.province ?? null;
        token.region = nestUser.region ?? null;
        token.accountStatus = nestUser.account_status;
				token.error = undefined;
				return token;
			} catch (error) {
				console.error("Google login error:", error);
				// Throw error để NextAuth không tạo session khi không kết nối được backend
				// Điều này đảm bảo user không vào được dashboard nếu chưa tạo tài khoản
				throw new Error("Không thể kết nối đến server. Vui lòng thử lại sau.");
			}
		}

			if (user) {
				token.accessToken = (user as any).accessToken;
				token.refreshToken = (user as any).refreshToken;
				token.accessTokenExpires = (user as any).accessTokenExpires;
				token.role = (user as any).role;
				token.userId = user.id;
				token.mustSetPassword = (user as any).mustSetPassword;
        token.imageUrl = (user as any).image_url ?? null;
        token.address = (user as any).address ?? null;
        token.province = (user as any).province ?? null;
        token.region = (user as any).region ?? null;
        token.accountStatus = (user as any).account_status;
			}

			if (!token.accessTokenExpires || Date.now() < token.accessTokenExpires) {
				return token;
			}

			return refreshAccessToken(token);
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					id: token.userId,
					role: token.role,
					mustSetPassword: token.mustSetPassword,
          image_url: token.imageUrl ?? null,
          address: token.address ?? null,
          province: token.province ?? null,
          region: token.region ?? null,
          account_status: token.accountStatus,
				},
				accessToken: token.accessToken,
				error: token.error,
			};
		},
	},
	pages: {},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

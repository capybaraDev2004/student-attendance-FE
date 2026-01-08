import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    mustSetPassword?: boolean;
    image_url?: string | null;
    address?: string | null;
    province?: string | null;
    region?: string | null;
    account_status?: string;
  }

  interface Session {
    accessToken?: string;
    error?: string;
    user?: DefaultSession["user"] & {
      id?: string | number;
      role?: string;
      mustSetPassword?: boolean;
      image_url?: string | null;
      address?: string | null;
      province?: string | null;
      region?: string | null;
      account_status?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
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
  }
}
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      mustSetPassword?: boolean;
      image_url?: string | null;
      address?: string | null;
      province?: string | null;
      region?: string | null;
      account_status?: string;
    };
  }

  interface User {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    mustSetPassword?: boolean;
    image_url?: string | null;
    address?: string | null;
    province?: string | null;
    region?: string | null;
    account_status?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    role?: string;
    userId?: string;
    error?: string;
    mustSetPassword?: boolean;
    imageUrl?: string | null;
    address?: string | null;
    province?: string | null;
    region?: string | null;
    accountStatus?: string;
  }
}


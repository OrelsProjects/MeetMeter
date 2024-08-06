import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface SessionUser {
    userId: string;
    role?: string;
    meta: {
      referralCode?: string;
      pushToken?: string;
    };
    settings?: {
      showNotifications: boolean;
    };
    accessToken?: string;
  }

  interface Session {
    user: SessionUser &
      DefaultSession["user"] & { accessToken?: string | null };
  }
}

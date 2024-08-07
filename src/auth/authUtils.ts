import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import prisma from "../app/api/_db/db";
import { generateReferalCode } from "../app/api/_utils/referralCode";
import loggerServer from "../loggerServer";
import { UnknownUserError } from "../models/errors/UnknownUserError";

import { Account } from "@prisma/client";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
export async function refreshAccessToken(refreshToken: string) {
  const url =
    "https://oauth2.googleapis.com/token?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_AUTH_CLIENT_ID as string,
      client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET as string,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const refreshedTokens = await response.json();

  if (!response.ok) {
    throw refreshedTokens;
  }
  return {
    accessToken: refreshedTokens.access_token,
    accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
    refreshToken: refreshedTokens.refresh_token || refreshToken, // Fall back to old refresh token
  };
}

export async function verifyToken(account: Account, force?: boolean) {
  if (!account.expires_at || !account.refresh_token) {
    throw new Error("Login required");
  }
  await refreshAccessToken(account.refresh_token);
  const now = Date.now() / 1000;
  const expireAtMilliseconds = new Date(account.expires_at).getTime();

  if (now > expireAtMilliseconds || force) {
    const refreshToken = account.refresh_token;
    const newToken = await refreshAccessToken(refreshToken);
    const expiresAtString = (
      new Date(newToken.accessTokenExpires).getTime() / 1000
    ).toString();
    const expiresAt = parseInt(expiresAtString);

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token: newToken.accessToken,
        expires_at: expiresAt,
        refresh_token: newToken.refreshToken,
      },
    });
  }
}

export const getSession = async ({
  session,
  token,
  user,
}: {
  session: Session;
  token: JWT;
  user: AdapterUser;
}): Promise<Session> => {
  const newSession: Session = { ...session };
  const appUser = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
    include: {
      meta: true,
      settings: true,
      accounts: {
        orderBy: {
          expires_at: "desc",
        },
      },
    },
  });

  const latestAccount = appUser?.accounts?.[0];
  if (!latestAccount) {
    throw new Error("No account found"); // Login required
  }

  await verifyToken(latestAccount);

  const userId = appUser?.id;
  if (!userId) {
    throw new UnknownUserError();
  }

  if (!appUser?.meta) {
    await prisma.appUserMetadata.create({
      data: {
        userId,
        referralCode: generateReferalCode(userId),
      },
    });
  }

  if (!appUser?.settings) {
    await prisma.appUserSettings.create({
      data: {
        userId,
        showNotifications: true,
      },
    });
  }

  newSession.user = {
    ...newSession.user,
    role: appUser?.role || "",
    userId: appUser?.id || "",
    meta: {
      referralCode: appUser?.meta?.referralCode || "",
      pushToken: appUser?.meta?.pushToken || "",
    },
    settings: {
      showNotifications: appUser?.settings?.showNotifications || false,
    },
    accessToken: latestAccount.access_token || undefined,
  };

  return newSession;
};

export const signIn = async (session: any) => {
  try {
    let additionalUserData: any = {
      accessToken: session.account.access_token,
    };
    return {
      ...session,
      ...additionalUserData,
    };
  } catch (e: any) {
    loggerServer.error("Error signing in", session.user.id, { error: e });
  }
};

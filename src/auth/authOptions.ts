import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getSession, signIn, verifyToken } from "./authUtils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: process.env.GOOGLE_AUTH_SCOPES,
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // prompt: "consent", // this means that the user will always be asked to select an account
        },
      },
    }),
    // AppleProvider({
    //   clientId: process.env.APPLE_ID as string,
    //   clientSecret: process.env.APPLE_SECRET as string,
    // }),
  ],
  callbacks: {
    session: getSession,
    signIn,
    jwt: async ({ token, account }) => {
      if (account?.refresh_token) {
        const accountFromDb = await prisma.account.findFirst({
          where: {
            userId: token.sub,
          },
        });
        if (accountFromDb) {
          if (accountFromDb.refresh_token !== account.refresh_token) {
            await prisma.account.update({
              where: {
                id: accountFromDb.id,
              },
              data: {
                refresh_token: account.refresh_token,
              },
            });
          }
          await verifyToken(
            {
              ...accountFromDb,
              refresh_token: account.refresh_token,
            },
            true,
          );
        }
      }
      if (token) {
        const userId = token.sub;
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            role: true,
          },
        });
        return { ...token, role: user?.role };
      }
      return token;
    },
  },
  session: {
    strategy: "jwt", // This is the default value
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
};

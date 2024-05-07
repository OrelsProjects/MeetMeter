import { AuthOptions, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import prisma from "./app/api/_db/db";
import { hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { InvalidCredentialsError } from "./models/errors/InvalidCredentialsError";
import { UnknownUserError } from "./models/errors/UnknownUserError";
import UserAlreadyExistsError from "./models/errors/UserAlreadyExistsError";
import { generateReferalCode } from "@/app/api/_utils/referralCode";
import { cookies } from "next/headers";
import loggerServer from "./loggerServer";
import { ReferralOptions } from "global";
import { AppUser, AppUserMetadata } from "@prisma/client";

const getReferralOptions = (): ReferralOptions => {
  const referralCode = cookies().get("referralCode")?.value;
  return {
    referralCode,
  };
};

const clearReferralCode = () => {
  cookies().set("referralCode", "", {
    expires: new Date(0),
  });
};

const getUserFromDB = async (
  userId: string,
): Promise<(AppUser & { meta: AppUserMetadata | null }) | null> => {
  const user = await prisma.appUser.findFirst({
    where: {
      userId,
    },
    include: {
      meta: true,
    },
  });
  return user;
};

const setReferralCode = async (session: Session, userId: string) => {
  if (!session.user.meta.referralCode) {
    try {
      const referralCode = generateReferalCode(session.user.userId);
      await prisma.appUserMetadata.update({
        where: {
          userId,
        },
        data: {
          referralCode,
        },
      });
      session.user.meta.referralCode = referralCode;
    } catch (e: any) {
      loggerServer.error("Error updating referral code", session.user.userId, {
        error: e,
      });
    }
  }
};

const updateUserData = async (
  session: Session,
  user: (AppUser & { meta: AppUserMetadata | null }) | null,
) => {
  if (session?.user && user) {
    if (session?.user.image !== user?.photoURL) {
      await prisma.appUser.update({
        where: {
          userId: user.userId,
        },
        data: {
          photoURL: session.user.image,
        },
      });
    }

    if (!session.user.meta) {
      session.user.meta = {
        referralCode: "",
        pushToken: "",
      };
    }
    session.user.userId = user.userId;
    session.user.meta = {
      referralCode: user?.meta?.referralCode || "",
      pushToken: user?.meta?.pushToken || "",
    };
  }
};

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET as string,
      httpOptions: {
        timeout: 40000,
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID as string,
      clientSecret: process.env.APPLE_SECRET as string,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        displayName: { label: "Display Name", type: "text" },
        isSignIn: { label: "Sign In", type: "hidden", value: "true" },
        referralCode: { label: "Referred by", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("Unknown errror");
        }

        const hashedPassword = await hash(credentials.password, 10);

        const user = await prisma.appUser.findFirst({
          where: {
            email: credentials.email,
          },
        });
        if (credentials.isSignIn === "true") {
          if (user) {
            const isValid = hashedPassword === user.password;
            if (!isValid) {
              throw new InvalidCredentialsError();
            }
            return user;
          } else {
            throw new UnknownUserError();
          }
        } else {
          if (user) {
            throw new UserAlreadyExistsError();
          }
          try {
            const newUser = await prisma.appUser.create({
              data: {
                displayName: credentials.displayName,
                email: credentials.email,
                password: hashedPassword,
                userId: uuidv4(),
              },
            });
            // set userId to be newUser.userId
            await prisma.appUser.update({
              where: {
                email: credentials.email,
              },
              data: {
                userId: newUser.id,
              },
            });
            const data: {
              userId: string;
              referralCode: string;
              options?: ReferralOptions;
            } = {
              userId: newUser.id,
              referralCode: generateReferalCode(newUser.id),
            };

            const referralOptions: ReferralOptions = getReferralOptions();
            data.options = referralOptions;

            const appUserMetadata = await prisma.appUserMetadata.create({
              data,
            });
            clearReferralCode();
            return { ...newUser, meta: appUserMetadata };
          } catch (e: any) {
            loggerServer.error("Error creating user", "new_user", { error: e });
            throw e;
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // This is the default value
  },
  callbacks: {
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: AdapterUser;
    }) {
      let userInDB = await getUserFromDB(token.sub!);
      updateUserData(session, userInDB);
      setReferralCode(session, token.sub!);

      return session;
    },
    async signIn(session: any) {
      try {
        let additionalUserData = {};
        let userInDB = await prisma.appUser.findFirst({
          where: {
            userId: session.user.id,
          },
          include: {
            meta: true,
          },
        });
        if (!userInDB) {
          const newUser = await prisma.appUser.create({
            data: {
              userId: session.user.id,
              email: session.user.email || "",
              photoURL: session.user.image || "",
              displayName: session.user.name || "",
              meta: {
                create: {
                  referralCode: "",
                  pushToken: "",
                },
              },
            },
          });
          const referralOptions: ReferralOptions = getReferralOptions();
          const appUserMetadata = await prisma.appUserMetadata.create({
            data: {
              userId: newUser.id,
              referredBy: referralOptions.referralCode,
              referralCode: generateReferalCode(newUser.id),
            },
          });
          additionalUserData = {
            meta: appUserMetadata,
          };
        }

        return {
          ...session,
          ...additionalUserData,
        };
      } catch (e: any) {
        loggerServer.error("Error signing in", session.user.id, { error: e });
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

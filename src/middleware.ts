import { ReferralOptions } from "global";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const getReferralOptions = (req: NextRequest): ReferralOptions => {
  const { searchParams } = req.nextUrl;

  const referralCode = searchParams.get("referralCode");

  return {
    referralCode,
  };
};

export default withAuth(
  function middleware(req: NextRequest) {
    const { referralCode } = getReferralOptions(req);

    if (referralCode) {
      const response = NextResponse.next();

      // expire in 1 week
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      if (referralCode) {
        response.cookies.set("referralCode", referralCode, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          expires: nextWeek,
        });
      }

      return response;
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ token, req }) => {
        console.log("token", JSON.stringify(token));
        const url = req.nextUrl.pathname;
        if (url.includes("/events") || url.includes("/dashboard")) {
          return token?.role === "admin";
        }
        return true;
      },
    },
  },
);

// match /register path and if it has params, also match
export const config = {
  matcher: ["/register/:path*", "/events/:path*", "/dashboard/:path*"], // Matches /register and any subpaths, as well as /home /dashboard
};

// export { default } from "next-auth/middleware";

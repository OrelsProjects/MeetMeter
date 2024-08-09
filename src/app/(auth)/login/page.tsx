"use client";

import GoogleLogin from "../../../components/auth/googleLogin";
import AppleLogin from "../../../components/auth/appleLogin";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

const Auth = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center text-center overflow-hidden px-6 lg:px-0 ">
      <div className="w-full flex flex-col justify-between lg:max-w-[420px] rounded-xl px-8 pt-8 bg-card">
        <div className="w-full flex flex-col gap-3">
          <GoogleLogin signInTextPrefix="Sign in with" />
          <AppleLogin signInTextPrefix="Sign in with" />
        </div>
        <div className="flex flex-row gap-1 justify-center items-center font-extralight mt-8">
          <span className="text-muted-foreground">
            Don&apos;t have an account?
          </span>
          <Button
            variant="link"
            className="text-base underline text-muted-foreground !p-0"
            asChild
          >
            <Link href="/register" className="font-normal">
              Sign up
            </Link>
          </Button>
        </div>
      </div>
      <div className="w-full flex flex-row justify-end lg:max-w-[420px] mt-1 gap-1 text-xs text-foreground font-extralight">
        <Link
          href="/privacy"
          className="text-sky-600 underline dark:text-accent"
          target="_blank"
          about="Privacy"
        >
          Privacy
        </Link>
        •
        <Link
          href="/tos"
          className="text-sky-600 underline dark:text-accent"
          target="_blank"
          about="Terms of Service"
        >
          Terms of Service
        </Link>
      </div>
    </div>
  );
};

export default Auth;

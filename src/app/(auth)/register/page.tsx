"use client";

import GoogleLogin from "../../../components/auth/googleLogin";
import AppleLogin from "../../../components/auth/appleLogin";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

const Auth = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center text-center overflow-hidden px-6 lg:px-0 ">
      <div className="w-full flex flex-row justify-center items-center absolute top-20 md:top-40">
        <Image
          src="/favicon.png"
          alt="MeetMeter Logo"
          width={100}
          height={100}
          className="mb-8"
        />
        <h1 className="text-3xl font-bold text-foreground">MeetMeter</h1>
      </div>
      <div className="w-full flex flex-col justify-between lg:max-w-[420px] rounded-xl px-8 pt-8 bg-card">
        <div className="w-full flex flex-col gap-3">
          <GoogleLogin signInTextPrefix="Sign up with" />
          {/* <AppleLogin signInTextPrefix="Sign up with" /> */}
        </div>
        <div className="flex flex-row gap-1 justify-center items-center">
          <div className="flex flex-row gap-1 justify-center items-center font-extralight mt-8">
            <span className="text-muted-foreground">
              Already have an account?
            </span>
            <Button
              variant="link"
              className="text-base underline text-muted-foreground !p-0"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>
          </div>
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

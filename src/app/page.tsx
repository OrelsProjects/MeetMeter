"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../components/ui/button";
import Link from "next/link";
import Walkthrough from "../components/landingPage/walkthrough";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 px-72 md:p-24 md:px-[24rem] gap-10">
      <div className="w-full flex flex-row justify-center items-center">
        <Image
          src="/favicon.png"
          alt="MeetMeter Logo"
          fill
          className="!relative !w-fit !h-24"
        />
        <h1 className="text-3xl md:text-6xl font-bold text-foreground">
          MeetMeter
        </h1>
      </div>
      <h1 className="text-3xl tracking-wide">
        Choose the<strong> meetings </strong>you want to <strong>track</strong>
        <br /> and get<strong> feedback </strong>from your{" "}
        <strong>employees!</strong>
      </h1>
      <Button onClick={() => router.push("/login")} asChild>
        <Link href="/login" className="text-xl md:text-2xl py-6 px-8">
          Get Started!
        </Link>
      </Button>
      <Walkthrough />
      <div className="w-full h-fit bg-card rounded-lg p-4">
        <h1 className="text-3xl font-bold text-foreground">How does it works?</h1>
        <ul className="flex flex-col gap-2 mt-4">
          <li className="font-light text-lg tracking-wide">
          • MeetMeter will let you choose from your Google Calendar&apos;s the
            meetings you want to track.
          </li>
          <li className="font-light text-lg tracking-wide">
          • Send your employees a feedback request.
          </li>
          <li className="font-light text-lg tracking-wide">
          • Track your dashboard.
          </li>
        </ul>
      </div>
      <div className="w-full flex flex-row justify-center items-center gap-1 text-xs text-foreground font-light mt-10">
        <strong>By Orel</strong> •
        <Link
          href="/privacy"
          className="text-sky-600 underline dark:text-sky-400/70"
          target="_blank"
          about="Privacy"
        >
          Privacy
        </Link>
        •
        <Link
          href="/tos"
          className="text-sky-600 underline dark:text-sky-400/70"
          target="_blank"
          about="Terms of Service"
        >
          Terms of Service
        </Link>
      </div>
    </main>
  );
}

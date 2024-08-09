"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-10">
      <div className="w-full flex flex-row justify-center items-center">
        <Image
          src="/favicon.png"
          alt="MeetMeter Logo"
          width={100}
          height={100}
        />
        <h1 className="text-3xl font-bold text-foreground">MeetMeter</h1>
      </div>
      <h1>Track your meetings and get insights so you can improve!</h1>
      <Button onClick={() => router.push("/login")}>Get Started!</Button>
    </main>
  );
}

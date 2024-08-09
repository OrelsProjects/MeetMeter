"use client";

import Link from "next/link";
import React from "react";

function PrivacyPolicy() {
  return (
    <div className="container mx-auto pb-8 px-4 text-foreground rounded-lg overflow-auto">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2 text-foreground dark:text-foreground">
        Privacy Policy
      </h1>

      {/* Effective Date */}
      <p className="text-foreground font-light mb-8">
        Effective Date: 01.08.2024
      </p>

      {/* Intro section */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          Introduction
        </h2>
        <p className="text-foreground font-light">
          This Privacy Policy describes how MeetMeter (&quot;we&quot;,
          &quot;us&quot;, or &quot;our&quot;) collects, uses, and discloses your
          personal information when you use our website and services (the
          &quot;Services&quot;).
        </p>
      </section>

      {/* Data collection section */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          Information We Collect
        </h2>
        <ul className="list-disc text-foreground font-light pl-5">
          <li>Account Information: email, name, calendar details</li>
        </ul>
      </section>

      {/* Data usage section */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          How We Use Your Information
        </h2>
        <ul className="list-disc text-foreground font-light pl-5">
          <li>To provide and operate the Services.</li>
          <li>To personalize your experience.</li>
          <li>To communicate with you about the Services.</li>
          <li>To analyze and improve the Services.</li>
          <li>To comply with legal and regulatory requirements.</li>
        </ul>
      </section>

      {/* Data sharing section */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          Sharing Your Information
        </h2>
        <p className="text-foreground font-light">
          We do not share any of your information with anyone.
        </p>
      </section>

      {/* Contact section */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          Contact Us
        </h2>
        <p className="text-foreground font-light">
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <Link
          href="mailto:orelsmail@gmail.com"
          className="text-sky-600 underline dark:text-accent"
        >
          orelsmail@gmail.com
        </Link>
      </section>
    </div>
  );
}

export default PrivacyPolicy;

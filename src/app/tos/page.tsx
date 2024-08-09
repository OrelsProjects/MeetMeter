"use client";

import Link from "next/link";
import React from "react";

function TermsOfService() {
  return (
    <div className="container mx-auto pb-8 px-4 text-foreground rounded-lg overflow-auto">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-2 text-foreground dark:text-foreground">
        Terms of Service
      </h1>

      {/* Effective Date */}
      <p className="text-foreground font-light mb-8">
        Effective Date: 01.08.2024
      </p>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          Introduction
        </h2>
        <p className="text-foreground font-light">
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of our
          website and services (&quot;Services&quot;) provided by MeetMeter (&quot;we&quot;,
          &quot;us&quot;, or &quot;our&quot;). By accessing or using our Services, you agree to be
          bound by these Terms and our Privacy Policy.
        </p>
      </section>

      {/* Account Terms */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          Account Terms
        </h2>
        <ul className="list-disc text-foreground font-light pl-5">
          <li>You must provide your legal full name, a valid email address, and any other information requested in order to complete the signup process.</li>
          <li>You are responsible for maintaining the security of your account and password. We cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</li>
          <li>You are responsible for all content posted and activity that occurs under your account.</li>
        </ul>
      </section>

      {/* Usage Rights */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          Usage Rights
        </h2>
        <ul className="list-disc text-foreground font-light pl-5">
          <li>You are granted a limited, non-exclusive, non-transferable right to use the Services according to the terms of these Terms and our Privacy Policy.</li>
          <li>All rights not expressly granted to you are reserved by MeetMeter and its licensors.</li>
        </ul>
      </section>

      {/* Restrictions */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          Restrictions
        </h2>
        <ul className="list-disc text-foreground font-light pl-5">
          <li>You may not use the Services for any illegal or unauthorized purpose.</li>
          <li>You must not, in the use of the Services, violate any laws in your jurisdiction.</li>
        </ul>
      </section>

      {/* Termination */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          Termination
        </h2>
        <p className="text-foreground font-light">
          We may terminate or suspend your account and bar access to the Services
          immediately, without prior notice or liability, under our sole
          discretion, for any reason whatsoever and without limitation,
          including but not limited to a breach of the Terms.
        </p>
      </section>

      {/* Contact Us */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          Contact Us
        </h2>
        <p className="text-foreground font-light">
          If you have any questions about these Terms, please contact us at:
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

export default TermsOfService;

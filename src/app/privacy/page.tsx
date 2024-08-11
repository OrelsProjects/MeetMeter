import Link from "next/link";
import React from "react";

function PrivacyPolicy() {
  return (
    <div className="container mx-auto pb-8 px-4 text-foreground rounded-lg overflow-auto py-8">
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
          <li>Account Information: email, name, calendar details.</li>
          <li>Calendar Data: We collect details of your meetings, including the organizer, attendees, and timestamps, to provide personalized services and functionalities.</li>
        </ul>
      </section>

      {/* Google API and OAuth section */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          Google API and OAuth Consent
        </h2>
        <p className="text-foreground font-light">
          Our service integrates with Google APIs, and we use OAuth 2.0 to request access to your calendar data. We specifically request scopes that allow us to read calendar events to enhance service functionality. You can manage or revoke our access at any time through Google&apos;s security settings.
        </p>
      </section>

      {/* User Rights section */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          Your Rights
        </h2>
        <p className="text-foreground font-light">
          You have the right to access, correct, or delete your personal information. You can also revoke our access to your data at any time by deleting your account or through your Google account settings.
        </p>
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
          We do not share any of your information with anyone, except as necessary to provide the Services or as required by law.
        </p>
      </section>

      {/* Contact section */}
      <section className="mb-8">
        <h2 className="text-2xl font-medium mb-2 text-foreground dark:text-foreground">
          Contact Us
        </h2>
        <p className="text-foreground font-light">
          If you have any questions about this Privacy Policy, please contact us at:
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

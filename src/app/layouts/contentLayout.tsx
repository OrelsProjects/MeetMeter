"use client";

import React, { useEffect } from "react";
import "../../../firebase.config";
import type { Viewport } from "next";

import AuthProvider from "../providers/AuthProvider";
import NotificationsProvider from "../providers/NotificationsProvider";
import TopLoaderProvider from "../providers/TopLoaderProvider";
import AnimationProvider from "../providers/AnimationProvider";
import HeightProvider from "../providers/HeightProvider";
import ContentProvider from "../providers/ContentProvider";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import useNotification from "../../lib/hooks/useNotification";
import { Logger } from "../../logger";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function ContentLayout({ children }: RootLayoutProps) {
  const { requestNotificationsPermission } = useNotification();

  useEffect(() => {
    requestNotificationsPermission(true).catch(() =>
      Logger.error("Failed to request notifications permission"),
    );
  }, []);
  return (
    <main>
      <AuthProvider>
        <NotificationsProvider />
        <HeightProvider>
          <ContentProvider>
            <TopLoaderProvider />
            <PayPalScriptProvider
              options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
                currency: "USD",
                enableFunding: "card,ideal",
                components: "googlepay,buttons",
              }}
            >
              <AnimationProvider className="h-full overflow-auto pb-4">
                {children}
              </AnimationProvider>
            </PayPalScriptProvider>
          </ContentProvider>
        </HeightProvider>
      </AuthProvider>
    </main>
  );
}

export const viewport: Viewport = {
  themeColor: "#121212",
};

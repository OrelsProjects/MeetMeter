"use client";

import { initEventTracker } from "../../eventTracker";
import { initLogger } from "../../logger";

export default function ClientTrackersProvider() {
  initLogger();
  initEventTracker();
  return null;
}

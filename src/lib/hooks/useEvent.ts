"use client";
import { UserResponse } from "@prisma/client";
import axios from "axios";
import { useRef } from "react";
import LoadingError from "../../models/errors/LoadingError";
import { CalendarEvent } from "../../models/calendarEvents";
import { useAppDispatch } from "./redux";
import { setEventNotified } from "../features/events/eventsSlice";
import { Logger } from "../../logger";

export default function useEvent() {
  const dispatch = useAppDispatch();
  const loadingNotify = useRef(false);

  const notifyUsersForFeedback = async (
    event: CalendarEvent,
    calendarName: string,
  ) => {
    if (loadingNotify.current) {
      throw new LoadingError("Notifications are being sent");
    }
    loadingNotify.current = true;
    try {
      const { data } = await axios.post<{ nextNotificationAt: Date }>(
        `api/calendar/${calendarName}/event/${event.id}/create-responses`,
      );
      dispatch(
        setEventNotified({
          eventId: event.id,
          canNotifyAt: data.nextNotificationAt,
        }),
      );
    } catch (error: any) {
      Logger.error(error);
      throw error;
    } finally {
      loadingNotify.current = false;
    }
  };

  return {
    notifyUsersForFeedback,
    loadingNotify: loadingNotify.current,
  };
}

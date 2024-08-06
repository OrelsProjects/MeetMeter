"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { CalendarEvents } from "../../../models/calendarEvents";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks/redux";
import {
  selectEvents,
  setEvents,
} from "../../../lib/features/events/eventsSlice";
import EventComponent, { LoadingEventComponent } from "./eventComponent";
import useNotification from "../../../lib/hooks/useNotification";
import HintDownloadAppIOS from "./hintDownloadAppIOS";
//  FOR TOMORROW: CREATE A COMPONENT FOR EVENT AND ADD A SEND TO ALL NOTIFICATION BUTTON.

export default function Home() {
  const dispatch = useAppDispatch();
  const { requestNotificationsPermission } = useNotification();
  const { events } = useAppSelector(selectEvents);
  const [loading, setLoading] = useState(false);

  const getTodaysEvents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<CalendarEvents>("api/calendar/today");
      dispatch(setEvents(data));
      setEvents(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestNotificationsPermission(true)
      .catch(() => toast.error("Notifications not enabled"));

    getTodaysEvents();
  }, []);

  return (
    <div className="h-full overflow-clip flex flex-col gap-4 justify-between">
      <ul className="overflow-y-auto flex flex-col gap-2">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <LoadingEventComponent key={index} />
            ))
          : events?.items?.map(event => (
              <li key={event.id}>
                <EventComponent
                  defaultBackgroundColor={events.calendarBackgroundColor}
                  defaultForegroundColor={events.calendarForegroundColor}
                  event={event}
                  notify={{ calendarName: events.summary }}
                />
              </li>
            ))}
      </ul>
      <HintDownloadAppIOS className="self-center" />
    </div>
  );
}

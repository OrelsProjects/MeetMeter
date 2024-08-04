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
import EventComponent from "./eventComponent";
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
    // const toastId = toast.loading("Getting today's events...");
    try {
      const { data } = await axios.get<CalendarEvents>("api/calendar/today");
      dispatch(setEvents(data));
      // toast.update(toastId, {
      //   render: "Got today's events",
      //   type: "success",
      //   isLoading: false,
      //   autoClose: 2000,
      // });

      setEvents(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      // toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    requestNotificationsPermission(true)
      // .then(() => toast.success("Notifications enabled"))
      .catch(() => toast.error("Notifications not enabled"));

    getTodaysEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full overflow-clip flex flex-col gap-4 justify-between">
      <ul className="overflow-y-auto flex flex-col gap-2">
        {events?.items?.map(event => (
          <li key={event.id}>
            <EventComponent
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

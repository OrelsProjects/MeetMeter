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

export default function Home() {
  const dispatch = useAppDispatch();
  const { isAdmin } = useAppSelector(state => state.auth);
  const { events } = useAppSelector(selectEvents);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"day" | "week" | "month">("day");

  const getTodaysEvents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<CalendarEvents>(
        `api/calendar/events/${type}`,
      );
      dispatch(setEvents(data));
      setEvents(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodaysEvents();
  }, [type]);

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
                  notify={
                    isAdmin ? { calendarName: events.summary } : undefined
                  }
                />
              </li>
            ))}
      </ul>
    </div>
  );
}

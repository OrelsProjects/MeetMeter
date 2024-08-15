"use client";

import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarEvents,
  CalendarEventWithMeta,
} from "../../../models/calendarEvents";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks/redux";
import { Skeleton } from "@/components/ui/skeleton";
import {
  selectEvents,
  setEvents,
} from "../../../lib/features/events/eventsSlice";
import EventComponent, { LoadingEventComponent } from "../../../components/eventComponent";
import { Logger } from "../../../logger";
import moment from "moment";
import HintDownloadAppIOS from "./hintDownloadAppIOS";
import useResponse from "../../../lib/hooks/useResponse";
import useEvent from "../../../lib/hooks/useEvent";
import CustomTooltip from "../../../components/ui/customTooltip";

export default function Home() {
  const dispatch = useAppDispatch();
  const { isAdmin } = useAppSelector(state => state.auth);
  const { events } = useAppSelector(selectEvents);
  const { sendResponse, createResponseForUser } = useResponse();

  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const [type, setType] = useState<"day" | "week" | "month">("week");

  const getTodaysEvents = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const { data } = await axios.get<CalendarEvents>(
        `api/calendar/events/${type}`,
      );
      dispatch(setEvents(data));
      setEvents(data);
    } catch (error: any) {
      Logger.error(error);
      toast.error(
        () => (
          <div>
            <p>Did you give permission to access your calendar?</p>
            <p className="text-xs text-foreground/70">
              If not, relog and check the box.
            </p>
          </div>
        ),
        {
          autoClose: 5000,
        },
      );
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    getTodaysEvents();
  }, [type]);

  const calendarBackgroundColor = useMemo(
    () => events?.calendarBackgroundColor,
    [events],
  );

  const calendarForegroundColor = useMemo(
    () => events?.calendarForegroundColor,
    [events],
  );

  const calendarName = useMemo(() => events?.summary || "", [events]);

  // A map of day name to event, according to event start date
  const dayToEvent = useMemo(() => {
    if (!events) return {};
    const map = new Map<string, CalendarEvents["items"]>();
    events.items.forEach(event => {
      const start = new Date(
        event.start.date || event.start.dateTime || new Date(),
      );
      const day = start.toLocaleDateString("en-US", { weekday: "long" });
      if (!map.has(day)) {
        map.set(day, []);
      }
      map.get(day)?.push(event);
    });
    return Object.fromEntries(map);
  }, [events]);

  // Start of week (DD/MM) - End of week (DD/MM) using moment
  const weekDateRange = useMemo(() => {
    const now = moment();
    const startOfWeek = moment(now).startOf("week").format("DD/MM");
    const endOfWeek = moment(now).endOf("week").format("DD/MM");
    return `${startOfWeek} - ${endOfWeek}`;
  }, [events]);

  const handleRatingChange = async (
    value: number,
    event: CalendarEventWithMeta,
  ) => {
    const toastId = toast.loading("Sending response...");
    try {
      debugger;
      let responseEventId = event.response?.responseEventId;
      if (!responseEventId) {
        const userResponse = await createResponseForUser(
          event,
          events?.summary || "",
        );
        responseEventId = userResponse.responseEventId;
      }
      await sendResponse(event.id, responseEventId, {
        rating: value,
        response: null,
      });
    } catch (error: any) {
      Logger.error(error);
      toast.error(error.message, {
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const InfoText = () => (
    <span className="text-foreground/60">
      Shows only events that:
      <br />• have 2 or more attendees.
    </span>
  );

  return (
    <div className="w-full h-full overflow-clip flex flex-col gap-4 justify-between">
      <div className=" w-11/12 md:w-full overflow-y-auto overflow-x-clip flex flex-col gap-6">
        {loading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="w-1/2 h-7" />
            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <LoadingEventComponent key={index} />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4 relative">
            <div className="w-fit relative">
            <span className="w-fit text-2xl font-bold text-foreground/80">
              {type === "day"
                ? "Today"
                : type === "week"
                  ? `This week (${weekDateRange})`
                  : "This month"}
            </span>
            <CustomTooltip>
              <InfoText />
            </CustomTooltip>
            </div>
            {Object.entries(dayToEvent).map(([day, events]) => (
              <div className="flex flex-col gap-1" key={`events-${day}`}>
                <span className="text-lg font-bold">{day}</span>
                {events.map(event => (
                  <div key={event.id}>
                    <EventComponent
                      defaultBackgroundColor={calendarBackgroundColor}
                      defaultForegroundColor={calendarForegroundColor}
                      onRatingChange={value => {
                        handleRatingChange(value, event);
                      }}
                      event={event}
                      loading={loading}
                      notify={isAdmin ? { calendarName } : undefined}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <HintDownloadAppIOS className="self-center" />
    </div>
  );
}

import React, { useMemo } from "react";
import { CalendarEvent } from "../../../models/calendarEvents";
import { IoMdNotifications } from "react-icons/io";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { cn } from "../../../lib/utils";
import { Skeleton } from "../../../components/ui/skeleton";

const colorMapping: Record<string, string> = {
  1: "bg-indigo-600 text-white", // Lavender: #7986CB
  2: "bg-teal-600 text-white", // Sage: #338679
  3: "bg-purple-600 text-white", // Grape: #8E24AA
  4: "bg-pink-600 text-white", // Flamingo: #E67C73
  5: "bg-yellow-600 text-white", // Banana: #F6BF26
  6: "bg-red-600 text-white", // Tangerine: #F4511E
  7: "bg-cyan-600 text-white", // Peacock: #039BE5
  8: "bg-gray-700 text-white", // Graphite: #616161
  9: "bg-blue-600 text-white", // Blueberry: #3F51B5
  10: "bg-green-700 text-white", // Basil: #0B8043
  11: "bg-red-700 text-white", // Tomato: #D50000
};

export const LoadingEventComponent = () => (
  <div className="w-full h-fit flex flex-row items-center gap-4">
    <Skeleton
      className={cn(
        "w-80 h-28 flex flex-col gap-0.5 p-2 rounded-lg text-secondary-foreground",
      )}
    />
    <Skeleton className="w-8 h-8" />
  </div>
);

const EventComponent = ({
  event,
  notify,
  defaultBackgroundColor,
  defaultForegroundColor,
}: {
  event: CalendarEvent;
  notify?: {
    calendarName: string;
  };
  defaultBackgroundColor?: string;
  defaultForegroundColor?: string;
}) => {
  const notifyUsers = async () => {
    if (!notify) return;
    const toastId = toast.loading("Sending notifications...");
    try {
      const { data } = await axios.post(
        `api/calendar/${notify.calendarName}/event/${event.id}/notify`,
      );
      console.log(data);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      toast.update(toastId, {
        render: "Notifications sent",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const colorClassname = useMemo(() => {
    return colorMapping[event.colorId]
      ? colorMapping[event.colorId]
      : defaultBackgroundColor
        ? null
        : "bg-secondary";
  }, [event.colorId]);

  const colorStyle = useMemo(() => {
    return !colorClassname
      ? {
          backgroundColor: defaultBackgroundColor,
          color: defaultForegroundColor,
        }
      : {};
  }, [colorClassname, defaultBackgroundColor, defaultForegroundColor]);

  const TimeRange = useMemo(() => {
    const start = event.start.dateTime
      ? moment(event.start.dateTime).format("HH:mm")
      : null;
    const end = event.end.dateTime
      ? moment(event.end.dateTime).format("HH:mm")
      : null;

    if (start && end) return `${start} - ${end}`;
    if (start) return start;
    return "";
  }, [event.start.dateTime, event.end.dateTime]);

  return (
    <div className="w-full h-fit flex flex-row items-center gap-4">
      <div
        className={cn(
          "w-80 h-28 flex flex-col gap-0.5 p-2 rounded-lg text-secondary-foreground",
          colorClassname,
        )}
        style={colorStyle}
      >
        <h1 className="font-semibold line-clamp-2">{event.summary}</h1>
        <p className="font-light text-sm">{TimeRange}</p>
      </div>
      {notify && (
        <Button variant="ghost" onClick={notifyUsers}>
          <IoMdNotifications className="h-8 w-8 fill-primary" />
        </Button>
      )}
    </div>
  );
};

export default EventComponent;

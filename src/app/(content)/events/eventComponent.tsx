import React, { useMemo } from "react";
import {
  CalendarEvent,
  CalendarEventMeta,
} from "../../../models/calendarEvents";
import { IoMdNotifications } from "react-icons/io";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { cn } from "../../../lib/utils";
import { Skeleton } from "../../../components/ui/skeleton";
import { useAppDispatch } from "../../../lib/hooks/redux";
import { setEventNotified } from "../../../lib/features/events/eventsSlice";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const colorMapping: Record<string, string> = {
  1: "bg-indigo-400 text-white",
  2: "bg-teal-400 text-white",
  3: "bg-purple-400 text-white",
  4: "bg-pink-400 text-white",
  5: "bg-yellow-400 text-white",
  6: "bg-orange-400 text-white",
  7: "bg-cyan-400 text-white",
  8: "bg-gray-500 text-white",
  9: "bg-blue-400 text-white",
  10: "bg-green-600 text-white",
  11: "bg-red-600 text-white",
};

export const LoadingEventComponent = () => (
  <div className="w-full h-fit flex flex-row items-center gap-4">
    <Skeleton
      className={cn(
        "w-80 h-28 flex flex-col gap-0.5 p-2 rounded-lg text-secondary-foreground",
      )}
    />
    <Skeleton className="w-8 h-8 p-1" />
  </div>
);

const EventComponent = ({
  event,
  notify,
  defaultBackgroundColor,
  defaultForegroundColor,
}: {
  event: CalendarEvent & CalendarEventMeta;
  notify?: {
    calendarName: string;
  };
  defaultBackgroundColor?: string;
  defaultForegroundColor?: string;
}) => {
  const dispatch = useAppDispatch();

  const notifyUsers = async () => {
    if (!notify) return;
    const toastId = toast.loading("Sending notifications...");
    try {
      const { data } = await axios.post<{ nextNotificationAt: Date }>(
        `api/calendar/${notify.calendarName}/event/${event.id}/notify`,
      );
      toast.success("Notifications sent successfully");
      dispatch(
        setEventNotified({
          eventId: event.id,
          canNotifyAt: data.nextNotificationAt,
        }),
      );
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message, {
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      toast.dismiss(toastId);
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

  const disabled = useMemo(
    () => event.canNotifyAt !== "now",
    [event.canNotifyAt],
  );

  const Content = () => (
    <div className="w-full h-fit flex flex-row items-center gap-4">
      <div
        className={cn(
          "w-80 h-28 flex flex-col gap-0.5 p-2 rounded-lg text-secondary-foreground transition-all duration-500",
          colorClassname,
          { "grayscale opacity-70": disabled },
        )}
        style={colorStyle}
      >
        <h1 className="font-semibold line-clamp-2">{event.summary}</h1>
        <p className="font-light text-sm">{TimeRange}</p>
      </div>
      {notify && (
        <Button
          variant="ghost"
          className="px-1"
          onClick={notifyUsers}
          disabled={disabled}
        >
          <IoMdNotifications className="h-8 w-8 fill-primary" />
        </Button>
      )}
    </div>
  );

  const TooltipText = () => (
    <p>
      You can notify attendees again at:{" "}
      <span className="text-primary">
        {moment(event.canNotifyAt).format("HH:mm")}
      </span>
    </p>
  );

  return (
    <div className="w-full h-full">
      <Popover>
        <PopoverTrigger className="w-full flex md:hidden">
          <Content />
        </PopoverTrigger>

        {event.canNotifyAt !== "now" && (
          <PopoverContent 
          side="top"
          >
            <TooltipText /> 
          </PopoverContent>
        )}
      </Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="w-full cursor-default hidden md:flex">
            <Content />
          </TooltipTrigger>
          {event.canNotifyAt !== "now" && (
            <TooltipContent>
              <TooltipText />
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default EventComponent;

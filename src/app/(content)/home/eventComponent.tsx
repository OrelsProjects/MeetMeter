import React, { useMemo } from "react";
import { CalendarEventWithMeta } from "../../../models/calendarEvents";
import { IoMdNotifications } from "react-icons/io";
import { VscFeedback } from "react-icons/vsc";
import { Button } from "../../../components/ui/button";
import { toast } from "react-toastify";
import moment from "moment";
import { cn } from "../../../lib/utils";
import { Skeleton } from "../../../components/ui/skeleton";
import { useAppSelector } from "../../../lib/hooks/redux";
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
import useEvent from "../../../lib/hooks/useEvent";
import LoadingError from "../../../models/errors/LoadingError";
import { useRouter } from "next/navigation";
import Rating from "./rating";
import { UserResponse } from "@prisma/client";
import useResponse from "../../../lib/hooks/useResponse";

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
    <Skeleton className="w-8 h-8 p-1" />
  </div>
);

const EventComponent = ({
  event,
  notify,
  loading,
  onRatingChange,
  defaultBackgroundColor,
  defaultForegroundColor,
}: {
  event: CalendarEventWithMeta;
  notify?: {
    calendarName: string;
  };
  loading?: boolean;
  onRatingChange: (value: number) => any;
  defaultBackgroundColor?: string;
  defaultForegroundColor?: string;
}) => {
  const router = useRouter();
  const { user, isAdmin } = useAppSelector(state => state.auth);
  const { notifyUsersForFeedback } = useEvent();
  const { createResponseForUser } = useResponse();

  const handleCreateResponse = async () => {
    if (event.response?.responseEventId) {
      router.push(`/responses/${event.response.responseEventId}`);
      return;
    }
    if (!notify) return;
    const toastId = toast.loading("Creating a response...");
    try {
      const userResponse = await createResponseForUser(
        event,
        notify.calendarName,
      );
      router.push(`/responses/${userResponse.responseEventId}`);
    } catch (error: any) {
      if (error instanceof LoadingError) {
        return;
      }
      toast.error(error.message, {
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };
  const notifyUsers = async () => {
    if (!notify) return;
    const toastId = toast.loading("Sending notifications...");
    try {
      await notifyUsersForFeedback(event, notify.calendarName);
      toast.success("Notifications sent");
    } catch (error: any) {
      if (error instanceof LoadingError) {
        return;
      }
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

  const canNotify = useMemo(() => {
    if (isAdmin && event.organizer.email === user?.email) return !!notify;
    return false;
  }, [event.organizer.email, user?.email]);

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
    <div className="w-full h-40 flex flex-col items-start gap-1 rounded-lg p-2">
      <div className="w-full h-16 flex flex-row items-center gap-1 md:gap-4">
        <div
          className={cn(
            "w-60 md:w-[360px] h-full flex flex-col gap-0.5 p-2 rounded-lg text-secondary-foreground transition-all duration-500",
            colorClassname,
            { "grayscale opacity-70": disabled },
          )}
          style={colorStyle}
        >
          <h1 className="font-semibold line-clamp-1">{event.summary}</h1>
          <p className="font-light text-sm">{TimeRange}</p>
        </div>
        <div className={cn("flex flex-row gap-2 md:gap-4")}>
          <div className="w-7 h-7 md:w-10 md:h-10">
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => handleCreateResponse()}
            >
              <VscFeedback className="h-7 w-7 fill-foregroung" />
            </Button>
          </div>
          <div className="w-7 h-7 md:w-10 md:h-10">
            {canNotify && (
              <Button
                variant="ghost"
                className="px-1"
                onClick={notifyUsers}
                disabled={disabled}
              >
                <IoMdNotifications className="w-7 h-7 fill-primary" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="w-60 md:w-[360px] flex justify-start items-start">
        <Rating
          value={event.response?.rating || null}
          loading={loading}
          className="h-12 w-12"
          size="small"
          onChange={value => {
            onRatingChange(value);
          }}
        />
      </div>
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
          <PopoverContent side="top">
            <TooltipText />
          </PopoverContent>
        )}
      </Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="cursor-default hidden md:flex">
            <Content />
          </TooltipTrigger>
          {event.canNotifyAt !== "now" && (
            <TooltipContent className="bg-card text-card-foreground shadow dark:shadow-none">
              <TooltipText />
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default EventComponent;

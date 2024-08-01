import React, { useMemo } from "react";
import { CalendarEvent } from "../../../models/calendarEvents";
import { IoMdNotifications } from "react-icons/io";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

const EventComponent = ({
  event,
  notify,
}: {
  event: CalendarEvent;
  notify?: {
    calendarName: string;
  };
}) => {
  //api/calendar/[calendarName]/event/[eventId]/notify
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
  }, [event.start.date, event.end.date]);

  return (
    <div className="w-full h-fit flex flex-row items-center gap-4">
      <div className="w-80 h-28  flex flex-col gap-05. bg-secondary p-2 rounded-lg text-secondary-foreground">
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

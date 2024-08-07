"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useResponse from "@/lib/hooks/useResponse";
import { selectEvents } from "@/lib/features/events/eventsSlice";
import { useAppSelector } from "@/lib/hooks/redux";
import { Logger } from "@/logger";
import { Button } from "@/components/ui/button";
import { RatingComponent } from "./rating";
import LoadingError from "@/models/errors/LoadingError";
import { Skeleton } from "../../../components/ui/skeleton";
import HintDownloadAppIOS from "./hintDownloadAppIOS";
import { IoMdNotifications } from "react-icons/io";

const ResponsePage = () => {
  const router = useRouter();
  const { getUserEventResponses, loadingFetch } = useResponse();
  const { userEventResponses } = useAppSelector(selectEvents);

  useEffect(() => {
    getUserEventResponses().catch(error => {
      if (error instanceof LoadingError) {
        return;
      }
      Logger.error(error);
    });
  }, []);

  if (!loadingFetch && userEventResponses.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold text-center">
          You have not attended any events yet.
        </p>
        <div className="flex flex-row gap-0 justify-center items-center font-light">
          <p>Or ask your event organizer to ring the bell</p>
          <IoMdNotifications className="h-7 w-7 fill-primary" />
        </div>
      </div>
    );
  }

  return (
    userEventResponses && (
      <div className="h-fit w-full grid grid-cols-[repeat(var(--responses-in-row-mobile),minmax(0,1fr))] md:grid-cols-[repeat(var(--responses-in-row),minmax(0,1fr))] gap-8 auto-rows-auto overflow-y-auto overflow-x-clip pb-2">
        {loadingFetch
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton className="w-full md:w-[23.5rem] h-60" key={index} />
            ))
          : [...userEventResponses]
              // sort the ones without respondAt to the top
              .sort((a, b) => {
                if (!a.respondAt) {
                  return -1;
                }
                if (!b.respondAt) {
                  return 1;
                }
                return 0;
              })
              .map(response => (
                <div
                  key={response.id}
                  className="w-full md:w-[23.5rem] h-60 shadow-md bg-card/70 dark:bg-card rounded-md flex flex-col justify-between items-center gap-1 p-3 relative hover:cursor-pointer"
                  onClick={() => {
                    router.push(`/responses/${response.responseEventId}`);
                  }}
                >
                  <h1 className="font-semibold text-lg md:text-xl">
                    {response.responseEvent.summary}
                  </h1>
                  {response.respondAt ? (
                    response.rating && (
                      <>
                        <RatingComponent
                          value={response.rating - 1}
                          selected
                          className="shadow-none self-center border-none p-0 !h-fit"
                          showText={false}
                        />
                        <p>{response.comments}</p>
                      </>
                    )
                  ) : (
                    <Button>Rate event</Button>
                  )}
                </div>
              ))}
        <HintDownloadAppIOS className="self-center" />
      </div>
    )
  );
};

export default ResponsePage;

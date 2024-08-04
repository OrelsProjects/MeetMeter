"use client";

import { useRouter } from "next/navigation";
import useResponse from "@/lib/hooks/useResponse";
import { selectEvents } from "../../../lib/features/events/eventsSlice";
import { useAppSelector } from "../../../lib/hooks/redux";
import { useEffect } from "react";
import LoadingError from "../../../models/errors/LoadingError";
import { Logger } from "../../../logger";
import { RatingComponent } from "./rating";
import { Button } from "../../../components/ui/button";

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

  return (
    userEventResponses && (
      <div className="flex flex-col gap-4">
        {userEventResponses.map(response => (
          <div
            key={response.id}
            className="w-full md:max-w-72 h-fit md:h-fit flex flex-col justify-center items-center gap-3 bg-card rounded-md p-2 hover:cursor-pointer"
            onClick={() => {
              router.push(`/responses/${response.responseEventId}`);
            }}
          >
            <h1 className="font-semibold">{response.responseEvent.summary}</h1>
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
      </div>
    )
  );
};

export default ResponsePage;

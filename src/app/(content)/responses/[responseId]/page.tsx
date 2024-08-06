"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ResponseEvent, UserResponse } from "@prisma/client";
import useResponse from "@/lib/hooks/useResponse";
import LoadingError from "@/models/errors/LoadingError";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { FaArrowLeftLong } from "react-icons/fa6";
import { ratingMap } from "./consts";

const Comments = ({
  value,
  onChange,
  error,
  loading,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  loading?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-sm font-bold tracking-wide">
        {loading ? (
          <Skeleton className="w-[10rem] h-6" />
        ) : (
          "Anything else you'd like to add?"
        )}
      </h1>
      <Textarea
        loading={loading}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Enter your comments here..."
      />
      {error && <div className="text-destructive text-sm">{error}</div>}
    </div>
  );
};

const Rating = ({
  value,
  onChange,
  loading,
}: {
  value: number | null;
  onChange: (value: number) => void;
  loading?: boolean;
}) => {
  return (
    <div className="w-full flex flex-row justify-between gap-2">
      {Array.from({ length: ratingMap.length }).map((_, index) =>
        loading ? (
          <Skeleton
            key={`rating-${index}-loading`}
            className="h-20 w-[4.5rem] md:h-24 md:w-[5.5rem] rounded-[6px] flex flex-col items-center justify-center"
          />
        ) : (
          <div
            key={`rating-${index}`}
            className={cn(
              "h-20 w-[4.5rem] md:h-24 md:w-[5.5rem] border-[1px] bg-card border-gray-300 rounded-[6px] flex flex-col items-center justify-center hover:shadow-md hover:shadow-secondary transition-all duration-100 cursor-pointer",
              {
                "border-primary shadow-md shadow-secondary":
                  value === index + 1,
              },
            )}
            onClick={() => onChange(index)}
          >
            <div className="text-lg md:text-2xl">{ratingMap[index].emoji}</div>
            <div className="text-xs md:text-sm">{ratingMap[index].text}</div>
          </div>
        ),
      )}
    </div>
  );
};

const ResponsePage = ({ params }: { params: { responseId: string } }) => {
  const router = useRouter();
  const { getEventResponse, sendResponse, loadingSend, loadingFetch } =
    useResponse();

  const [event, setEvent] = useState<ResponseEvent | null>(null);
  const [userResponse, setUserResponse] = useState<UserResponse | null>(null);

  const formik = useFormik({
    initialValues: {
      comments: "",
      rating: null,
    },
    validationSchema: Yup.object({
      comments: Yup.string(),
      rating: Yup.number()
        .required("Rating is required")
        .min(1, "Rating is required"),
    }),
    onSubmit: async values => {
      await toast.promise(
        sendResponse(params.responseId, {
          rating: values.rating,
          comments: values.comments,
          response: "",
        }),
        {
          pending: "Sending response...",
          success: {
            render() {
              router.push("/home");
              return "Response sent!";
            },
          },
          error: "Failed to send response",
        },
      );
    },
  });

  const getEvent = async () => {
    try {
      const data = await getEventResponse(params.responseId);
      setEvent(data.responseEvent);
      setUserResponse(data.userResponse);

      if (!formik.values.comments) {
        formik.setFieldValue("comments", data.userResponse.comments || "");
      }
      if (!formik.values.rating) {
        formik.setFieldValue("rating", data.userResponse.rating);
      }
    } catch (error: any) {
      if (error instanceof LoadingError) return;

      const status = error.response.status;
      if (status === 403 || status === 404) {
        alert("You are not a part of this event");
        router.push(`/home`);
      }
    }
  };

  useEffect(() => {
    getEvent();
  }, []);

  const updateRating = (index: number) => {
    formik.setFieldValue("rating", index + 1);
  };

  const isResponseUpdated = useMemo(() => {
    return (
      (formik.values.comments &&
        formik.values.comments !== userResponse?.comments) ||
      (formik.values.rating && formik.values.rating !== userResponse?.rating)
    );
  }, [formik.values, userResponse]);

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-10">
      <div
        className="w-fit hover:bg-slate-400/40 hover:cursor-pointer rounded-xl p-2 flex flex-row gap-1 justify-center items-center"
        onClick={() => router.push("/home")}
      >
        <FaArrowLeftLong className="w-6 h-6" />
        <span className="text-lg">Back</span>
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-wide">
          <span>
            {loadingFetch ? (
              <Skeleton className="w-[6rem] h-6" />
            ) : (
              "Give feedback"
            )}
          </span>
        </h1>
        <h3 className="font-medium">
          {loadingFetch ? (
            <Skeleton className="w-[10rem] h-6" />
          ) : (
            event?.summary
          )}
        </h3>
      </div>
      {/* <div
        className="text-base"
        dangerouslySetInnerHTML={{ __html: event?.description || "" }}
      /> */}
      <Rating
        value={formik.values.rating}
        onChange={updateRating}
        loading={loadingFetch}
      />
      {formik.errors.rating && formik.touched.rating && (
        <div className="text-destructive text-sm">{formik.errors.rating}</div>
      )}
      <Comments
        loading={loadingFetch}
        value={formik.values.comments}
        onChange={value => formik.setFieldValue("comments", value)}
        error={
          formik.errors.comments && formik.touched.comments
            ? formik.errors.comments
            : undefined
        }
      />
      {loadingFetch ? (
        <Skeleton className="w-full h-6" />
      ) : (
        <Button type="submit" disabled={loadingSend || !isResponseUpdated}>
          Submit
        </Button>
      )}
    </form>
  );
};

export default ResponsePage;

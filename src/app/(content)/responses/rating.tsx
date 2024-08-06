"use client";
import React from "react";
import { Skeleton } from "../../../components/ui/skeleton";
import { cn } from "../../../lib/utils";
import { ratingMap } from "./[responseId]/page";

export const RatingComponent = ({
  selected,
  value,
  showText = true,
  onChange,
  className,
}: {
  selected: boolean;
  showText?: boolean;
  value: number;
  onChange?: (index: number) => void;
  className?: string;
}) => (
  <div
    className={cn(
      "h-20 w-[4.5rem] md:h-24 md:w-[5.5rem] border-[1px] bg-card border-gray-300 rounded-[4px] flex flex-col items-center justify-center transition-all",
      {
        "hover:shadow-md hover:shadow-secondary cursor-pointer": onChange,
      },
      {
        "border-primary shadow-md shadow-secondary": selected,
      },
      className,
    )}
    onClick={() => onChange?.(value)}
  >
    <div className="text-lg md:text-2xl">{ratingMap[value].emoji}</div>
    {showText && (
      <div className="text-xs md:text-sm">{ratingMap[value].text}</div>
    )}
  </div>
);

const Rating = ({
  value,
  onChange,
  loading,
}: {
  value: number | null;
  onChange?: (value: number) => void;
  loading?: boolean;
}) => {
  return (
    <div className="w-full flex flex-row justify-between gap-2">
      {Array.from({ length: 5 }).map((_, index) =>
        loading ? (
          <Skeleton
            key={`rating-${index}-loading`}
            className="h-20 w-[4.5rem] md:h-24 md:w-[5.5rem] rounded-[4px] flex flex-col items-center justify-center"
          />
        ) : (
          <RatingComponent
            key={`rating-${index}`}
            selected={value === index + 1}
            value={index}
            onChange={onChange}
          />
        ),
      )}
    </div>
  );
};

export default Rating;

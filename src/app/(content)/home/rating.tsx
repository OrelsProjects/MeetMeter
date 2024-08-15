"use client";
import React, { useMemo } from "react";
import { Skeleton } from "../../../components/ui/skeleton";
import { cn } from "../../../lib/utils";
import { ratingMap } from "../responses/[responseId]/consts";

export type Size = "small" | "large";

export const RatingComponent = ({
  selected,
  showText = true,
  value,
  size,
  onChange,
  className,
}: {
  selected: boolean;
  showText?: boolean;
  value: number;
  size?: Size;
  onChange?: (index: number) => void;
  className?: string;
}) => {
  const ratingMapValue = useMemo(() => {
    const clampedValue = Math.min(Math.max(value, 0), ratingMap.length - 1);
    return ratingMap[clampedValue];
  }, [value]);

  return (
    <div className="w-fit h-full flex flex-col gap-0.5 md:hover:cursor-pointer">
      <div
        className={cn(
          "w-full h-full border-[1px] bg-card border-gray-300 rounded-[4px] flex flex-col items-center justify-center transition-all",
          {
            "md:hover:shadow-md md:hover:shadow-secondary cursor-pointer": onChange,
          },
          {
            "border-primary shadow-md shadow-secondary": selected,
          },
          className,
        )}
        onClick={() => onChange?.(value + 1)}
      >
        <div
          className={cn("text-lg", {
            "md:text-4xl": size === "large",
          })}
        >
          {ratingMapValue.emoji}
        </div>
        {showText && size === "large" && (
          <div className={cn("text-xs md:text-sm")}>{ratingMapValue.text}</div>
        )}
      </div>
      {showText && size === "small" && (
        <div className={cn("text-xs text-center")}>{ratingMapValue.text}</div>
      )}
    </div>
  );
};

const Rating = ({
  value,
  onChange,
  size,
  className,
  loading,
}: {
  value: number | null;
  onChange?: (value: number) => void;
  size?: Size;
  className?: string;
  loading?: boolean;
}) => {
  return (
    <div className="w-full h-full flex flex-row justify-between gap-2">
      {Array.from({ length: ratingMap.length }).map((_, index) =>
        loading ? (
          <Skeleton
            key={`rating-${index}-loading`}
            className={cn(
              "rounded-[4px] flex flex-col items-center justify-center",
              className,
            )}
          />
        ) : (
          <RatingComponent
            key={`rating-${index}`}
            selected={!!value && value === index + 1}
            value={index}
            size={size}
            onChange={onChange}
            className={cn(className)}
          />
        ),
      )}
    </div>
  );
};

export default Rating;

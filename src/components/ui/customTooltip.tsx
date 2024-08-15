import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CiCircleInfo } from "react-icons/ci";

const InfoIcon = () => <CiCircleInfo className="text-foreground/70" />;

export default function CustomTooltip({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Popover>
        <PopoverTrigger className="flex md:hidden absolute top-1.5 right-2.5">
          <InfoIcon />
        </PopoverTrigger>

        <PopoverContent side="bottom">{children}</PopoverContent>
      </Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="cursor-default hidden md:flex absolute top-0 bottom-full -right-5">
            <InfoIcon />
          </TooltipTrigger>

          <TooltipContent
            side="bottom"
            className="bg-card text-card-foreground shadow dark:shadow-none"
          >
            {children}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

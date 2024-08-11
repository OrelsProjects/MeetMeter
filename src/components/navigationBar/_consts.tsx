import { ElementType } from "react";
import { GoHomeFill as HomeActive, GoHome as Home } from "react-icons/go";
import {
  PiRankingDuotone as Responses,
  PiRankingFill as ResponsesAction,
} from "react-icons/pi";
import { IoStatsChartOutline, IoStatsChart } from "react-icons/io5";
import { BiCalendarEvent, BiSolidCalendarEvent } from "react-icons/bi";

export interface NavigationBarItem {
  icon: ElementType;
  iconActive: ElementType;
  label: string;
  href: string;
  roleRequired?: string;
}

const className = "w-6 h-6 fill-muted-foreground/40 text-muted-foreground/40";
const classNameActive = "w-6 h-6 fill-muted-foreground";

export const BottomBarItems: NavigationBarItem[] = [
  {
    icon: () => <Home className={className} />,
    iconActive: () => <HomeActive className={classNameActive} />,
    label: "Home",
    href: "/home",
  },
  {
    icon: () => <BiCalendarEvent className={className} />,
    iconActive: () => <BiSolidCalendarEvent className={classNameActive} />,
    label: "Events",
    href: "/events",
  },
  {
    icon: () => <IoStatsChartOutline className={className} />,
    iconActive: () => <IoStatsChart className={classNameActive} />,
    label: "Dashboard",
    href: "/dashboard",
    roleRequired: "admin",
  },
];

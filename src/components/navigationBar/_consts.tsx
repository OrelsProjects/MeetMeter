import { ElementType } from "react";
import { GoHomeFill as HomeActive, GoHome as Home } from "react-icons/go";
import {
  PiRankingDuotone as Responses,
  PiRankingFill as ResponsesAction,
} from "react-icons/pi";
import { IoStatsChartOutline, IoStatsChart } from "react-icons/io5";

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
    roleRequired: "admin",
  },
  {
    icon: () => <Responses className={className} />,
    iconActive: () => <ResponsesAction className={classNameActive} />,
    label: "Responses",
    href: "/responses",
  },
  {
    icon: () => <IoStatsChartOutline className={className} />,
    iconActive: () => <IoStatsChart className={classNameActive} />,
    label: "Dashboard",
    href: "/dashboard",
    roleRequired: "admin",
  },
];

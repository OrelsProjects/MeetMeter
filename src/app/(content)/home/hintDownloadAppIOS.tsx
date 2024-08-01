import React, { useEffect, useState } from "react";
import { isMobile } from "../../../lib/utils/notificationUtils";
import { cn } from "../../../lib/utils";
import { IoShareOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { Button } from "../../../components/ui/button";
import { motion } from "framer-motion";

const setPopupShown = () => {
  localStorage.setItem("popupShown", "true");
};

const isPopupShown = () => {
  return localStorage.getItem("popupShown") === "true";
};

export default function HintDownloadAppIOS({
  className,
}: {
  className?: string;
}) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!isMobile.iOS() || isPopupShown()) {
      setShouldShow(false);
    }
    setShouldShow(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: shouldShow ? 1 : 0 }}
      exit={{ opacity: 0 }}
      key="hintDownloadAppIOS"
      className={cn(
        "w-full h-fit flex justify-start items-center bg-gray-200 rounded-lg mb-2 p-2 shadow-md relative",
        className,
      )}
    >
      <p className="text-sm flex flex-row flex-wrap gap-1 font-extralight text-gray-700 text-start">
        <span className="pt-1">
          Install this app on your iPhone:{" "}
          <span className="font-normal"> Tap on </span>
        </span>
        <IoShareOutline className="text-blue-400 w-6 h-6" />
        <span>and then </span>
        <span className="font-normal"> Add to homescreen</span>
      </p>
      <Button
        className="absolute top-0 right-1 !p-0"
        variant="ghost"
        onClick={() => {
          setPopupShown();
          setShouldShow(false);
        }}
      >
        <IoMdClose className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

import React, { useEffect, useState } from "react";
import {
  canUseNotifications,
  isMobile,
} from "../../../lib/utils/notificationUtils";
import { cn } from "../../../lib/utils";
import { IoShareOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";

const setPopupShown = () => {
  localStorage.setItem("popupShown", "true");
};

const isPopupShown = () => {
  return localStorage.getItem("popupShown") === "true";
};

const isAppInstalledIos = () => {
  // if cant use notifications, it means the app was opened in a browser. Otherwise, it was added to homescreen
  return canUseNotifications();
};

export default function HintDownloadAppIOS({
  className,
  forceShow,
  onClose,
}: {
  className?: string;
  forceShow?: boolean;
  onClose?: () => void;
}) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const android = isMobile.Android();
    const blackberry = isMobile.BlackBerry();
    const ios = isMobile.iOS();
    const opera = isMobile.Opera();
    const samsung = isMobile.Samsung();
    const windows = isMobile.Windows();

    console.log(
      "android",
      android,
      "blackberry",
      blackberry,
      "ios",
      ios,
      "opera",
      opera,
      "samsung",
      samsung,
      "windows",
      windows,
    );

    if (!isMobile.iOS() || isPopupShown() || isAppInstalledIos()) {
      setShouldShow(false);
    } else {
    setShouldShow(true);
    }
  }, []);

  return (
    <AnimatePresence>
      {(shouldShow || forceShow) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key="hintDownloadAppIOS"
          className={cn(
            "w-full h-fit flex justify-start items-center bg-gray-200 rounded-lg mb-2 p-2 shadow-md absolute bottom-0",
            className,
          )}
        >
          <IoCloseOutline
            className="text-blue-400 w-6 h-6 absolute top-2 right-3"
            onClick={() => {
              setPopupShown();
              setShouldShow(false);
              onClose?.();
            }}
          />
          <p className="text-sm flex flex-row flex-wrap gap-1 font-extralight text-gray-700 text-start">
            <p>
              <span className="pt-1">
                For <strong>best experience</strong>, install this app on <br />
                your iPhone:{" "}
              </span>
              <p>
                <span className="font-medium flex flex-row mt-1">
                  <span>Tap on</span>
                  <IoShareOutline className="text-blue-400 w-6 h-6 pb-1" />
                  <span className="font-extralight">and then </span>
                  <span className="font-medium ml-1"> Add to homescreen</span>
                </span>
              </p>
            </p>

            <p></p>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

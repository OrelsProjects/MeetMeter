export const canUseNotifications = () => {
  return (
    ("Notification" in window || "PushManager" in window) &&
    "serviceWorker" in navigator
  );
};

const isNavigator = typeof navigator !== "undefined";

const getNavigator = (): Navigator | undefined =>
  isNavigator ? navigator : undefined;

export const isMobile = {
  Android: function () {
    return getNavigator()?.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return getNavigator()?.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return getNavigator()?.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return getNavigator()?.userAgent.match(/Opera Mini/i);
  },
  Samsung: function () {
    return getNavigator()?.userAgent.match(
      /SAMSUNG|Samsung|SGH-[I|N|T]|GT-[I|N]|SM-[A|N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L/i,
    );
  },
  Windows: function () {
    return (
      getNavigator()?.userAgent.match(/IEMobile/i) ||
      getNavigator()?.userAgent.match(/WPDesktop/i)
    );
  },
  Safari: function () {
    return (
      getNavigator()?.userAgent.match(/Safari/i) &&
      getNavigator()?.userAgent.match(/Version/i)
    );
  },
};

export const isMobilePhone = () =>
  isMobile.Android() ||
  isMobile.BlackBerry() ||
  isMobile.iOS() ||
  isMobile.Opera() ||
  isMobile.Windows();

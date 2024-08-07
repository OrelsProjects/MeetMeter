export const canUseNotifications = () => {
  return (
    ("Notification" in window || "PushManager" in window) &&
    "serviceWorker" in navigator
  );
};

export const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Samsung: function () {
    return navigator.userAgent.match(
      /SAMSUNG|Samsung|SGH-[I|N|T]|GT-[I|N]|SM-[A|N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L/i,
    );
  },
  Windows: function () {
    return (
      navigator.userAgent.match(/IEMobile/i) ||
      navigator.userAgent.match(/WPDesktop/i)
    );
  },
  Safari: function () {
    return (
      navigator.userAgent.match(/Safari/i) &&
      navigator.userAgent.match(/Version/i)
    );
  },
};

export const isMobilePhone = () =>
  isMobile.Android() ||
  isMobile.BlackBerry() ||
  isMobile.iOS() ||
  isMobile.Opera() ||
  isMobile.Windows();

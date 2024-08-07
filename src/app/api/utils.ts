import prisma from "@/app/api/_db/db";

export const MIN_TIME_BETWEEN_NOTIFICATIONS = 4 * 60 * 60 * 1000;

/**
 * Check if the user can notify attendees
 * @param eventId The event id
 * @param userId The user id
 * @returns The date when the user can notify attendees again. Null if the user can notify attendees
 */
export const canNotifyAt = async (
  // calendarId: string,
  eventId: string,
  userId: string,
): Promise<Date | "now"> => {
  const lastNotification = await prisma.responseEventNotifications.findFirst({
    where: {
      responseEvent: {
        eventId,
        // calendarId,
      },
      sentBy: userId,
    },
    orderBy: {
      sentAt: "desc",
    },
  });

  if (!lastNotification) {
    return "now";
  }

  const lastNotificationDate = new Date(lastNotification.sentAt);
  const now = new Date();
  if (
    now.getTime() - lastNotificationDate.getTime() >
    MIN_TIME_BETWEEN_NOTIFICATIONS
  ) {
    return "now";
  }

  return new Date(
    lastNotificationDate.getTime() + MIN_TIME_BETWEEN_NOTIFICATIONS,
  );
};

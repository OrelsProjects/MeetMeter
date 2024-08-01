import { messaging } from "../../../../firebase.config.admin";
import loggerServer from "../../../loggerServer";

export async function sendNotification(options: {
  token: string;
  userId: string;
  title: string;
  type: string;
  body?: string;
  image?: string;
  onClickNavigateTo?: string; // Url to open when notification is clicked
  data?: { [key: string]: any };
}) {
  const { token, userId, title, type, body, image, data } = options;

  // Convert all data values to strings
  const stringData = data
    ? Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, String(value)]),
      )
    : {};

  const message = {
    data: {
      title,
      body: body || "",
      icon: process.env.NOTIFICATION_LOGO_URL || "/notification-icon.png",
      badge: "/notification-icon.png",
      image: image || "",
      click_action: options.onClickNavigateTo || "",
      ...stringData,
    },
    webpush: {
      fcmOptions: {
        link: "https://meet-meter-ikwx.vercel.app/",
      },
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
          threadId: type,
        },
      },
      headers: {
        "apns-push-type": "background",
        "apns-priority": "10", // Must be `5` when `contentAvailable` is set to true.
      },
    },
    android: {
      notification: {
        icon: process.env.NOTIFICATION_LOGO_URL || "",
        channelId: type,
        tag: type,
      },
    },
  };

  try {
    await messaging.send({
      ...message,
      token,
    });

    loggerServer.info("Notification sent", userId, {
      data: { message },
    });
  } catch (error: any) {
    loggerServer.error("Error sending mobile notification", userId, {
      data: { error, token },
    });
  } finally {
    return message;
  }
}

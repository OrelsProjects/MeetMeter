import { messaging } from "../../../../firebase.config.admin";
import loggerServer from "../../../loggerServer";

/**
 * Policy: Send to mobile first, then to web, if mobile fails
 * @param options Notification options
 */
export async function sendNotification(options: {
  token: {
    mobile?: string;
    web?: string;
  };
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
        link: process.env.APP_BASE_URL || "",
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
      token: token.web || "",
    });

    loggerServer.info("Notification sent", userId, {
      data: { message },
    });
  } catch (error: any) {
    loggerServer.error("Error sending mobile notification", userId, {
      data: { error, token },
    });
    try {
      await messaging.send({
        ...message,
        token: token.web || "",
      });
    } catch (error: any) {
      loggerServer.error("Error sending web notification", userId, {
        data: { error, token },
      });
    }
  } finally {
    return message;
  }
}

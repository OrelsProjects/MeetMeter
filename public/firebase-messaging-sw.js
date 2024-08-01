importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyALRNz_yZzbiMO_AuF1k2b9kKC70NUjBYs",
  authDomain: "meetmeter-baff2.firebaseapp.com",
  projectId: "meetmeter-baff2",
  storageBucket: "meetmeter-baff2.appspot.com",
  messagingSenderId: "661315757732",
  appId: "1:661315757732:web:97857b8f1fdacf2b88e831",
  measurementId: "G-E0LSGQBZ4B",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

class CustomPushEvent extends Event {
  constructor(data) {
    super("push");

    Object.assign(this, data);
    this.custom = true;
  }
}

/*
 * Overrides push notification data, to avoid having 'notification' key and firebase blocking
 * the message handler from being called
 */
self.addEventListener("push", e => {
  if (e.custom) return;
  const oldData = e.data;
  const newEvent = new CustomPushEvent({
    data: {
      json() {
        const newData = oldData.json();
        newData.data = { ...newData.data, ...newData.notification };
        delete newData.notification;
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });
  e.stopImmediatePropagation();
  dispatchEvent(newEvent);
});

messaging.onBackgroundMessage(payload => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  try {
    const { title, body, icon, badge, userId, type, ...restPayload } =
      payload.data;

    const notificationOptions = {
      body,
      icon: icon,
      badge: badge,
      data: restPayload,
      tag: restPayload.tag || "meet-meter",
    };

    notificationOptions.actions = [
      {
        action: "event-rate-bad",
        title: "Bad",
      },
      // {
      //   action: "event-rate-good",
      //   title: "Good",
      // },
      // {
      //   action: "event-rate-excellent",
      //   title: "Excellent",
      // },
    ];

    return self.registration.showNotification(title, notificationOptions);
  } catch (error) {
    console.error("Error showing notification:", error);
  }
});

// self.addEventListener("notificationclick", event => {
//   console.log("Notification click event:", event);
//   const { action } = event;

//   try {
//     switch (action) {
//       case "event-rate-bad":
//         sendResponseToServer("bad");
//         return;
//       case "event-rate-good":
//         sendResponseToServer("good");
//         return;
//       case "event-rate-excellent":
//         sendResponseToServer("excellent");
//         return;
//       default:
//         break;
//     }

//     if (event.notification.data && event.notification.data.click_action) {
//       self.clients.openWindow(event.notification.data.click_action);
//     } else {
//       self.clients.openWindow(event.currentTarget.origin);
//     }

//     event.notification.close();
//   } catch (error) {
//     console.error("Error handling notification click:", error);
//   }
// });

// function sendResponseToServer(response, eventId, calendarId) {
//   const postUrl = `api/calendar/${calendarId}/event/${eventId}/response`;
//   const postData = {
//     response,
//     type: "response-to-event",
//   };

//   fetch(postUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(postData),
//   })
//     .then(data => {
//       console.log("Success:", data);
//     })
//     .catch(error => {
//       console.error("Error:", error);
//     });
// }

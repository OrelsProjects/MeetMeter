importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyALZvbmwKVBUXia4-u2Wv__C6ST6GFbBUQ",
  authDomain: "myworkout-ca350.firebaseapp.com",
  projectId: "myworkout-ca350",
  storageBucket: "myworkout-ca350.appspot.com",
  messagingSenderId: "334976118267",
  appId: "1:334976118267:web:2547d2f91a0235d1aa2f5e",
  measurementId: "G-BTFG0DLT3J",
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
  // Skip if event is our own custom event
  if (e.custom) return;

  // Kep old event data to override
  const oldData = e.data;

  // Create a new event to dispatch, pull values from notification key and put it in data key,
  // and then remove notification key
  const newEvent = new CustomPushEvent({
    data: {
      ehheh: oldData.json(),
      json() {
        const newData = oldData.json();
        newData.data = {
          ...newData.data,
          ...newData.notification,
        };
        delete newData.notification;
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });

  // Stop event propagation
  e.stopImmediatePropagation();

  // Dispatch the new wrapped event
  dispatchEvent(newEvent);
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  // console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const { title, body, icon, badge, userId, type, ...restPayload } =
    payload.data;

  const notificationOptions = {
    body,
    icon: icon,
    badge: badge,
    data: restPayload,
    // image: icon,
    tag: restPayload.tag || "meet-meter", // This is used to make sure all notifications with the same tag are grouped together
  };

  if (type.includes("event-")) {
    notificationOptions.actions = [
      {
        action: "event-rate-bad",
        title: "Bad",
      },
      {
        action: "event-rate-good",
        title: "Good",
      },
      {
        action: "event-rate-excellent",
        title: "Excellent",
      },
    ];
  }

  return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", event => {
  const { action } = event;

  switch (action) {
    case "event-rate-bad":
      sendResponseToServer("bad");
      return;
    case "event-rate-good":
      sendResponseToServer("good");
      return;
    case "event-rate-excellent":
      sendResponseToServer("excellent");
      return;
    default:
      break;
  }

  if (event.notification.data && event.notification.data.click_action) {
    self.clients.openWindow(event.notification.data.click_action);
  } else {
    self.clients.openWindow(event.currentTarget.origin);
  }

  // close notification after click
  event.notification.close();
});

function sendResponseToServer(response, eventId, calendarId) {
  const postUrl = `api/calendar/${calendarId}/event/${eventId}/response`;
  const postData = {
    response,
    type: "response-to-event",
  };

  fetch(postUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then(data => {
      console.log("Success:", data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

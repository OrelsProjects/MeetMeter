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

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body, icon, badge, userId, type, ...restPayload } =
    payload.data;

  // Define the default notification options
  const notificationOptions = {
    body,
    icon,
    badge,
    data: { userId, ...restPayload },
    tag: restPayload.tag || "meet-meter",
  };

  // Check the type and conditionally add the action

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

  // Display the notification
  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", event => {
  switch (event.action) {
    case "event-rate-bad":
      sendResponseToServer(
        "bad",
        event.notification.data.eventResponseId,
      );
      break;
    case "event-rate-good":
      sendResponseToServer(
        "good",
        event.notification.data.eventResponseId,
      );
      break;
    case "event-rate-excellent":
      sendResponseToServer(
        "excellent",
        event.notification.data.eventResponseId,
      );
      break;
    default:
      if (event.notification.data && event.notification.data.click_action) {
        self.clients.openWindow(event.notification.data.click_action);
      } else {
        self.clients.openWindow(event.currentTarget.origin);
      }
      break;
  }

  // close notification after click
  event.notification.close();
});

function sendResponseToServer(response, eventResponseId) {
  const postUrl = `api/eventResponse/${eventResponseId}/response`;
  const postData = {
    response,
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

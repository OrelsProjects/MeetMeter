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
    tag: restPayload.tag || "pinky-partner",
  };

  // Check the type and conditionally add the action

  notificationOptions.actions = [
    {
      action: "sendGoodJob",
      title: "Send Good Job",
    },
  ];

  // Display the notification
  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", event => {
  // Handle action button click
  if (event.action === "sendGoodJob") {
    sendResponseToServer(
      event.notification.data.toUserId,
      event.notification.data.fromName,
      "goodJob",
    );
  } else if (event.action === "responseNudge") {
    sendResponseToServer(
      event.notification.data.toUserId,
      event.notification.data.fromName,
      "nudge",
    );
  } else if (event.notification.data && event.notification.data.click_action) {
    // Handle other notification click actions
    self.clients.openWindow(event.notification.data.click_action);
  } else {
    // Default action: open application
    self.clients.openWindow(event.currentTarget.origin);
  }
  event.notification.close();
});

function sendResponseToServer(toUserId, fromName, type) {
  const postUrl = "api/notifications";
  const postData = {
    title: "Good job!",
    body: fromName + " is proud of you!",
    userId: toUserId,
    type: "response",
  };

  if (type === "nudge") {
    postData.title = fromName + " is on it!";
    postData.body = fromName + " is working on their goal.";
  }

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

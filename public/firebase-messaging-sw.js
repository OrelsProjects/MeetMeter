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
  try {
    console.log("event", JSON.stringify(e));
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
    console.log("newEvent", JSON.stringify(newEvent));
    e.stopImmediatePropagation();
    dispatchEvent(newEvent);
  } catch (error) {
    console.error("Error in push event", JSON.stringify(error));
  }
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  try {
    console.log("Received background message ", JSON.stringify(payload));
    const { title, body, icon, badge, userId, type, ...restPayload } =
      payload.data;

    // Define the default notification options
    const notificationOptions = {
      body: body || "",
      icon: icon || "",
      badge: badge || "",
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
    ];

    // Display the notification
    self.registration.showNotification(title, notificationOptions);
  } catch (error) {
    console.error("Error in background message", JSON.stringify(error));
  }
});

self.addEventListener("notificationclick", event => {
  try {
    switch (event.action) {
      case "event-rate-bad":
        sendResponseToServer("bad", 2, event.notification.data.eventResponseId);
        break;
      case "event-rate-good":
        sendResponseToServer(
          "good",
          3,
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
  } catch (error) {
    console.error("Error in notification click", JSON.stringify(error));
  }
});

function sendResponseToServer(response, rating, eventResponseId) {
  const postUrl = `api/eventResponse/${eventResponseId}/response`;

  const postData = {
    response: response || "good",
    rating: rating || 3,
    comments: "from-notification",
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

/**
 * 
self.addEventListener("notificationclick", event => {
  let promise;
  try {
    switch (event.action) {
      case "event-rate-bad":
        promise = sendResponseToServer(
          "bad",
          2,
          event.notification.data.eventResponseId,
        );
        break;
      case "event-rate-good":
        promise = sendResponseToServer(
          "good",
          3,
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
    promise
      .then(() => {
        console.log("Response sent to server");
      })
      .catch(error => {
        console.error(
          "Error in sending response to server",
          JSON.stringify(error),
        );
      });
    // close notification after click
    event.notification.close();
  } catch (error) {
    console.error("Error in notification click", JSON.stringify(error));
  }
});

function sendResponseToServer(response, rating, eventResponseId) {
  const postUrl = `/api/eventResponse/${eventResponseId}/response`;
  const postData = {
    response,
    comments: "from-notification",
    rating,
  };

  return fetch(postUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });
}

 */

// /* eslint-disable no-undef */
// importScripts(
//   "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
// );

// const firebaseConfig = {
//   apiKey: "AIzaSyCDcieVMZwjEhPKYPYwMkNNgW2qpi0LflU",
//   authDomain: "notification-495f5.firebaseapp.com",
//   projectId: "notification-495f5",
//   storageBucket: "notification-495f5.firebasestorage.app",
//   messagingSenderId: "629777589006",
//   appId: "1:629777589006:web:a9e02dc2d4af3096dced5f",
// };

// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// // Handle background messages
// messaging.onBackgroundMessage((payload) => {
//   console.log("Service Worker: Message received in background:", payload);
//   // Customize notification here
//   const notificationTitle = payload.data.title || "Default Title";
//   const notificationOptions = {
//     body: payload.data.body || "Default body text",
//     icon: payload.data.image || "./icon.svg",
//     image: payload.data.image || "./icon.svg",
//     tag: payload.data.tag || "default_tag",
//     renotify: true,
//     badge: payload.data.image || "./icon.svg",
//     vibrate: [100, 50, 100],

//     actions: JSON.parse(payload.data.actions),
//     data: {
//       url: payload.data.click_action || "http://localhost:5173",
//     },
//   };

//   console.log("Notification Title: ", notificationTitle);
//   console.log("Notification Options: ", notificationOptions);

//   // Show the notification
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// self.addEventListener("notificationclick", (event) => {
//   console.log("Notification click event: ", event);

//   // Close the notification
//   event.notification.close();

//   // Open the URL specified in the notification's data
//   const urlToOpen = event.notification.data?.url || "http://localhost:5173";

//   event.waitUntil(
//     clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then((clientList) => {
//         for (const client of clientList) {
//           if (client.url === urlToOpen && "focus" in client) {
//             return client.focus();
//           }
//         }
//         if (clients.openWindow) {
//           return clients.openWindow(urlToOpen);
//         }
//       })
//   );
// });

/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCDcieVMZwjEhPKYPYwMkNNgW2qpi0LflU",
  authDomain: "notification-495f5.firebaseapp.com",
  projectId: "notification-495f5",
  storageBucket: "notification-495f5.firebasestorage.app",
  messagingSenderId: "629777589006",
  appId: "1:629777589006:web:a9e02dc2d4af3096dced5f",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Service Worker: Message received in background:", payload);

  const { title, body, icon, tag, click_action, type } = payload.data;

  let notificationOptions = {
    body: body || "Default body text",
    icon: icon || "./icon.svg",
    badge: icon || "./icon.svg",
    vibrate: [100, 50, 100],
    renotify: true,
    tag: tag || "default_tag",
    data: {
      url: click_action || "http://localhost:5173",
      type: type || "default",
    },
  };

  // Modify options based on notification type
  switch (type) {
    case "chat":
      notificationOptions.actions = [
        { action: "open_chat", title: "Open Chat" },
        { action: "dismiss", title: "Dismiss" },
      ];
      break;
    case "friend_request":
      notificationOptions.actions = [
        { action: "open_url", title: "View" },
        { action: "dismiss", title: "Dismiss" },
      ];
      break;
    case "friend_request_accepted":
      notificationOptions.actions = [
        { action: "open_friends", title: "See Friends" },
        { action: "dismiss", title: "Dismiss" },
      ];
      break;
    case "alert":
      notificationOptions.sound = "default";
      break;
    default:
      // Default actions if type is unknown
      notificationOptions.actions = JSON.parse(payload.data.actions || "[]");
      break;
  }

  self.registration.showNotification(
    title || "Notification",
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  // i want to close the notification when dismissed and prevent default action
  if (event.action === "dismiss") {
    event.notification.close();
    return;
  }
  // Handle notification click event
  console.log("Notification click event: ", event);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "http://localhost:5173";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

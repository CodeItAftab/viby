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

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Service Worker: Message received in background:", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title || "Default Title";
  const notificationOptions = {
    body: payload.notification.body || "Default body text",
    image: payload.notification.image || "/custom-image.png",
    data: {
      url: payload.notification.click_action || "http://localhost:5173",
    },
  };

  console.log("Notification Title: ", notificationTitle);
  console.log("Notification Options: ", notificationOptions);

  // Show the notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

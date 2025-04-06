import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { postRequest } from "./axios";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

const GenerateFCMToken = async () => {
  try {
    const token = await getToken(messaging, { vapidKey });
    console.log("FCM Token: ", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token: ", error);
  }
};

const UpdateFCMTokenToServer = async (token) => {
  const userAgent = navigator.userAgent;
  const tokenData = {
    token: token,
    userAgent: userAgent,
  };

  try {
    const response = await postRequest("/notification/update-fcm-token", {
      tokenData,
    });
    console.log("FCM token updated successfully: ", response.data);
  } catch (error) {
    console.error("Error updating FCM token: ", error);
  }
};

export { messaging, GenerateFCMToken, UpdateFCMTokenToServer };

import { getNoticationToken } from "@/lib/firebase";

export const requestNotificationPermission = async () => {
  const notificationPersmission = await Notification.requestPermission();
  if (notificationPersmission === "granted") {
    // Generate Token
    const token = await getNoticationToken();
    console.log("\n", token);
  } else if (notificationPersmission === "denied") {
    // Show Notification Denied
  }
};

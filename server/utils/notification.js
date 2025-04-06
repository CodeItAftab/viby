const admin = require("./firebase");

const SendNotification = async (payload) => {
  try {
    const response = await admin.messaging().send(payload);
    console.log("✅ Notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    throw error;
  }
};

const SendNewMessageNotification = async (token, chatId, message, avatar) => {
  const payload = {
    data: {
      title: `New Message`,
      body: message?.content || "You have a new message",
      // senderName: message.sender.name,
      chatId: chatId,
      // icon: avatar,
      tag: `NEW_MESSAGE#${chatId}`,
    },
    token: token,
  };

  const res = await SendNotification(payload);

  console.log("New message notification sent:", res);
};

// const FriendRequestNotification = (requestId, token) => {
//   return {
//     data: {
//       type: "FRIEND_REQUEST",
//       requestId: requestId,
//       tag: `FRIEND_REQUEST#${requestId}`,
//     },
//     token,
//   };
// };

// const FriendRequestAcceptedNotification = (requestId, token) => {
//   return {
//     data: {
//       type: "FRIEND_REQUEST_ACCEPTED",
//       requestId: requestId,
//       tag: `FRIEND_REQUEST_ACCEPTED#${requestId}`,
//     },
//     token,
//   };
// };

const sendNotification = async (fcmToken) => {
  if (!fcmToken) {
    throw new Error("FCM token is required to send a notification");
  }

  const payload = {
    notification: {
      title: "New Notification",
      body: "This is a test notification",
    },
    token: fcmToken, // Ensure the token is passed here
  };

  try {
    const response = await admin.messaging().send(payload);
    console.log("Notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

module.exports = {
  SendNotification,
  SendNewMessageNotification,
  sendNotification,
  // NewMessageNotitfication,
  // FriendRequestNotification,
  // FriendRequestAcceptedNotification,
};

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

const SendNewFriendRequestNotification = async (
  token,
  requestId,
  sender_name,
  sender_avatar
) => {
  const payload = {
    notification: {
      title: `${sender_name} sent you a friend request`,
      body: `You have a new friend request from ${sender_name}`,
      image: sender_avatar?.url, // Ensure it's a string
    },
    data: {
      type: "friend_request",
      friendId: String(requestId), // Convert to string
      sender_name: String(sender_name), // Ensure it's a string
      sender_avatar: String(sender_avatar), // Ensure it's a string
    },
    token: token,
  };

  const response = SendNotification(payload);
  return response;
};

module.exports = {
  SendNotification,
  SendNewFriendRequestNotification,
};

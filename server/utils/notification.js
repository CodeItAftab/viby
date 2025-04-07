const admin = require("./firebase");

const SendNotification = async (payload) => {
  try {
    const response = await admin.messaging().send(payload);
    console.log("✅ Notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    // throw error;
  }
};

const SendNewFriendRequestNotification = async (
  token,
  requestId,
  sender_name,
  sender_avatar
) => {
  // add click_action to the payload to redirect to friend requests page
  const payload = {
    data: {
      type: "friend_request",
      tag: "friend_request",
      title: `New Friend Request`,
      // Name should be bolded like title
      // but it is not possible in web push notifications
      // so we will use the title as the name and body as the message
      body: `${sender_name} sent you a friend request`,
      requestId: String(requestId), // Convert to string
      sender_name: String(sender_name), // Ensure it's a string
      icon: String(sender_avatar), // Ensure it's a string
      click_action: `https://viby-alpha.vercel.app/requests`, // URL to open when the notification is clicked
    },
    token: token,
  };

  const response = SendNotification(payload);
  return response;
};

// Friend Request Accepted Notification

const SendFriendRequestAcceptedNotification = async (
  token,
  chatId,
  receiver_name,
  receiver_avatar
) => {
  // add click_action to the payload to redirect to friend requests page

  const payload = {
    data: {
      type: "friend_request_accepted",
      tag: `friend_request_accepted ${chatId}`,
      // Unique tag for each chat to avoid overwriting notifications
      title: `Friend Request Accepted`,
      body: `${receiver_name} accepted your friend request`,
      chatId: String(chatId), // Convert to string
      receiver_name: String(receiver_name), // Ensure it's a string
      icon: String(receiver_avatar), // Ensure it's a string
      actions: JSON.stringify([
        { action: "open_friends", title: "See Friends" },
        { action: "dismiss", title: "Dismiss" },
      ]), // Actions for the notification
      click_action: `https://viby-alpha.vercel.app/friends`, // URL to open when the notification is clicked
    },
    token: token,
  };

  const response = SendNotification(payload);
  return response;
};

// New Message Notification
const SendNewMessageNotification = async (
  token,
  chatId,
  sender_name,
  sender_avatar,
  message,
  message_type
) => {
  const payload = {
    data: {
      type: "new_message",
      tag: `new_message_${chatId}`,
      // Unique tag for each chat to avoid overwriting notifications
      title: "New Message",
      body: `${sender_name}: ${message}`,
      chatId: String(chatId), // Convert to string
      sender_name: String(sender_name), // Ensure it's a string
      messageType: String(message_type), // Renamed from message_type to messageType
      sender_avatar: String(sender_avatar), // Ensure it's a string
      message: String(message), // Ensure it's a string
      icon: String(sender_avatar), // Ensure it's a string
      actions: JSON.stringify([
        { action: "open_chat", title: "Open Chat" },
        { action: "dismiss", title: "Dismiss" },
      ]), // Actions for the notification
      click_action: `https://viby-alpha.vercel.app/chats/${chatId}`, // URL to open when the notification is clicked
    },
    token: token,
  };

  const response = await SendNotification(payload); // Add `await` to ensure proper async handling
  return response;
};

module.exports = {
  SendNotification,
  SendNewFriendRequestNotification,
  SendFriendRequestAcceptedNotification,
  SendNewMessageNotification,
};

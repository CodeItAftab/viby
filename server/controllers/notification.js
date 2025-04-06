const User = require("../models/user");

const { TryCatch, ErrorHandler } = require("../utils/error");

const updateFCMTokenToUser = TryCatch(async (req, res, next) => {
  const { tokenData } = req.body;
  const { token, userAgent } = tokenData || {};

  const userId = req?.user?._id;

  // Check if fcmToken is provided
  if (!token || !userAgent) {
    return new ErrorHandler(400, "FCM token and user agent are required");
  }

  // Update the user's FCM token in the database
  const user = await User.findById(userId);
  if (!user) {
    return new ErrorHandler(404, "User not found");
  }

  // check if user already has the token with given user agent

  const existingTokenIndex = user.fcm_tokens.findIndex(
    (fcmToken) => fcmToken.user_agent === userAgent
  );
  if (existingTokenIndex !== -1) {
    // Update the existing token
    user.fcm_tokens[existingTokenIndex].token = token;
  } else {
    // Add a new token
    // Check if the user has reached the maximum number of tokens (5)
    if (user.fcm_tokens.length >= 5) {
      // Remove the oldest token
      user.fcm_tokens.shift();
    }

    user.fcm_tokens.push({
      user_agent: userAgent,
      token: token,
    });
  }

  // Save the user with the updated FCM token
  await user.save();

  // Return success response
  return res.status(200).json({
    success: true,
    message: "FCM token updated successfully",
  });
});

module.exports = {
  updateFCMTokenToUser,
};

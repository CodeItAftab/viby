const User = require("../models/user");
const { TryCatch, ErrorHandler } = require("../utils/error");
const { sendNotification } = require("../utils/notification");

const UserToFCMToken = {};

const updateFCMTokenToUser = TryCatch(async (req, res, next) => {
  const { tokenData } = req.body;

  if (!tokenData) {
    return new ErrorHandler(400, "Token data is required");
  }

  const { token, browserId } = tokenData;

  if (!token || !browserId) {
    return new ErrorHandler(400, "Token and browserId are required");
  }

  // check if userId is present in the UserToFCMToken object
  const existingUser = UserToFCMToken[req.user._id];
  if (!existingUser) {
    // If userId is not present, create a new entry of UserToFCMToken object and push the token and browserId the the array
    const newEntry = [{ token, browserId }];
    UserToFCMToken[req.user._id] = newEntry;
  }

  //  If userId is present, check if the token and browserId are already present in the array with the help of browserId and if they are not present, push the token and browserId to the array and if the entry is present but token is different, update the token in the array
  const existingTokenIndex = UserToFCMToken[req.user._id].findIndex(
    (entry) => entry.browserId === browserId
  );

  if (
    existingTokenIndex !== -1 &&
    UserToFCMToken[req.user._id][existingTokenIndex].token !== token
  ) {
    // Update the existing token if it is different
    UserToFCMToken[req.user._id][existingTokenIndex].token = token;
  } else if (existingTokenIndex === -1) {
    // Check if the user has reached the maximum number of tokens (5)
    if (UserToFCMToken[req.user._id].length >= 5) {
      // Remove the oldest token
      UserToFCMToken[req.user._id].shift();
    }

    // Add a new token and browserId
    UserToFCMToken[req.user._id].push({ token, browserId });
  }
  // Todo : Update the user's FCM token in the database

  console.log("UserToFCMToken", UserToFCMToken);

  // Return success response
  return res.status(200).json({
    success: true,
    message: "FCM token updated successfully",
  });
});

module.exports = {
  updateFCMTokenToUser,
  UserToFCMToken,
};

const express = require("express");
const { updateFCMTokenToUser } = require("../controllers/notification");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.use(isAuthenticated);

router.post("/update-fcm-token", updateFCMTokenToUser);

module.exports = router;

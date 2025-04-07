const express = require("express");
const {
  register,
  sendOTP,
  verifyOTP,
  login,
  logout,
} = require("../controllers/auth");

const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register, sendOTP);

router.post("/verify_otp", verifyOTP);

router.post("/login", login);

router.post("/logout", isAuthenticated, logout);

module.exports = router;

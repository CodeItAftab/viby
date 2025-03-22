const express = require("express");
const {
  register,
  sendOTP,
  verifyOTP,
  login,
  logout,
} = require("../controllers/auth");

const router = express.Router();

router.post("/register", register, sendOTP);

router.post("/verify_otp", verifyOTP);

router.post("/login", login);

router.get("/logout", logout);

module.exports = router;

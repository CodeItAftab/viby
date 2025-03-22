const { TryCatch, ErrorHandler } = require("../utils/error");
const User = require("../models/user");
const { getNewOtp, compareHashedData, sendToken } = require("../utils/helper");
const { hashSync } = require("bcrypt");
const { sendEmail } = require("../utils/mailer");

const register = TryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;
  // console.log(name, email, password);

  const existing_user = await User.findOne({ email }).select("+verified");
  if (existing_user && existing_user.verified) {
    return new ErrorHandler(400, "User already exists");
  } else if (existing_user) {
    existing_user.name = name;
    existing_user.password = password;
    await existing_user.save();
    req.userId = existing_user._id;
    return next();
  } else {
    const new_user = new User({ name, email, password });
    await new_user.save();
    req.userId = new_user._id;
    return next();
  }
});

const sendOTP = TryCatch(async (req, res, next) => {
  const { userId } = req;
  const otp = getNewOtp();
  console.log(otp);

  const hashed_otp = hashSync(otp, 10);

  const expiry_time = Date.now() + 10 * 60 * 1000; // 10 minutes
  // console.log(expiry_time);

  const user = await User.findByIdAndUpdate(
    userId,
    {
      otp: hashed_otp,
      otp_expiry_time: expiry_time,
    },
    {
      new: true,
      validateModifiedOnly: true,
    }
  );

  // Send otp to email

  const mailOptions = {
    to: user.email,
    from: "vibychat@gmail.com",
    subject: "OTP for email verification",
    text: `OTP for email verification is ${otp}`,
  };

  await sendEmail(mailOptions);

  res.status(200).json({
    success: true,
    message: "OTP sent to email",
  });
});

const verifyOTP = TryCatch(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  }).select("+otp");

  if (!user) {
    return new ErrorHandler(401, "Invalid email or OTP expired");
  }

  if (!compareHashedData(otp, user.otp)) {
    return new ErrorHandler(401, "Invalid OTP");
  }

  user.verified = true;
  user.otp = undefined;
  user.otp_expiry_time = undefined;
  await user.save();

  const mailOptions = {
    to: user.email,
    from: "vibychat@gmail.com",
    subject: "Welcome to Viby Chat",
    text: `Welcome to Viby Chat. Your email has been verified successfully. Enjoy chatting with your friends`,
  };

  await sendEmail(mailOptions);

  return sendToken(res, user._id, 200, "Otp verified successfully");
});

const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return new ErrorHandler(401, "User with this email does not exist");
  }
  const isCorrectPassword = compareHashedData(password, user.password);
  if (!isCorrectPassword) {
    return new ErrorHandler(401, "Incorrect password");
  }
  return sendToken(res, user._id, 200, "Login successful");
});

const logout = TryCatch(async (req, res, next) => {
  res
    .status(200)
    .cookie("vib-token", "", {
      maxAge: 0,
      sameSite: "none",
      httpOnly: true,
      secure: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

module.exports = {
  register,
  sendOTP,
  verifyOTP,
  login,
  logout,
};

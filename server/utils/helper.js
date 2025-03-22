const { compareSync } = require("bcrypt");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const getNewOtp = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  return otp;
};

const compareHashedData = (data, hashedData) => {
  const isMatch = compareSync(data, hashedData);
  return isMatch;
};

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const sendToken = (res, userId, statusCode, message) => {
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET);

  return res.status(statusCode).cookie("vib-token", token, cookieOptions).json({
    success: true,
    message,
    userId,
  });
};

const getOtherMembers = (members, userId) => {
  const oth = members.filter(
    (member) => member.toString() !== userId.toString()
  );
  return oth;
};

module.exports = { getNewOtp, compareHashedData, sendToken, getOtherMembers };

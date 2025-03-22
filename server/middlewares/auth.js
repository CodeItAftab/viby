const { TryCatch, ErrorHandler } = require("../utils/error");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies["vib-token"];
  console.log(req.cookies);
  console.log(token);
  if (!token) {
    return new ErrorHandler(401, `You need to login to access this route`);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded._id).select("+fcm_token");
  req.user = user;
  next();
});

module.exports = { isAuthenticated };

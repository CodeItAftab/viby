const express = require("express");
const fileUpload = require("express-fileupload");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const chatRoutes = require("./chat");
const requestRoutes = require("./request");
const { errorMiddleware } = require("../middlewares/error");

const router = express.Router();

router.use("/auth", authRoutes);
router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
router.use("/user", userRoutes);
router.use("/chat", chatRoutes);
router.use("/request", requestRoutes);

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});

router.use(errorMiddleware);

module.exports = router;

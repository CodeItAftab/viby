const { Router } = require("express");

const { isAuthenticated } = require("../middlewares/auth");

const {
  sendMessage,
  getAllChats,
  getMessages,
  LinkPreview,
  readMessage,
  createGroup,
} = require("../controllers/chat");

const router = Router();

router.use(isAuthenticated);

router.get("/all/chats", getAllChats);

router.post("/send-message", sendMessage);

router.get("/messages/:chatId", getMessages);

router.get("/link-preview", LinkPreview);

router.post("/read/:chatId", readMessage);

router.post("/create-group", createGroup);

module.exports = router;

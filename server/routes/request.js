const { Router } = require("express");

const { isAuthenticated } = require("../middlewares/auth");
const {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  getAllRequests,
  getAllSentRequests,
  rejectFriendRequest,
} = require("../controllers/request");

const router = Router();

router.use(isAuthenticated);
router.post("/send", sendFriendRequest);
router.post("/cancel/:requestId", cancelFriendRequest);
router.post("/accept/:requestId", acceptFriendRequest);
router.post("/reject/:requestId", rejectFriendRequest);
router.get("/all/received", getAllRequests);
router.get("/all/sent", getAllSentRequests);

module.exports = router;

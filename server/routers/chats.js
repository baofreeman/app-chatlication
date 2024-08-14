const express = require("express");
const ChatController = require("../controllers/chatController");

const router = express.Router();

router.route("/create-chat").post(ChatController.createChat);
router.route("/:userId").get(ChatController.getAllUserChats);

module.exports = router;

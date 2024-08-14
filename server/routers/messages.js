const express = require("express");
const MessageController = require("../controllers/messageController");

const router = express.Router();

router.route("/create-message").post(MessageController.createMessage);
router.route("/:chatId").get(MessageController.getChatMessages);

module.exports = router;

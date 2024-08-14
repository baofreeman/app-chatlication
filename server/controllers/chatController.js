const ChatModel = require("../models/messages/Chat");

class ChatController {
  async createChat(req, res) {
    try {
      const { senderId, receiverId } = req.body;
      const newChat = new ChatModel({
        paricipants: [senderId, receiverId],
      });

      const chat = await newChat.save();
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllUserChats(req, res) {
    try {
      const chat = await ChatModel.find({
        paricipants: { $in: [req.params.userId] },
      }).sort({ lastModified: -1 });
      res.status(200).json(chat);
    } catch (error) {
      console.log("Error in get all user chat", error.message);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ChatController();

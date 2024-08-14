const ChatModel = require("../models/messages/Chat");
const MessageModel = require("../models/messages/Message");

class MessageController {
  async createMessage(req, res) {
    try {
      const { chatId } = req.body;
      const newMessage = new MessageModel(req.body);
      const message = await newMessage.save();
      const updateChat = await ChatModel.findByIdAndUpdate(chatId, {
        lastModified: Date.now(),
      });

      if (!updateChat) {
        return res.status(400).json({ message: "Invalid Chat Id" });
      }

      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getChatMessages(req, res) {
    const { chatId } = req.params;
    // const { limit, offset } = req.query;
    // const limitNumber = parserInt(limit, 10) || 20;
    // const offsetNumber = parseInt(offser, 10) || 0;
    try {
      const messages = await MessageModel.find({ chatId: chatId }).sort({
        createAt: -1,
      });
      // .limit(limitNumber)
      // .skip(offsetNumber);

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new MessageController();

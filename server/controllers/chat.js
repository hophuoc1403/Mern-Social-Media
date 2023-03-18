// export const

import Chat from "../models/Chat.js";
import RoomChat from "../models/RoomChat.js";

export const getFirstMessage = async (req, res) => {
  try {
    const rooms = await RoomChat.find({});
    let chatSend = [];
    await Promise.all(
      rooms.map(async (room, index) => {
        let chat = await Chat.find({ RoomChat: room })
          .populate("User", "RoomChat")
          .sort({ createdAt: -1 })
          .limit(1);

        if (chat[0]) {
          chatSend[index] = chat[0];
        }
        return chat;
      })
    );

    return res.status(200).json(chatSend);
  } catch (e) {
    return res.status(408).json({ message: e });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { members } = req.body;
    const messages = await Chat.find({ members }).populate("User", "RoomChat");
    return res.status(200).json(messages);
  } catch (e) {
    return res.status(408).json({ message: e });
  }
};

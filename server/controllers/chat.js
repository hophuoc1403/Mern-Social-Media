// export const

import Chat from "../models/Chat.js";
import RoomChat from "../models/RoomChat.js";

export const getFirstMessage = async (req, res) => {
  try {
    const rooms = await RoomChat.find({});
    const firstCommentEachRoom = await Promise.all(
      rooms.map(async (room) => {
        let chat = await Chat.find({ RoomChat: room })
          .populate("User", "RoomChat")
          .sort({ createdAt: -1 });
        return chat;
      })
    );

    return res.status(200).json(firstCommentEachRoom);
  } catch (e) {
    return res.status(408).json({ message: e });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { roomId } = req.body;
    const messages = await Chat.find({ roomId }).populate("User", "RoomChat");
    return res.status(200).json(messages);
  } catch (e) {
    return res.status(408).json({ message: e });
  }
};

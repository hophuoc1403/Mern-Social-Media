import mongoose, { Schema } from "mongoose";

const chatSchema = mongoose.Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "RoomChat",
        required: true
    },
    message: {
      type: String,
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Chat = new mongoose.model("Chat", chatSchema);

export default Chat;

import mongoose, { Schema } from "mongoose";

const roomChatSchema = mongoose.Schema(
  {
    members: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

const RoomChat = new mongoose.model("RoomChat", roomChatSchema);

export default RoomChat;

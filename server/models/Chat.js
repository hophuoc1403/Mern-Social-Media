import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    roomId: String,
    recieverId: String,
    SenderId: String,
    message: String,
  },
  { timeStamp: true }
);

const Chat = mongoose.model("chat", chatSchema);

export default Chat;

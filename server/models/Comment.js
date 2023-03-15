import mongoose, { Schema } from "mongoose";

const commentSchema = mongoose.Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentRoot: {
      type: String,
      default: null,
    },
  },
  { timeStamp: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

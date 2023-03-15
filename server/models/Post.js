import mongoose, { Schema } from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedContent: {
      type: String,
      default: null,
    },
    description: String,
    picturePath: String,
    comment: [],
    likes: {
      type: Map,
      of: Boolean,
    },
    userIdRoot: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdAtRoot: { type: Date, default: null },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;

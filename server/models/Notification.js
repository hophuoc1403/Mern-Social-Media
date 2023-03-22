import mongoose, {Schema} from "mongoose";

const notificationSchema = mongoose.Schema(
    {
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        senderId: {type: Schema.Types.ObjectId, ref: "User"},
        content: String,
        postId:
            {
                type: Schema.Types.ObjectId, ref: "Post"
            }
    },

    {timestamps: true}
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

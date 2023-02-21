import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    receiverId:String,
    senderId:String,
    content:String,
},{timestamps: true})

const Notification = mongoose.model('Notification',notificationSchema)

export default Notification
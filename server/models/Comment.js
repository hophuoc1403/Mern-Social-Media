import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    postId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required: true
    },
    message:{
        type:String,
        required:true
    },
    commentRoot:{
        type:String,
        default:null
    },
},{timeStamp:true})

const Comment = mongoose.model("Comment",commentSchema)

export default  Comment
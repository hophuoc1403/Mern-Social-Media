import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const postSchema = mongoose.Schema({
    userId: {
      type: String,
      required: true
    }, firstName: {
      type: String,
      required: true
    }, lastName: {
      type: String,
      required: true
    },
    location: {
      type: String,
    },
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean
    },
    comment:
      [{
        id: {
          type:String,
          default:uuidv4()
        },
        userId: String,
        content: String
      }],
    default: [],
  },
  {timestamps: true})

const Posts = mongoose.model("Post", postSchema)

export default Posts
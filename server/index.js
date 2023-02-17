import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors'
import dotenv from 'dotenv'
import multer  from "multer";
import morgan from "morgan"
import helmet from "helmet";
import  path from "path";
import {fileURLToPath} from "url"
import {register} from  "./controllers/auth.js"
import {createPosts, editPost} from "./controllers/posts.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import {verifyToken} from "./middleware/auth.js";

// configuration
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname((__filename))
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.urlencoded({extended:true,limit:"30mb"}))
app.use(cors())
// app.options("*", cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));
// //
// app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use("/assets",express.static(path.join(__dirname,'public/assets')))

// File storage

const storage = multer.diskStorage({
  destination:function (req,file,cb){
  cb(null,"public/assets")
  },
  filename:function (req,file,cb) {
    cb(null,file.originalname)
  }
})
const upload  = multer({storage,fileFilter(req, file, callback) {
  if(file.mimetype === "image/png" || file.mimetype=== "image/jpg" || file.mimetype=== "image/jpeg") {
    callback(null,true)
  }else {
    callback(null,false)
    return callback(new Error("file image please"))
  }
  }})


app.post("/auth/register",upload.single("picture"),register)
app.post("/posts",verifyToken,upload.single("picture"), createPosts)
app.patch("/posts/:id",verifyToken,upload.single("picture"),editPost)

// routes
app.use("/auth",authRoutes)
app.use("/users",userRoutes)
app.use("/posts",postRoutes)

// mongoose setup
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://0.0.0.0:27017/social-media',(err)=>{
  if(err) console.log(err)
 else console.log("connected")
})

app.listen(3001,()=> {
  console.log("listening....")
})

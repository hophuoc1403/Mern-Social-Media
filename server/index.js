import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import { createPosts, editPost } from "./controllers/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { changeAvatar } from "./controllers/users.js";
import { Server } from "socket.io";
import http from "http";
import Notification from "./models/Notification.js";
import Chat from "./models/Chat.js";

// configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // err in server we are calling
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// File storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage,
  fileFilter(req, file, callback) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
      return callback(new Error("file image please"));
    }
  },
});

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPosts);
app.patch("/posts/:id", verifyToken, upload.single("picture"), editPost);
app.patch("/users/avatar", verifyToken, upload.single("picture"), changeAvatar);

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// mongoose setup
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://0.0.0.0:27017/social-media", (err) => {
  if (err) console.log(err);
  else console.log("connected");
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  debugger;
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  // notifications
  console.log("socket connected");
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
    console.log({ username });
  });

  socket.on(
    "sendNotification",
    async ({ senderName, receiverName, type, senderId, receiverId }) => {
      const receiver = getUser(receiverName) ?? null;
      console.log({ receiver });
      receiver &&
        io.to(receiver.socketId).emit("getNotification", {
          senderName,
          type,
        });
      try {
        const newNoti = new Notification({
          senderId,
          receiverId,
          content: `${senderName} ${type} your post.`,
        });
        await newNoti.save();
      } catch (e) {
        console.log({ error: e });
      }
    }
  );

  // socket.on("disconnect", () => {
  //   removeUser(socket.id);
  // });

  // chat

  socket.on("createRoom", async ({ senderId, receiverId }) => {
    const isHaveRoom = await Chat.find({ senderId, receiverId });
    if (isHaveRoom) {
      socket.join(isHaveRoom.roomId);
    } else {
      const randomRoomId = (Math.random() + 1).toString(36).substring(2);
    }
  });

  socket.on("getMessage", ({ senderId, receiverId, message, room }) => {});
});

server.listen(3001, () => {
  console.log("listening....");
});

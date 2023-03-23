import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";
import fs from "fs";

// Create

export const createPosts = async (req, res) => {
    try {
        const {userId, description, picturePath} = req.body;

        const userInfor = await User.findById(userId);
        const newPost = new Post({
            userId,
            description,
            picturePath,
            likes: {},
            comments: [],
        });

        await newPost.save();
        const addedPost = {
            ...newPost._doc,
            firstName: userInfor.firstName,
            lastName: userInfor.lastName,
            location: userInfor.location,
            occupation: userInfor.occupation,
            userPicturePath: userInfor.picturePath,
        };
        res.status(201).json(addedPost);
    } catch (e) {
        console.log("errr");
        res.status(408).json({error: e.message});
    }
};

// Read
export const getFreePosts = async (req, res) => {
    try {
        const pageNumber = +req.query.page || 1;
        const limit = req.query.limit || 5;

        const pagination = await apiPagination(pageNumber, limit);

        let posts = await Post.find({})
            .skip(pagination.offset)
            .sort({createdAt: -1})
            .limit(limit)
            .exec();
        let comment = await Comment.find({}).exec();

        let postWithCommentAndUser = await Promise.all(
            posts.map(async (post) => {
                const userInfor = await User.findById(post.userId);

                let userIdRootInfor = {};
                if (post.userIdRoot) {
                    userIdRootInfor = await User.findById(post.userIdRoot);
                }

                const currentComment = comment.filter((cmt) => {
                    return cmt.postId === post.id;
                });

                let newPost = {
                    userRoot: userIdRootInfor,
                    ...post._doc,
                    firstName: userInfor.firstName,
                    lastName: userInfor.lastName,
                    location: userInfor.location,
                    occupation: userInfor.occupation,
                    userPicturePath: userInfor.picturePath,
                    comment: currentComment,
                };
                return newPost;
            })
        );

        res.status(200).json({posts: postWithCommentAndUser, pagination});
    } catch (e) {
        res.status(408).json({error: e.message});
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const pageNumber = +req.query.page || 1;
        const limit = req.query.limit || 5;
        const {userId} = req.params;
        const pagination = await apiPagination(pageNumber, limit, userId);
        const posts = await Post.find({userId: mongoose.Types.ObjectId(userId)})
            .sort({createdAt: -1})
            .skip(pagination.offset)
            .limit(limit)
            .exec();
        let comment = await Comment.find({}).exec();
        const userInfor = await User.findById(userId);
        let postWithComment = await Promise.all(
            posts.map(async (post) => {
                let userIdRootInfor = {};
                if (post.userIdRoot) {
                    userIdRootInfor = await User.findById(post.userIdRoot);
                }

                const currentComment = comment.filter((cmt) => {
                    if (cmt.postId === post.id) {
                    }
                    return cmt.postId === post.id;
                });

                let newPost = {
                    userRoot: userIdRootInfor,
                    ...post._doc,
                    firstName: userInfor.firstName,
                    lastName: userInfor.lastName,
                    location: userInfor.location,
                    occupation: userInfor.occupation,
                    userPicturePath: userInfor.picturePath,
                    comment: currentComment,
                };
                return newPost;
            })
        );
        res.status(200).json({posts: postWithComment, pagination});
    } catch (e) {
        res.status(408).json({error: e.message});
    }
};

export const getSpecificPost = async (req, res) => {
    try {
        const {userId} = req;
        const {id} = req.params;
        const post = await Post.findById(id);
        const userInfor = await User.findById(userId);

        let userRoot = post.userIdRoot
            ? await User.findById(post.userIdRoot)
            : null;

        return res.status(200).json({
            ...post._doc,
            userRoot,
            firstName: userInfor.firstName,
            lastName: userInfor.lastName,
            location: userInfor.location,
            occupation: userInfor.occupation,
            userPicturePath: userInfor.picturePath,
        });
    } catch (e) {
        res.status(408).json({error: e.message});
    }
};

// update

export const likePost = async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(id);
        let isLiked = false;
        for (let i of post.likes) {
            if (i[0] === userId) {
                isLiked = true;
            }
        }
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }
        await post.save();
        // const updatedPost = await  Post.findByIdAndUpdate(id,{likes:post.likes},{new:true})
        res.status(200).json(post);
    } catch (e) {
        res.status(408).json({error: e.message});
    }
};

export const getComment = async (req, res) => {
    try {
        const {id} = req.params;
        const comment = Comment.find({postId: id});
        res.status(200).json(comment);
    } catch (e) {
        res.status(408).json({error: e.message});
    }
};

export const addComment = async (req, res) => {
    try {
        const {id} = req.params;
        const {message} = req.body;
        let userId = req.userId;
        const commentAdded = new Comment({
            message,
            userId,
            postId: id,
            commentRoot: req.body.commentRoot ? req.body.commentRoot : null,
        });
        await commentAdded.save();
        res.status(200).json({message: "added success"});
    } catch (e) {
        res.status(408).json({error: e.message});
    }
};

export const editComment = async (req, res) => {
    try {
        const {id} = req.params;
        const {message} = req.body;
        const currentComment = await Comment.findByIdAndUpdate(
            id,
            {message},
            {returnDocument: "after"}
        );
        return res.json({message: "updated success", currentComment});
    } catch (e) {
        res.status(408).json({error: e.message});
    }
};

export const deletePost = async (req, res) => {
    try {
        const {id} = req.params;
        await Post.deleteOne({_id: id}, {returnDocument: "after"});
        const deletedPost = await  Post.find({_id:id})
        if(deletedPost.picturePath){
            fs.unlinkSync(`public/assets/${deletedPost.picturePath}`);
        }
        const posts = await Post.find({});
        return res.status(200).json(posts);
    } catch (e) {
        res.status(408).json({error: e.message});
    }
};

export const editPost = async (req, res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;
        let updateQuery = {}

        updateQuery.description = description
        if (req.body.pictureDelete) {
            updateQuery.picturePath = null
            fs.unlinkSync(`public/assets/${req.body.pictureDelete}`);
        } else if(req.body.picturePath){
            updateQuery.picturePath = req.body.picturePath
        }
        await Post.updateOne(
            {_id: id},
            {...updateQuery},
            {returnDocument: "after"}
        );

        const updatedPosts = await Post.findById(id);
        console.log(updatedPosts)
        return res.status(200).json(updatedPosts);
    } catch (e) {
        res.status(408).json({error: e.message});
    }
};

const apiPagination = async (pageNumber, limit, userId = "") => {
    let totalPost = 0;
    if (userId !== "") {
        totalPost = await Post.find({userId}).countDocuments().exec();
        console.log({totalPost});
    } else {
        totalPost = await Post.find({}).countDocuments().exec();
    }
    let startIndex = (pageNumber - 1) * limit;
    let endIndex = pageNumber * limit;
    let apiPagination = {
        totalPost,
        hasPrevPage: false,
        hasNextPage: false,
        currentPage: pageNumber,
        offset: startIndex,
    };
    if (startIndex > 0) {
        apiPagination.hasPrevPage = true;
    }
    if (endIndex < totalPost) {
        apiPagination.hasNextPage = true;
    }

    return apiPagination;
};

export const getNotifications = async (req, res) => {
    try {
        const {receiverId} = req.params;
        const noti = await Notification.find({receiverId});
        res.status(200).json(noti);
    } catch (e) {
        res.status(408).json({error: e.message});
    }
};

export const findPost = async (req, res) => {
    try {
        const {key} = req.query;
        console.log(key);
        const result = await Post.find({description: {$regex: `${key}`}});
        console.log(result);
        return res.status(200).json(result);
    } catch (e) {
        res.status(408).json({error: e.message});
    }
};

export const sharePost = async (req, res) => {
    try {
        const userId = req.userId;
        const {postId, sharedContent} = req.body;
        const userInfor = await User.findById(userId);

        const currentPost = await Post.findById(postId);
        const newSharedPost = new Post({
            userId: userId,
            userIdRoot: currentPost.userId,
            description: currentPost.description,
            picturePath: currentPost.picturePath,
            likes: {},
            comments: [],
            createdAtRoot: currentPost.createdAt,
            sharedContent,
        });
        await newSharedPost.save();
        const userRoot = await User.findById(currentPost.userId);

        return res.status(200).json({
            ...newSharedPost._doc,
            userRoot,
            firstName: userInfor.firstName,
            lastName: userInfor.lastName,
            location: userInfor.location,
            occupation: userInfor.occupation,
            userPicturePath: userInfor.picturePath,
        });
    } catch (e) {
        res.status(408).json({error: e.message});
    }
};

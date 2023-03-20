import User from "../models/User.js";
import * as fs from "fs";
import Post from "../models/Post.js";

// read
export const getUser = async (req, res) => {
    const id = req.params.id ?? req.userId;
    try {
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
};

// export const getUserFriends = async (req, res) => {

// };


export const getFriend = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );
        res.status(200).json(formattedFriends);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

// update

export const addRemoveFriend = async (req, res) => {
    try {
        const {id, friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((friendId) => friendId !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            }
        );
        res.status(200).json(formattedFriends);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
};

export const changeAvatar = async (req, res) => {
    try {
        const id = req.userId;
        const currentUser = await User.findById(id);
        const {picturePath} = req.body;
        // if (req.file.filename !== currentUser.picturePath) {
        //     fs.unlinkSync(`public/assets/${currentUser.picturePath}`);
        // }

        currentUser.picturePath = picturePath;
        await Post.updateMany({userId: id}, {userPicturePath: picturePath});
        await currentUser.save();
        return res.status(200).json(currentUser);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
};

export const editProfile = async (req, res) => {
    // name
    // occupation
    // location
    // first name
    // last name
    // email

    try {
        const {userId} = req;
        let editedProfile = {};
        const {lastName, firstName, location, email, occupation} = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {lastName, firstName, location, email, occupation},
            {returnDocument: "after"}
        );

        return res.status(200).json(updatedUser);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
};

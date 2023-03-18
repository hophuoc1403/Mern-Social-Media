import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "index";
import { addOrRemoveFriend, getFriends } from "../../service/user.service";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import { PersonRemoveOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import state, { setFriends } from "../../state";
import useChatStore from "hooks/stateChat.store";

const FriendListWidget = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id: userId, friends } = useAppSelector((state) => state.user);
  const { setIsOpenChat, setSenderInfor } = useChatStore((state) => state);

  const handleGetFriends = async () => {
    try {
      const res = await getFriends();
      const friendList: IUser[] = res.data;
      console.log({ friendList });
      dispatch(setFriends({ friends: friendList }));
    } catch (e) {
      console.log({ error: e });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log(token);

    if (token) {
      handleGetFriends();
    }
  }, []);

  const removeFriend = async (friendId: string) => {
    const id = toast.info("loading ....", {
      autoClose: false,
      className: "rotateY animated",
    });
    try {
      const res = await addOrRemoveFriend(userId, friendId);
      const friends = res.data;
      dispatch(setFriends({ friends }));
      setTimeout((_: any) => {
        toast.update(id, {
          render: "remove friend successfully",
          type: toast.TYPE.SUCCESS,
          className: "rotateY animated",
          autoClose: 4000,
        });
      }, 1000);
    } catch (e) {
      console.log({ error: e });
    }
  };

  return (
    <WidgetWrapper>
      {friends.length > 0 &&
        friends.map((friend) => (
          <FlexBetween
            onClick={() => {
              setIsOpenChat();
              setSenderInfor(friend._id);
            }}
            key={friend._id}
            sx={{ marginBottom: "10px" }}
          >
            <FlexBetween sx={{}}>
              <UserImage image={`${friend.picturePath}`} size={55} />
              <Typography sx={{ marginLeft: "10px" }}>
                {friend.firstName + " " + friend.lastName}
              </Typography>
            </FlexBetween>
            <IconButton
              sx={{ cursor: "pointer" }}
              onClick={() => removeFriend(friend._id)}
            >
              <PersonRemoveOutlined />
            </IconButton>
          </FlexBetween>
        ))}
    </WidgetWrapper>
  );
};

export default FriendListWidget;

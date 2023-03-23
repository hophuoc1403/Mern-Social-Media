import {
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  Popover,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addOrRemoveFriend,
  getFriends,
  getUser,
} from "../service/user.service";
import { setFriends, setPosts, setUSer } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import {
  DeleteOutlined,
  PersonAddOutlined,
  PersonRemoveOutlined,
  SyncLockRounded,
} from "@mui/icons-material";
import React, { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deletePost } from "../service/post.service";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import EditPostModal from "./EditPostModal";
import { useAppSelector } from "index";
import {useTrackedStore} from "../hooks";
import useProfileStore from "../hooks/stateProfile.store";

interface FriendPops {
  friendId: string;
  name: string;
  subtitle: string;
  userPicturePath: string;
  postId: string;
  description: string;
  postPicturePath: string;
  isSharePost?: boolean;
}

const Friend = ({
  postId,
  friendId,
  userPicturePath,
  subtitle,
  name,
  description,
  postPicturePath,
  isSharePost,
}: FriendPops) => {
  const [isEditPost, setIsEditPost] = useState<boolean>(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id: userId, friends } = useAppSelector((state) => state.user);
  const user = useAppSelector((state) => state.user);
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  // @ts-ignore
  const main = palette.neutral.main;
  // @ts-ignore
  const medium = palette.neutral.medium;
  const {setUserSelected} = useProfileStore()

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const socket = useTrackedStore().socket.socket();

  const open = Boolean(anchorEl);

  const isFriend = useMemo(() => {
    if (friendId === userId) {
      return false;
    }
    // @ts-ignore
    return friends.find((friend) => friend._id === friendId);
  }, [friends]);

  const patchFriend = async () => {
    try {
      const id = toast.info("loading ....", {
        autoClose: false,
        className: "rotateY animated",
      });
      const response = await addOrRemoveFriend(userId, friendId);
      const friends: IUser[] = response.data;
      // @ts-ignore
      const isFriend = friends.find((friend) => friend._id === friendId);
      isFriend && socket?.emit("createRoom", { members: [userId, friendId] });
      setTimeout((_: any): any => {
        toast.update(id, {
          render: isFriend
            ? "add friend successfully"
            : "remove friend successfully",
          type: toast.TYPE.SUCCESS,
          className: "rotateY animated",
          autoClose: 4000,
        });
      }, 1000);

      dispatch(setFriends({ friends }));
    } catch (e) {
      console.log({ error: e });
    }
  };

  const handleDeletePost = async () => {
   const check =  window.confirm("Do you want to delete your post ? ");
   if(check){

    const id = toast.info("loading ....", {
      autoClose: false,
      className: "rotateY animated",
    });
    try {
      const response = await deletePost(postId);
      // const posts:IPost[] = response.data
      dispatch(setPosts({ posts: response.data }));
      setTimeout((_: any) => {
        toast.update(id, {
          render: "remove post successfully",
          type: toast.TYPE.SUCCESS,
          className: "rotateY animated",
          autoClose: 4000,
        });
      }, 1000);
    } catch (e) {
      console.log(e);
      toast.update(id, {
        render: " post failed",
        type: toast.TYPE.ERROR,
        className: "rotateY animated",
        autoClose: 4000,
      });
    }
  };
   }

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"space-between"}
      width={"100%"}
    >
      <FlexBetween justifyContent={"space-between"}>
        <UserImage image={userPicturePath} size={55} />
        <Box
          ml={"1rem"}
          onClick={async () => {
            navigate(`/profile/${friendId}`);
          }}
          sx={{ cursor: "pointer" }}
        >
          <Typography
            color={main}
            variant={"h5"}
            fontWeight={500}
            sx={{
              "&:hover": { color: palette.primary.light },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize={"0.75rem"}>
            {moment(subtitle).fromNow()}
            <SyncLockRounded />
          </Typography>
        </Box>
      </FlexBetween>

      {isFriend ? (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          <PersonRemoveOutlined />{" "}
        </IconButton>
      ) : userId !== friendId ? (
        <IconButton
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          onClick={() => patchFriend()}
        >
          <PersonAddOutlined />
        </IconButton>
      ) : (
        !isSharePost && (
          <ButtonBase
            aria-describedby={"popover"}
            onClick={(e) => {
              handleClick(e);
            }}
          >
            <MoreVertIcon />
          </ButtonBase>
        )
      )}

      <Popover
        id={"popover"}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Button
          sx={{ padding: "0.75rem" }}
          onClick={async () => {
            await handleDeletePost();
          }}
        >
          <DeleteOutlined />
          <Typography color={"red"}>Delete</Typography>
        </Button>
        <Divider />
        <Button
          sx={{ padding: "0.75rem", width: "100%" }}
          onClick={async () => {
            setIsEditPost(true);
            setAnchorEl(null);
          }}
        >
          <ModeEditOutlineIcon />
          <Typography>Edit</Typography>
        </Button>
      </Popover>
      <EditPostModal
        id={postId}
        description={description}
        postPicturePath={postPicturePath}
        isEditPost={isEditPost}
        setIsEditPost={setIsEditPost}
      />
    </Box>
  );
};

export default Friend;

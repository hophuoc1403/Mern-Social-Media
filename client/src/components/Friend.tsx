import {
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  Popover,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addOrRemoveFriend } from "../service/user.service";
import { setFriends, setPosts } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import {
  DeleteOutlined,
  PersonAddOutlined,
  PersonRemoveOutlined,
} from "@mui/icons-material";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import EditPostModal from "./EditPostModal";
import { useAppSelector } from "index";
import { useTrackedStore } from "../hooks";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { deletePost } from "../service/post.service";

interface FriendPops {
  friendId: number;
  name: string;
  subtitle: string;
  userPicturePath: string;
  postId: number;
  description: string;
  postPicturePath: string;
  isSharePost?: boolean;
  status?: string | null;
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
  status,
}: FriendPops) => {
  const [isEditPost, setIsEditPost] = useState<boolean>(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId, friends } = useAppSelector((state) => state.user);
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  // @ts-ignore
  const main = palette.neutral.main;
  // @ts-ignore
  const medium = palette.neutral.medium;
  const posts = useAppSelector((state) => state.posts);

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
    return friends && friends.find((friend) => friend.id === friendId);
  }, [friends]);

  const patchFriend = async () => {
    try {
      const id = toast.info("loading ....", {
        autoClose: false,
        className: "rotateY animated",
      });
      const response = await addOrRemoveFriend(userId, friendId);
      const friends: IUser[] = response.data.friends;
      // @ts-ignore
      const isFriend = friends.find((friend) => friend.id === friendId);
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
    const check = window.confirm("Do you want to delete your post ? ");
    if (check) {
      const id = toast.info("loading ....", {
        autoClose: false,
        className: "rotateY animated",
      });
      try {
        // await deletePost(postId);
        dispatch(
          setPosts({ posts: posts.filter((item) => item.id !== postId) })
        );
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
          render: "Delete failed",
          type: toast.TYPE.ERROR,
          className: "rotateY animated",
          autoClose: 4000,
        });
      }
    }
  };

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
          <Stack flexDirection={"row"} gap={1}>
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
            <Typography variant={"body1"} fontWeight={500} color={medium}>
              {status}
            </Typography>
          </Stack>
          <Typography color={medium} fontSize={"0.75rem"}>
            <AccessAlarmIcon sx={{ mr: 0.5 }} />
            {moment(subtitle).fromNow()}
          </Typography>
        </Box>
      </FlexBetween>

      {isFriend ? (
        <IconButton
          onClick={() => patchFriend()}
          sx={{  p: "0.6rem" }}
        >
          <PersonRemoveOutlined />{" "}
        </IconButton>
      ) : userId !== friendId ? (
        <IconButton
          color={"primary"}
          sx={{  p: "0.6rem" }}
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

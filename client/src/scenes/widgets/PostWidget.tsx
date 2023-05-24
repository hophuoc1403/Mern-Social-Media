import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {  useMemo, useState } from "react";
import {  likePost, sharePost } from "../../service/post.service";
import { addNewestPost, setPost } from "../../state";
import WidgetWrapper from "../../components/WidgetWrapper";
import Friend from "../../components/Friend";
import FlexBetween from "../../components/FlexBetween";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "index";
import { motion } from "framer-motion";
import { style } from "components/EditPostModal";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useTrackedStore } from "../../hooks";
import Comment from "../../components/comment/Comment";

const PostWidget = ({
  createdAt,
  id,
  post,
  tags,
  user,
  userRoot,
  sharedContent,
  likes,
  commentCount,
}: IPost) => {
  const [isComment, setIsComment] = useState<boolean>(false);
  const userName = user.firstName + " " + user.lastName;
  const dispatch = useAppDispatch();
  const loggedInUserId: string = useAppSelector((state: any) => state.user.id);
  const socket = useTrackedStore().socket.socket();
  const { user: currentUser } = useAppSelector((state: any) => state);
  const [isShare, setIsShare] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [valueSharedContent, setValueSharedContent] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  const { palette } = useTheme();
  // @ts-ignore
  const main = palette.neutral.main;

  const isLiked = useMemo(() => {
    return likes.find((like) => {
      return like.user.id === +loggedInUserId;
    });
  }, [likes]);

  const patchLike = async (postId: number) => {
    try {
      const response = await likePost(postId);
      const post: IPost = response.data.post;
      console.log(post);
      dispatch(setPost({ postid: post.id, post }));
      // !isLiked &&
      //   socket!.emit("sendNotification", {
      //     senderName: currentUser.firstName + " " + currentUser.lastName,
      //     receiverName: userName,
      //     type: "liked",
      //     senderId: currentUser.id,
      //     receiverId: postUserId,
      //     postId,
      //   });
    } catch (e) {
      console.log(e);
      toast.error("Like post failed :<");
    }
  };

  const handleSharePost = async () => {
    try {
      setIsLoading(true);
      const res = await sharePost({
        postId: id,

        sharedContent: valueSharedContent,
      });

      dispatch(addNewestPost({ post: res.data.post }));
      await new Promise((_) => setTimeout(_, 1000));
      toast.success("Share post successfully <3");
      setIsLoading(true);
      setIsShare(false);
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect(() => {
  //   // refec
  // });

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <WidgetWrapper
        mt={"2rem"}
        sx={{
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;",
        }}
      >
        {userRoot && (
          <Box>
            <Friend
              postId={id}
              description={sharedContent ? sharedContent : ""}
              postPicturePath={post.picturePath}
              friendId={user.id}
              name={userName}
              subtitle={createdAt}
              userPicturePath={userRoot.picturePath}
            />
            <Typography
              color={main}
              sx={{ mt: "1rem", wordBreak: "break-word" }}
              onClick={() => {
                location.pathname.includes("home") && navigate(`/post/${id}`);
              }}
            >
              {sharedContent}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            padding: userRoot ? "15px 10px" : undefined,
            border: userRoot ? `2px solid ${palette.divider}` : "none",
            borderRadius: userRoot ? `10px` : "none",
            mt: userRoot ? `20px` : "none",
          }}
        >
          <Friend
            postId={post.id}
            description={post.description}
            postPicturePath={post.picturePath}
            friendId={userRoot ? userRoot.id : user.id}
            name={
              userRoot ? userRoot.firstName + " " + userRoot.lastName : userName
            }
            subtitle={createdAt}
            userPicturePath={userRoot ? userRoot.picturePath : user.picturePath}
            isSharePost={!!userRoot}
          />

          <Box
            onClick={() => {
              location.pathname.includes("home") &&
                navigate(`/post/${post.id}`);
            }}
          >
            <Typography
              color={main}
              sx={{ mt: "1rem", wordBreak: "break-word" }}
            >
              {post.description}
            </Typography>
            {post.picturePath && (
              <img
                width={"100%"}
                height={"500px"}
                alt={"post"}
                style={{
                  borderRadius: "0.75rem",
                  marginTop: "0.75rem",
                  objectFit: "cover",
                }}
                src={`http://localhost:3001/${post.picturePath}`}
              />
            )}
          </Box>
        </Box>

        {tags.length > 0 && (
          <Box sx={{ mt: "1rem" }}>
            {tags.map((item) => (
              <Chip label={"#" + item.name} sx={{ mr: ".5rem" }} />
            ))}
          </Box>
        )}

        <Box
          mt={"1rem"}
          display={"flex"}
          sx={{ justifyContent: "space-between" }}
        >
          <FlexBetween gap={"1rem"}>
            <FlexBetween gap={"0.3rem"}>
              <IconButton onClick={() => patchLike(id)}>
                {isLiked ? <FavoriteOutlined /> : <FavoriteBorderOutlined />}
              </IconButton>
              <Typography>{likes.length}</Typography>
            </FlexBetween>

            <FlexBetween gap={"0.3rem"}>
              <IconButton onClick={() => setIsComment(!isComment)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{commentCount}</Typography>
            </FlexBetween>
          </FlexBetween>

          {user.id !== +loggedInUserId && (
            <IconButton onClick={() => setIsShare(true)}>
              <ShareOutlined />
            </IconButton>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
        {isComment && <Comment postId={id} />}
      </WidgetWrapper>

      <Modal
        open={isShare}
        onClose={() => setIsShare(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography textAlign={"center"} my={3} variant={"h5"}>
            Write your thinking ...
          </Typography>
          <TextField
            value={valueSharedContent}
            onChange={(e) => setValueSharedContent(e.target.value)}
            fullWidth
            placeholder="what's on your mind ? ...."
          />

          <FlexBetween sx={{ marginInline: "3rem", marginTop: "1rem" }}>
            <LoadingButton
              loading={isLoading}
              onClick={() => handleSharePost()}
            >
              Save
            </LoadingButton>
            <Button color={"error"} onClick={() => setIsShare(false)}>
              Cancel
            </Button>
          </FlexBetween>
        </Box>
      </Modal>
    </motion.div>
  );
};

export default PostWidget;

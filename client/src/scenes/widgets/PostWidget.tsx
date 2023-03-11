import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { likePost, sharePost } from "../../service/post.service";
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
import Comment from "../../components/comment/Comment";
import InputReply from "../../components/comment/InputReply";
import useAppStore from "hooks/stateApp";
import { useAppDispatch, useAppSelector } from "index";
import { motion } from "framer-motion";
import { style } from "components/EditPostModal";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const PostWidget = ({
  _id: postId,
  lastName,
  firstName,
  picturePath,
  userPicturePath,
  userId: postUserId,
  likes,
  description,
  comment: postComment,
  createdAt,
  sharedContent,
  userIdRoot,
  userRoot,
  createdAtRoot,
}: IPost) => {
  const [isComment, setIsComment] = useState<boolean>(false);
  const userName = firstName + " " + lastName;
  const [comment, setComment] = useState<any>(postComment);
  const dispatch = useAppDispatch();
  const loggedInUserId: string = useAppSelector((state: any) => state.user._id);
  const { socket } = useAppStore();
  const { user: currentUser } = useAppSelector((state: any) => state);
  const [isShare, setIsShare] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [valueSharedContent, setValueSharedContent] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  console.log(userRoot);

  const isLiked = loggedInUserId
    ? Boolean(
        likes[loggedInUserId] !== undefined ? likes[loggedInUserId] : null
      )
    : false;
  const likeCount = Object.keys(likes).length;

  useEffect(() => {
    setComment(postComment);
  }, [postComment]);

  const { palette } = useTheme();
  // @ts-ignore
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    try {
      const response = await likePost(postId, loggedInUserId);
      const post: IPost = response.data;
      dispatch(setPost({ post_id: postId, post }));
      !isLiked &&
        socket!.emit("sendNotification", {
          senderName: currentUser.firstName + " " + currentUser.lastName,
          receiverName: userName,
          type: "liked",
          senderId: currentUser._id,
          receiverId: postUserId,
        });
    } catch (e) {
      console.log(e);
      toast.error("Like post failed :<");
    }
  };

  const handleSharePost = async () => {
    try {
      setIsLoading(true);
      const res = await sharePost({
        postId,
        sharedContent: valueSharedContent,
      });
      console.log(res.data);

      dispatch(addNewestPost({ post: res.data }));
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

  const commentLevel: any = useMemo(() => {
    return comment ? comment.filter((cmt: any) => cmt.commentRoot) : [];
  }, [comment]);

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
        {userIdRoot && (
          <Box>
            <Friend
              postId={postId}
              description={description}
              postPicturePath={picturePath}
              friendId={postUserId}
              name={userName}
              subtitle={createdAt}
              userPicturePath={
                userIdRoot ? userPicturePath : userRoot.picturePath
              }
            />
            <Typography
              color={main}
              sx={{ mt: "1rem", wordBreak: "break-word" }}
            >
              {sharedContent}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            padding: userIdRoot ? "15px 10px" : undefined,
            border: userIdRoot ? `2px solid ${palette.divider}` : "none",
            borderRadius: userIdRoot ? `10px` : "none",
            mt: userIdRoot ? `20px` : "none",
          }}
        >
          <Friend
            postId={postId}
            description={description}
            postPicturePath={picturePath}
            friendId={userIdRoot ? userIdRoot : postUserId}
            name={
              userIdRoot
                ? userRoot.firstName + " " + userRoot.lastName
                : userName
            }
            subtitle={createdAtRoot ? createdAtRoot : createdAt}
            userPicturePath={
              userIdRoot ? userRoot.picturePath : userPicturePath
            }
            isSharePost={!!userIdRoot}
          />

          <Box
            onClick={() => {
              location.pathname.includes("home") && navigate(`/post/${postId}`);
            }}
          >
            <Typography
              color={main}
              sx={{ mt: "1rem", wordBreak: "break-word" }}
            >
              {description}
            </Typography>
            {picturePath && (
              <img
                width={"100%"}
                height={"500px"}
                alt={"post"}
                style={{
                  borderRadius: "0.75rem",
                  marginTop: "0.75rem",
                  objectFit: "cover",
                }}
                src={`http://localhost:3001/assets/${picturePath}`}
              />
            )}
          </Box>
        </Box>

        <Box
          mt={"1rem"}
          display={"flex"}
          sx={{ justifyContent: "space-between" }}
        >
          <FlexBetween gap={"1rem"}>
            <FlexBetween gap={"0.3rem"}>
              <IconButton onClick={patchLike}>
                {isLiked ? <FavoriteOutlined /> : <FavoriteBorderOutlined />}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>

            <FlexBetween gap={"0.3rem"}>
              <IconButton onClick={() => setIsComment(!isComment)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comment ? comment.length : 0}</Typography>
            </FlexBetween>
          </FlexBetween>

          {postUserId !== loggedInUserId && (
            <IconButton onClick={() => setIsShare(true)}>
              <ShareOutlined />
            </IconButton>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />

        {isComment && (
          <>
            <InputReply setComments={setComment} postId={postId} />
            {comment &&
              comment.map((comment: any, index: number) => {
                if (!comment.commentRoot) {
                  return (
                    <Comment
                      setComments={setComment}
                      commentLevel={commentLevel}
                      key={index}
                      comment={comment}
                    />
                  );
                }
              })}
          </>
        )}
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

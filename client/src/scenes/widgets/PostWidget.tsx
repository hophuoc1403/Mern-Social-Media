import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Modal,
  TextField, Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {useMemo, useState} from "react";
import {likePost, savePost, sharePost} from "../../service/post.service";
import {addNewestPost, setPost} from "../../state";
import WidgetWrapper from "../../components/WidgetWrapper";
import Friend from "../../components/Friend";
import FlexBetween from "../../components/FlexBetween";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "index";
import {motion} from "framer-motion";
import {style} from "components/EditPostModal";
import {LoadingButton} from "@mui/lab";
import {toast} from "react-toastify";
import {useLocation, useNavigate} from "react-router-dom";
import Comment from "../../components/comment/Comment";
import {Markup} from "interweave";
import {useTrackedStore} from "hooks";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ReportPost from "../../components/posts/ReportPost";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import parse from 'html-react-parser';


interface PostWidgetProps extends IPost {
  isDetail?: boolean
}

const PostWidget = (
  {
    createdAt,
    id,
    post,
    tags,
    user,
    userRoot,
    sharedContent,
    likes,
    commentCount,
    isDetail
  }: PostWidgetProps) => {
  const [isComment, setIsComment] = useState<boolean>(false);
  const userName = user.firstName + " " + user.lastName;
  const dispatch = useAppDispatch();
  const loggedInUserId: string = useAppSelector((state: any) => state.user.id);
  const [isShare, setIsShare] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [valueSharedContent, setValueSharedContent] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useTrackedStore().socket.socket();
  const {user: currentUser} = useAppSelector((state) => state);
  const [isOpenReport, setIsOpenReport] = useState(false)
  const [isSavedPost, setIsSavedPost] = useState(false)

  const contentParseHtml = parse(post.description ?? '');


  const {palette} = useTheme();
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
      dispatch(setPost({postid: post.id, post}));
      !isLiked &&
      socket!.emit("sendNotification", {
        senderName: currentUser.firstName + " " + currentUser.lastName,
        receiverName: userName,
        type: "like",
        senderId: currentUser.id,
        postId: id,
        receiverId: user.id,
      });
    } catch (e) {
      console.log(e);
      toast.error("Like post failed :<");
    }
  };

  const handleSavePost = async () => {
    try {
      savePost({userId: currentUser.id, postId: id})
      toast.success("Save post success ");
      setIsSavedPost(true)
    } catch (e) {
    }

  }

  const handleSharePost = async () => {
    try {
      setIsLoading(true);
      const res = await sharePost({
        postId: post.id,
        sharedContent: valueSharedContent,
        userRoot: +user.id,
      });

      dispatch(addNewestPost({post: res.data.post}));
      await new Promise((_) => setTimeout(_, 1000));
      toast.success("Share post successfully <3");
      setIsLoading(false);
      setIsShare(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{once: true}}
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
              postId={post.id}
              description={sharedContent ? sharedContent : ""}
              postPicturePath={post.picturePath}
              friendId={user.id}
              name={userName}
              subtitle={createdAt}
              userPicturePath={user.picturePath ?? ""}
            />
            <Typography
              color={main}
              sx={{mt: "1rem", wordBreak: "break-word"}}
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
            status={user.status}
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
            sx={{cursor: "pointer"}}
            onClick={() => {
              !location.pathname.includes("post/") && navigate(`/post/${id}`);
            }}
          >
            <Typography
              color={main}
              sx={{
                mt: "1rem",
                wordBreak: "break-word",
                WebkitLineClamp: 2,
                display: "-webkit-box",
                textOverflow: "ellipsis",
                overflow: "clip",
                maxHeight: isDetail ? "max-content" : "60px",
              }}
            >
              <Markup content={post.description}/>
            </Typography>
            {post.picturePath && (
              <img
                width={"100%"}
                alt={"post"}
                style={{
                  borderRadius: "0.75rem",
                  marginTop: "0.75rem",
                  objectFit: "cover",
                  maxHeight: "500px"
                }}
                src={`http://localhost:3001/${post.picturePath}`}
              />
            )}
          </Box>
        </Box>

        {tags.length > 0 && (
          <Box sx={{mt: "1rem"}}>
            {tags.map((item) => (
              <Chip label={"#" + item.name} sx={{mr: ".5rem"}}/>
            ))}
          </Box>
        )}

        <Box
          mt={"1rem"}
          display={"flex"}
          sx={{justifyContent: "space-between"}}
        >
          <FlexBetween gap={"1rem"}>
            <FlexBetween gap={"0.3rem"}>
              <IconButton onClick={() => patchLike(id)}>
                {isLiked ? <FavoriteOutlined/> : <FavoriteBorderOutlined/>}
              </IconButton>
              <Typography>{likes.length}</Typography>
            </FlexBetween>

            <FlexBetween gap={"0.3rem"}>
              <IconButton onClick={() => setIsComment(!isComment)}>
                <ChatBubbleOutlineOutlined/>
              </IconButton>
              <Typography>{commentCount}</Typography>
            </FlexBetween>
          </FlexBetween>

          {user.id !== +loggedInUserId && (
            <Box>
              <IconButton onClick={() => setIsShare(true)}>
                <ShareOutlined/>
              </IconButton>
              <Tooltip title={"report this post"}>
                <IconButton color={"warning"} onClick={() => {
                  setIsOpenReport(true)
                }}>
                  <ReportProblemIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title={"Save this post"}>
                <IconButton color={isSavedPost ? "info" : "default"} onClick={() => {
                  handleSavePost()
                }}>
                  <BookmarkAddIcon/>
                </IconButton>
              </Tooltip>
            </Box>

          )}
        </Box>
        <Divider sx={{my: 2}}/>
        {isComment && <Comment postId={id}/>}
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
            autoFocus
          />

          <FlexBetween sx={{marginInline: "3rem", marginTop: "1rem"}}>
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

      <ReportPost handleClose={() => setIsOpenReport(false)} postId={id} isOpen={isOpenReport}/>
    </motion.div>
  );
};

export default PostWidget;

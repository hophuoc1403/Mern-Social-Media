import {Box, Divider, IconButton, Typography, useTheme} from "@mui/material";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useAppSelector} from "../../App";
import {useState} from "react";
import {deletePost, likePost} from "../../service/post.service";
import {setPost} from "../../state";
import WidgetWrapper from "../../components/WidgetWrapper";
import Friend from "../../components/Friend";
import FlexBetween from "../../components/FlexBetween";
import {ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined} from "@mui/icons-material";

const PostWidget = ({
                      _id: postId,
                      lastName,
                      name,
                      firstName,
                      location,
                      picturePath,
                      userPicturePath,
                      userId: postUserId,
                      likes,
                      description,
                      comment,
  createdAt
                    }: IPost) => {

  const [isComment, setIsComment] = useState<boolean>(false)
  const userName = firstName + lastName

  const dispatch = useDispatch()
  const loggedInUserId: string = useAppSelector(state => state.user._id)
  const isLiked = Boolean(likes[loggedInUserId])
if(likes.loggedInUserId == true){
  console.log("true")
}
  const likeCount = Object.keys(likes).length

  const {palette} = useTheme()
  // @ts-ignore
  const main = palette.neutral.main
  const primary = palette.primary.main

  const patchLike = async () => {
    try {
      const response = await likePost(postId, loggedInUserId)
      const post: IPost = response.data
      dispatch(setPost({post_id: postId, post}))
    } catch (e) {
      console.log(e)
    }
  }



  // @ts-ignore
  return <WidgetWrapper mt={"2rem"}>
    <Friend postId={postId} description={description}  postPicturePath={picturePath} friendId={postUserId} name={userName} subtitle={createdAt} userPicturePath={userPicturePath}/>
    <Typography color={main} sx={{mt: "1rem"}}>
      {description}
    </Typography>
    {picturePath && (
      <img width={"100%"} height={"500px"} alt={"post"} style={{borderRadius: "0.75rem", marginTop: "0.75rem",objectFit:"cover"}}
           src={`http://localhost:3001/assets/${picturePath}`}
      />
    )}
    <Box mt={"1rem"} display={"flex"} sx={{justifyContent:"space-between"}}>
      <FlexBetween gap={"1rem"}>
        <FlexBetween gap={"0.3rem"}>
          <IconButton onClick={patchLike}>
            {isLiked ? <FavoriteOutlined/>
              : <FavoriteBorderOutlined/>
            }
          </IconButton>
          <Typography>
            {likeCount}
          </Typography>
        </FlexBetween>

        <FlexBetween gap={"0.3rem"}>
          <IconButton onClick={() => setIsComment(!isComment)}>
            <ChatBubbleOutlineOutlined/>
          </IconButton>
          <Typography>
            {comment.length}
          </Typography>
        </FlexBetween>

      </FlexBetween>

      <IconButton>
        <ShareOutlined />
      </IconButton>

    </Box>
    {isComment && (
      <Box mt={"0.5rem"}>
        {comment.map((comment,index) => (
          <Box key={name+index}>
            <Divider />
            <Typography sx={{color:main,m:"0.5rem 0",pl:"1rem"}}>
              {comment}
            </Typography>
            <Divider />

          </Box>
        ))}
      </Box>
    ) }
  </WidgetWrapper>
}

export default PostWidget
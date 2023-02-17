import {Box, Button, Divider, Paper, Typography, useTheme} from "@mui/material";
import {useEffect, useState} from "react";
import {getUser} from "../../service/user.service";
import UserImage from "../UserImage";
import InputReply from "./InputReply";

interface IComment {
  comment: any,
  commentLevel?: any

  setComments?: any
}

const Comment = ({comment, commentLevel, setComments}: IComment) => {
  const [user, setUser] = useState<IUser>({
    _id: "",
    firstName: "",
    friends: [],
    impressions: "",
    lastName: "",
    location: "",
    occupation: "",
    picturePath: "",
    updatedAt: "",
    viewedProfile: 0
  })
  const [isReply, setIsReply] = useState<boolean>(false)
  const [userReply, setUserReply] = useState<string>(user._id)
  const [commentLevels, setCommentLevels] = useState<any>(() => {
    const cmt =commentLevel && commentLevel.filter((cmt: any) => cmt.commentRoot === comment._id)
    return cmt ? cmt : []
  })


  const {palette} = useTheme()

  useEffect(() => {
    const getUserReply = async () => {
      const response = await getUser(comment.userId)
      setUser(response.data)
    }
    getUserReply()
  }, [])



  return (<Box mt={"0.5rem"}>

    <Box key={comment._id} pl={!commentLevel ? "50px" : undefined} my={2}>
      <Box display={"flex"} justifyContent={"left"}>
        <UserImage image={user.picturePath} size={50}/>
        <Paper sx={{borderTopLeftRadius: "50px", px: "20px"}}>
          <Typography color={"grey"} variant={"h6"}
                      sx={{m: "0.1rem 0", pl: "1rem", "&:hover": {color: palette.text.primary}}}>
            {user.lastName + " " + user.firstName}
          </Typography>
          <Typography sx={{m: "0.1rem 0", pl: "1rem"}}>
            {comment.message}
          </Typography>
          {commentLevel && <Box display={"flex"} justifyContent={"left"} alignItems={"center"}>
              <Button sx={{fontSize: "0.7rem"}}>
                  Like
              </Button>
              <Button sx={{fontSize: "0.7rem"}} onClick={() => {
                setIsReply(!isReply)
                setUserReply(user._id)
              }
              }>
                  Reply
              </Button>
          </Box>}
        </Paper>
      </Box>
      {isReply && <>
          <InputReply setCommentLevel={setCommentLevels} commentRoot={comment._id} userReplyId={userReply}
                      userReply={user} postId={comment.postId}/>
        {commentLevels.map((cmt: any) => {
          return <Comment key={cmt._id} comment={cmt}/>

        })}
      </>}
    </Box>
    <Divider/>
  </Box>)
}
export default Comment
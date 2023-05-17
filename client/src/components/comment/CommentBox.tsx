import {Avatar, Box, Divider, Typography} from "@mui/material";
import FlexBetween from "../FlexBetween";
import UserImage from "../UserImage";
import React, {Dispatch, SetStateAction, useState} from "react";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import InputReply from "./InputReply";

interface CommentBoxProps {
  comment: IComment
  setComment:Dispatch<SetStateAction<{items:IComment[],meta:PaginationOptions} | null>>
  postId:number
}

const CommentBox = ({comment,setComment,postId}: CommentBoxProps) => {

  const navigate = useNavigate()
  const [isOpenModalReply,setIsOpenModalReply] = useState(false)

  return <Box my={3}>
    <FlexBetween mb={2}>
      <FlexBetween onClick={() => navigate('/') } justifyContent={"flex-start"}  sx={{justifyContent:"flex-start !important",gap:"10px"}}>
        <UserImage  image={comment.user.picturePath} size={45}/>
        <Box>
          <Typography  variant={"h5"}>{comment.user.lastName + comment.user.firstName}</Typography>
          <Typography variant={"caption"}>{moment(comment.createdAt).fromNow()}</Typography>
        </Box>
      </FlexBetween>
      <Typography sx={{textDecoration:"underline",color:"#0094ff",cursor:"pointer",fontSize:"13px"}} onClick={() => setIsOpenModalReply(!isOpenModalReply) }>Reply</Typography>
    </FlexBetween>
    <Box>
      <Typography variant={"h5"}>{comment.content}</Typography>
    </Box>
    {isOpenModalReply && <>
        <InputReply setComment={setComment} postId={postId} replyFor={comment}/>
    </>}
    <Divider sx={{my:2}} />
  </Box>
}

export default CommentBox
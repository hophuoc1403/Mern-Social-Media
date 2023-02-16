import {Box, TextField} from "@mui/material";
import {useAppSelector} from "../../App";
import UserImage from "../UserImage";
import FlexBetween from "../FlexBetween";
import {addComment} from "../../service/post.service";

interface IInputReply {
  userReply?: IUser,
  postId: string,
  commentRoot?: string
  userReplyId?: string
}

const InputReply = ({userReply, postId, userReplyId, commentRoot}: IInputReply) => {

  const {user} = useAppSelector(state => state)

  const handleSendComment = async (e: any) => {
    let dataSend: any = {
      postId,
      message: e.target.value,
    }

    if (commentRoot) {
      dataSend.commentRoot = commentRoot
    }

    e.target.value = ""

    const response = await addComment(dataSend)
    console.log(response)
  }

  return <>
    {userReplyId === userReply?._id &&
        <FlexBetween sx={{marginTop: "10px", marginLeft: userReply ? "50px" : undefined}} alignItems={"flex-start"}>
            <UserImage image={user.picturePath} size={50}/>
            <TextField autoFocus sx={{width: "92%", height: "1em !important", marginTop: "-25px", marginLeft: "10px"}}
                       id="outlined-basic" label={userReply ? `reply to ${userReply.firstName}` : "comment"}
                       variant="outlined" onKeyDown={e => {
              if (e.key === "Enter") {
                handleSendComment(e)
              }
            }}/>
        </FlexBetween>}
  </>
}

export default InputReply
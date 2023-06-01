import { Avatar, Box, CircularProgress, TextField } from "@mui/material";
import FlexBetween from "../FlexBetween";
import { Dispatch, SetStateAction, useState } from "react";
import { addComment } from "../../service/post.service";
import { useAppSelector } from "../../index";
import SendIcon from "@mui/icons-material/Send";
import {useTrackedStore} from "../../hooks";

interface InputReplyProps {
  replyFor?: IComment;
  setComment: Dispatch<
    SetStateAction<{ items: IComment[]; meta: PaginationOptions } | null>
  >;
  postId: number;
}

const InputReply = ({ replyFor, postId, setComment }: InputReplyProps) => {
  const user = useAppSelector((state) => state.user);
  const socket = useTrackedStore().socket.socket();

  const [replyVal, setReplyVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendComment = async () => {
    try {
      setIsLoading(true);
      const response = await addComment({
        postId,
        message: replyVal,
        commentRoot: replyFor ? replyFor.id : undefined,
      });
      socket!.emit("sendNotification", {
        senderName: user.firstName + " " + user.lastName,
        receiverName: replyFor?.user.lastName,
        type: "comment",
        senderId: user.id,
        postId,
        receiverId: user.id,
      });
      setComment((state) => ({
        meta: { ...state!.meta, totalItems: state!.meta.totalItems + 1 },
        items: [response.data.comment, ...state!.items],
      }));
      setReplyVal("");
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box my={2}>
      <FlexBetween gap={1}>
        <Avatar alt="Remy Sharp" src={user.picturePath} />
        <TextField
          style={{ flexGrow: 1 }}
          value={replyVal}
          onChange={(e) => setReplyVal(e.target.value)}
          label={
            replyFor
              ? `Reply for @${replyFor.user.lastName + replyFor.user.firstName}`
              : "comment ..."
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              return handleSendComment();
            }
          }}
          InputProps={{
            endAdornment: isLoading ? <CircularProgress /> : <SendIcon />,
          }}
        />
      </FlexBetween>
    </Box>
  );
};

export default InputReply;

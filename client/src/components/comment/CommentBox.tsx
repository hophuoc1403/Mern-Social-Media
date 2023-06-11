import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FlexBetween from "../FlexBetween";
import UserImage from "../UserImage";
import React, { Dispatch, SetStateAction, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import InputReply from "./InputReply";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAppSelector } from "index";
import { DeleteOutline, EditOffOutlined } from "@mui/icons-material";

interface CommentBoxProps {
  comment: IComment;
  setComment: Dispatch<
    SetStateAction<{ items: IComment[]; meta: PaginationOptions } | null>
  >;
  postId: number;
  isSubComment?:boolean
}

const CommentBox = ({ comment, setComment, postId,isSubComment }: CommentBoxProps) => {
  const navigate = useNavigate();
  const [isOpenModalReply, setIsOpenModalReply] = useState(false);
  const { user } = useAppSelector((state) => state);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [subComment,setSubComment] = useState<{ items: IComment[]; meta: PaginationOptions } | null>({items:[],meta:{  totalItems: 0,
      itemCount: 0,
      itemsPerPage: 0,
      totalPages: 0,
      currentPage: 0,}})

  const handleEditComment = async (val: any) => {
    setComment((state) => ({
      meta: state!.meta,
      items: state!.items.map((cmt) => {
        if (cmt.id === comment.id) {
          return { ...cmt, content: val };
        }
        return cmt;
      }),
    }));
  };

  return (
    <Box my={3} mx={isSubComment ? 5 : 0}>
      <FlexBetween mb={2}>
        <FlexBetween
          onClick={() => navigate("/")}
          justifyContent={"flex-start"}
          sx={{ justifyContent: "flex-start !important", gap: "10px" }}
        >
          <UserImage image={comment.user.picturePath} size={45} />
          <Box>
            <Typography variant={"h5"}>
              {comment.user.firstName + " " + comment.user.lastName}
            </Typography>
            <Typography variant={"caption"}>
              {moment(comment.createdAt).fromNow()}
            </Typography>
          </Box>
        </FlexBetween>
        <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
          <Typography
            sx={{
              textDecoration: "underline",
              color: "#0094ff",
              cursor: "pointer",
              fontSize: "13px",
            }}
            onClick={() => setIsOpenModalReply(!isOpenModalReply)}
          >
            Reply
          </Typography>
          {user.id === comment.user.id && (
            <IconButton onClick={(e: any) => setAnchorEl(e.target)}>
              <MoreVertIcon />
            </IconButton>
          )}
        </Stack>
      </FlexBetween>
      <Box>
        {!isOpenEdit ? (
          <Typography variant={"h5"}>{comment.content}</Typography>
        ) : (
          <TextField
            fullWidth
            size="small"
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                handleEditComment(e.target.value);
                setIsOpenEdit(false);
              }
            }}
            defaultValue={comment.content}
          />
        )}
      </Box>
      {isOpenModalReply && (
        <>
          <InputReply
            setComment={setSubComment}
            postId={postId}
            replyFor={comment}
          />
        </>
      )}
      <Divider sx={{ my: 2 }} />

      {subComment && subComment.items.length > 0 && subComment.items.map(subCmt => (<CommentBox comment={subCmt} setComment={setSubComment} postId={comment.id} isSubComment={true} />))}

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Button
          fullWidth
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            paddingRight: "50px",
          }}
          onClick={() => {
            setAnchorEl(null);
            setIsOpenEdit(true);
          }}
        >
          <EditOffOutlined /> Edit
        </Button>
        <Button
          fullWidth
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            paddingRight: "50px",
          }}
          onClick={() => {
            setComment((state) => ({
              meta: state!.meta,
              items: state!.items.filter((cmt) => cmt.id !== comment.id),
            }));
            setAnchorEl(null);
          }}
          color="error"
        >
          <DeleteOutline /> Delete
        </Button>
      </Popover>
    </Box>
  );
};

export default CommentBox;

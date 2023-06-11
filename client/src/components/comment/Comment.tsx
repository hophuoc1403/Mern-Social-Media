import { Box, Pagination } from "@mui/material";
import CommentBox from "./CommentBox";
import { useEffect, useState } from "react";
import { getComment } from "../../service/post.service";
import InputReply from "./InputReply";

interface CommentProps {
  postId: number;
}

const Comment = ({ postId }: CommentProps) => {
  const [comments, setComments] = useState<{
    items: IComment[];
    meta: PaginationOptions;
  } | null>(null);

  const handleGetComment = async (page: number) => {
    const data = await getComment(postId, page);
    setComments({...data,items:data.items});
  };
  useEffect(() => {
    handleGetComment(1);
  }, []);

  return (
    <Box>
      {comments?.items && (
        <>
          <InputReply setComment={setComments} postId={postId} />
          {comments.items.map((cmt) => (
            <CommentBox
              setComment={setComments}
              comment={cmt}
              postId={postId}
            />
          ))}
        </>
      )}
      {comments?.meta && (
        <Box display={"flex"} justifyContent={"center"}>
          <Pagination
            defaultPage={1}
            count={comments.meta.totalPages}
            onChange={(e, page) => handleGetComment(page)}
          />
        </Box>
      )}
    </Box>
  );
};

export default Comment;

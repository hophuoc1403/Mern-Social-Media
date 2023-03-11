import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSpecificPost } from "../../service/post.service";
import PostWidget from "../widgets/PostWidget";
import Navbar from "../navbar";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState<IPost | null>(null);
  useEffect(() => {
    const handleGetPost = async () => {
      const postResponse = await getSpecificPost(id as string);
      setPost(postResponse);
    };
    handleGetPost();
  }, [id]);

  return (
    <Box>
      <Navbar />
      <Box width={"100%"} display={"flex"} justifyContent={"center"} px={"6%"}>
        <Box flexBasis={"80%"}>
          {post && <PostWidget key={post._id} {...post} />}
        </Box>
      </Box>
    </Box>
  );
};

export default PostDetails;

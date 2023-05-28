import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSpecificPost } from "../../service/post.service";
import PostWidget from "../widgets/PostWidget";
import Navbar from "../navbar";
import { useAppSelector } from "index";

const PostDetails = () => {
  const { id } = useParams();
  const posts = useAppSelector((state) => state.posts);
  // const [post, setPost] = useState<IPost | null>(null);
  // useEffect(() => {
  //   const handleGetPost = async () => {
  //     const postResponse = await getSpecificPost(+id!);
  //     setPost(postResponse.post);
  //   };
  //   handleGetPost();
  // }, [id]);

  return (
    <Box>
      <Navbar />
      <Box width={"100%"} display={"flex"} justifyContent={"center"} px={"6%"}>
        <Box flexBasis={"80%"}>
          {posts.map((post) => {
            if (post.id === (+id! as number)) {
              return <PostWidget key={post.id} {...post} />;
            }
            return <></>;
          })}
          {/* {post && <PostWidget key={post.id} {...post} />} */}
        </Box>
      </Box>
    </Box>
  );
};

export default PostDetails;

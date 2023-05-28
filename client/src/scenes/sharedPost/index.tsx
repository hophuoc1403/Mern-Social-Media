import { Box, Typography, Autocomplete, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "index";
import MainLayout from "layouts/MainLayout";
import { useEffect, useState } from "react";
import PostWidget from "scenes/widgets/PostWidget";
import { getPostByTags, getSharedPost, getTags } from "service/post.service";
import { setPosts } from "state";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const SharedPost = () => {
  const posts = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleGetSharedPost = async () => {
      setIsLoading(true);
      const getPostRes = await getSharedPost();
      const posts = getPostRes.data.posts;
      dispatch(setPosts({ posts }));
      setIsLoading(false);
    };

    handleGetSharedPost();
  }, []);

  return (
    <MainLayout>
      <Typography variant="h3">Shared Post</Typography>
      {isLoading ? (
        <>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
            onClick={() => setIsLoading(false)}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      ) : (
        <>
          {posts.length > 0 ? (
            posts.map((post: IPost) => <PostWidget key={post.id} {...post} />)
          ) : (
            <Typography textAlign={"center"} mt={3} variant={"h3"}>
              No data found{" "}
            </Typography>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default SharedPost;

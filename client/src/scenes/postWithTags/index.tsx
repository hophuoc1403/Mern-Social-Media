import { Box, Typography, Autocomplete, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "index";
import MainLayout from "layouts/MainLayout";
import { useEffect, useState } from "react";
import PostWidget from "scenes/widgets/PostWidget";
import { getPostByTags, getTags } from "service/post.service";
import { setPosts } from "state";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const PostWithTags = () => {
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleGetTags = async () => {
      try{
        setIsLoading(true);
        const response = await getTags();
        setTags(response.data);
        setSelectedTags(response.data[0].id);

        const getPostWithTagRes = await getPostByTags(response.data[0].id);
        const posts = getPostWithTagRes.data.posts;
        dispatch(setPosts({ posts }));
      }catch (e) {

      }finally {
        setIsLoading(false);
      }
    };

    handleGetTags();
  }, []);

  useEffect(() => {
    const getPost = async () => {
      try{
        setIsLoading(true);
        if (selectedTags) {
          const getPostWithTagRes = await getPostByTags(selectedTags);
          const posts = getPostWithTagRes.data.posts;
          dispatch(setPosts({ posts }));
          setIsLoading(false);
        }
      }catch (e) {

      }finally {
        setIsLoading(false);
      }
    };

    getPost();
  }, [selectedTags]);

  return (
    <MainLayout>
      <Typography variant="h3">Get posts by tags</Typography>
      <Box mt={2} mb={5}>
        {tags.length > 0 && (
          <Autocomplete
            id="tags-standard"
            options={tags}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="filled"
                label="Select Tags"
                placeholder="Tags"
              />
            )}
            defaultValue={tags[0]}
            onChange={(e, val) => setSelectedTags(val?.id ?? null)}
          />
        )}
      </Box>
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

export default PostWithTags;

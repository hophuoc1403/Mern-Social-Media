import { Box, Typography, Autocomplete, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "index";
import MainLayout from "layouts/MainLayout";
import { useEffect, useState } from "react";
import PostWidget from "scenes/widgets/PostWidget";
import { getPostByTags, getTags } from "service/post.service";
import { setPosts } from "state";

const PostWithTags = () => {
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts);

  useEffect(() => {
    const handleGetTags = async () => {
      const response = await getTags();
      setTags(response.data);
      setSelectedTags(response.data[0].id);

      const getPostWithTagRes = await getPostByTags(response.data[0].id);
      const posts = getPostWithTagRes.data.posts;
      dispatch(setPosts({ posts }));
    };

    handleGetTags();
  }, []);

  useEffect(() => {
    const getPost = async () => {
      if (selectedTags) {
        const getPostWithTagRes = await getPostByTags(selectedTags);
        const posts = getPostWithTagRes.data.posts;
        dispatch(setPosts({ posts }));
      }
    };

    getPost();
  }, [selectedTags]);

  console.log(posts);

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

      {posts.length > 0 ? (
        posts.map((post: IPost) => <PostWidget key={post.id} {...post} />)
      ) : (
        <Typography textAlign={"center"} mt={3} variant={"h3"}>
          No data found{" "}
        </Typography>
      )}
    </MainLayout>
  );
};

export default PostWithTags;

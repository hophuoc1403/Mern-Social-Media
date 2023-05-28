import {Box} from "@mui/system";
import MainLayout from "../../layouts/MainLayout";
import {Autocomplete, Button, IconButton, Stack, TextField, Typography, useTheme} from "@mui/material";
import {useEffect, useState} from "react";
import ReactQuill from "react-quill";
import {getTags, sendPost} from "../../service/post.service";
import {toast} from "react-toastify";
import {addNewestPost} from "../../state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import {DeleteOutlined, EditOutlined} from "@mui/icons-material";
import {motion} from "framer-motion";
import {useAppDispatch} from "../../index";
import {useNavigate} from "react-router-dom";

const AddPost = () => {
  const [description,setDescription] = useState('')
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const { palette } = useTheme();
  // @ts-ignore
  const medium = palette.neutral.medium;

  const navigate = useNavigate()

  useEffect(() => {
    const handleGetTags = async () => {
      const response = await getTags();
      setTags(response.data);
    };

    handleGetTags();
  }, []);


  const handlePost = async () => {
    const id = toast.info("loading ....", {
      autoClose: false,
      className: "rotateY animated",
    });
    try {
      const formData = new FormData();
      // formData.append("userId", id.toString());
      formData.append("description", description);
      if (image) {
        formData.append("picturePath", image);
      }
      if (selectedTags.length > 0) {
        formData.append("tags", JSON.stringify(selectedTags));
      }
      const res = await sendPost(formData);
      const postResponse: IPost = res.data.post;
      dispatch(addNewestPost({ post: postResponse }));
      setImage(null);
      setDescription("");
      setSelectedTags([]);

      navigate("/")
      toast.update(id, {
        render: " post successfully",
        type: toast.TYPE.SUCCESS,
        className: "rotateY animated",
        autoClose: 4000,
      });
    } catch (e) {
      console.log({ error: e });
      toast.update(id, {
        render: " post failed",
        type: toast.TYPE.ERROR,
        className: "rotateY animated",
        autoClose: 4000,
      });
    }
  };

  return <MainLayout>
    <Box>
      <Typography component={"h3"} textAlign={"center"} variant={"h3"}>Add Post</Typography>
      <Typography mt={5} mb={1} variant={"h4"}>Description</Typography>
      {/*<Box  p={2} pb={10} sx={{border:"1px solid #f5f5f5",borderRadius:"10px"}}>*/}
        <ReactQuill
          value={description}
          onChange={e => {
            console.log(e)
            setDescription(e)
          }}
          modules={modules}
          formats={formats}
          bounds={'.app'}
          placeholder={"Write your thinking ..."}
          theme={"snow"}
          style={{height:"250px",color:"#fff !important"}}
        />
      {/*</Box>*/}

      <Box mt={10} mb={5}>
        <Autocomplete
          multiple
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
          onChange={(e, val) =>
            setSelectedTags(() => val.map((item) => item.id))
          }
        />
      </Box>
      <motion.div
        whileTap={{ scale: 0.95 }}
      >
        <Box
          border={`1px solid ${medium}`}
          borderRadius={"5px"}
          mt={"1rem"}
          p={"1rem"}
          width={"100%"}
        >
          <Dropzone
            multiple={false}
            onDrop={(acceptedFiles) => {
              setImage(acceptedFiles[0]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  width={"100%"}
                  textAlign="center"
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p={"1rem"}
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input width={"100%"} {...getInputProps()} />
                  {!image ? (
                    <p>Add image here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>
                        {image.name}
                        <EditOutlined />
                      </Typography>
                    </FlexBetween>
                  )}
                </Box>

                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ marginLeft: "10px" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      </motion.div>
      <Stack mt={2} flexDirection={"row"} justifyContent={"flex-end"}>
        <Button onClick={handlePost} variant={"contained"} color={"primary"}>Add</Button>
      </Stack>
    </Box>
  </MainLayout>
}

const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'},
      {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

export default AddPost
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "index";
import { useEffect, useState } from "react";
import { sendPost } from "../../service/post.service";
import { addNewestPost, setPosts } from "../../state";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import Dropzone from "react-dropzone";
import {
  AttachFileOutlined,
  DeleteOutlined,
  EditOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface MyPostWidgetProps {
  picturePath: string;
}

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 500 },
    },
  },
};

const MyPostWidget = ({ picturePath }: MyPostWidgetProps) => {
  const dispatch = useAppDispatch();
  const [isImage, setIsImage] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useAppSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  // @ts-ignore
  const mediumMain = palette.neutral.mediumMain;
  // @ts-ignore
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    const id = toast.info("loading ....", {
      autoClose: false,
      className: "rotateY animated",
    });
    try {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }
      const res = await sendPost(formData);
      const postResponse: IPost = res.data;
      console.log(postResponse);
      
      dispatch(addNewestPost({ post:postResponse }));
      setImage(null);
      setPost("");
      setIsImage(false);

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

  return (
    <WidgetWrapper>
      <FlexBetween gap={"1rem"}>
        <UserImage image={picturePath} size={50} />
        <InputBase
          placeholder={"What on your mind ...."}
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.background.default,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handlePost();
            }
          }}
        />
      </FlexBetween>
      {isImage && (
        <motion.div
          variants={variants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={isImage ? "open" : "closed"}
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
      )}
      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap={"0.25rem"} onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>
        {isNonMobileScreens ? (
          <>
            <FlexBetween
              marginLeft={2}
              sx={{ cursor: "pointer" }}
              gap={"0.25rem"}
            >
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>
            <FlexBetween
              marginLeft={2}
              sx={{ cursor: "pointer" }}
              gap={"0.25rem"}
            >
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>
            <FlexBetween
              marginLeft={2}
              sx={{ cursor: "pointer" }}
              gap={"0.25rem"}
            >
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap={"0.25rem"} marginLeft={1}>
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}
        <LoadingButton
          disabled={!post}
          onClick={handlePost}
          sx={{}}
          variant="contained"
        >
          POST
        </LoadingButton>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;

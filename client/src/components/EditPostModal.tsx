import {
  Box,
  Button,
  IconButton,
  InputBase,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import FlexBetween from "./FlexBetween";
import Dropzone from "react-dropzone";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { updatePost } from "../service/post.service";
import { useDispatch } from "react-redux";
import { setPost } from "../state";
import { toast } from "react-toastify";

interface EditPostModalProps {
  description: string;
  postPicturePath: string;
  isEditPost: boolean;
  setIsEditPost: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}

export const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  minWidth: 450,
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditPostModal = ({
  postPicturePath,
  description,
  isEditPost,
  setIsEditPost,
  id,
}: EditPostModalProps) => {
  const [valuePost, setValuePost] = useState<string>(description);
  const [image, setImage] = useState<File | null>(null);
  const [typeEditImage, setTypeEditImage] = useState<"delete" | "change">(
    "change"
  );
  const { palette } = useTheme();
  const dispatch = useDispatch();

  const handleEdit = async () => {
    const toastId = toast.info("loading ....", {
      autoClose: false,
      className: "rotateY animated",
    });
    try {
      const formData = new FormData();
      formData.append("description", valuePost);
      if (typeEditImage === "change") {
        if (image !== null) {
          formData.append("picturePath", image);
        }
      } else {
        formData.append("pictureDelete", postPicturePath);
      }
      const res = await updatePost(id, formData);

      const post: IPost = res.data.post;
      dispatch(setPost({ post, postid: post.id }));
      setIsEditPost(false);
      setValuePost("");
      setImage(null);
      toast.update(toastId, {
        render: "update post successfully",
        type: toast.TYPE.SUCCESS,
        className: "rotateY animated",
        autoClose: 4000,
      });
    } catch (e) {
      console.log({ error: e });
      toast.update(toastId, {
        render: "update post failed",
        type: toast.TYPE.ERROR,
        className: "rotateY animated",
        autoClose: 4000,
      });
    }
  };

  return (
    <Modal
      open={isEditPost}
      onClose={() => setIsEditPost(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant={"h5"}>Edit your post</Typography>
        <InputBase
          placeholder={"What on your mind ...."}
          onChange={(e) => setValuePost(e.target.value)}
          value={valuePost}
          sx={{
            width: "100%",
            backgroundColor: palette.background.default,
            borderRadius: "2rem",
            padding: "1rem 2rem",
            marginBlock: "2rem 1rem",
          }}
        />

        <Box>
          <FlexBetween>
            <Box>
              {postPicturePath && (
                <FlexBetween>
                  <Typography> Current Image : </Typography>
                  <img
                    width={90}
                    style={{ borderRadius: "10px" }}
                    src={`http://localhost:3001/${postPicturePath}`}
                    alt=""
                  />
                </FlexBetween>
              )}
            </Box>

            <ToggleButtonGroup
              color={typeEditImage == "delete" ? "error" : "primary"}
              value={typeEditImage}
              exclusive
              onChange={(e, value) => setTypeEditImage(value)}
              aria-label="Platform"
            >
              {postPicturePath && (
                <ToggleButton value="delete" sx={{ color: "red" }}>
                  Delete
                </ToggleButton>
              )}
              <ToggleButton value="change">Change</ToggleButton>
            </ToggleButtonGroup>
          </FlexBetween>
          <Box
            border={`1px solid black`}
            borderRadius={"5px"}
            mt={"1rem"}
            p={"1rem"}
            width={"max-content"}
          >
            {typeEditImage == "change" && (
              <Dropzone
                multiple={false}
                onDrop={(acceptedFiles) => {
                  setImage(acceptedFiles[0]);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <FlexBetween>
                    <Box
                      {...getRootProps()}
                      border={`2px dashed ${palette.primary.main}`}
                      p={"1rem"}
                      sx={{ "&:hover": { cursor: "pointer" } }}
                      minWidth={450}
                    >
                      <input {...getInputProps()} />
                      {!image ? (
                        <p style={{ textAlign: "center" }}>Add image here</p>
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
            )}
          </Box>
        </Box>

        <FlexBetween sx={{ marginInline: "3rem", marginTop: "1rem" }}>
          <Button onClick={() => handleEdit()}>Save</Button>
          <Button color={"error"} onClick={() => setIsEditPost(false)}>
            Cancel
          </Button>
        </FlexBetween>
      </Box>
    </Modal>
  );
};

export default EditPostModal;

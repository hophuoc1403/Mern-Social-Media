import {Box, Button, Modal, Stack, Typography} from "@mui/material";
import {useState} from "react";
import ImageUploading from 'react-images-uploading';
import {useAppSelector} from "../../index";
import {addStory} from "../../service/story.service";
import {toast} from "react-toastify";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

interface AddStoryProps {
  isOpen: boolean,
  handleClose: () => void
  handleFetch: () => void
}

const AddStory = ({handleClose, isOpen, handleFetch}: AddStoryProps) => {
  const [images, setImages] = useState<any>([]);

  const onChange = (imageList: any) => {
    // data for submit
    setImages(imageList);
  };
  const user = useAppSelector(state => state.user)
  const handleAddStory = async () => {
    try {
      const payload = new FormData()
      payload.append("picturePath", images[0].file)
      payload.append("userId", user.id.toString())
      const res = await addStory(payload)
      handleClose()
      handleFetch()
      toast.success("Add story success!")
    } catch (e) {
    }
  }
  return <Modal
    open={isOpen}
    onClose={handleClose}
    aria-labelledby="child-modal-title"
    aria-describedby="child-modal-description"
  >
    <Box sx={{...style, width: 500}} textAlign={"center"} display={"flex"} alignItems={"center"}
         flexDirection={"column"}>
      {/*<h2 id="child-modal-title">Text in a child modal</h2>*/}
      {/*<p id="child-modal-description">*/}
      {/*  Lorem ipsum, dolor sit amet consectetur adipisicing elit.*/}
      {/*</p>*/}
      <Typography variant={"h4"} mb={3}>Add Your Story</Typography>
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onChange}
        dataURLKey="data_url"
      >
        {({
            imageList,
            onImageUpload,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <Button sx={{mb: 2}} variant={"contained"}
                    style={isDragging ? {color: 'red'} : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
            >
              Click or Drop here
            </Button>
            &nbsp;
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img
                  style={{transform: "translateX(20px)", marginBottom: 3}} src={image['data_url']} alt=""
                  width="100"/>
                <div className="image-item__btn-wrapper">
                  <Button onClick={() => onImageUpdate(index)}>Update</Button>
                  <Button onClick={() => onImageRemove(index)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
      <Button sx={{mt: 7}} variant={"outlined"} onClick={handleAddStory}>Add</Button>
    </Box>
  </Modal>
}

export default AddStory
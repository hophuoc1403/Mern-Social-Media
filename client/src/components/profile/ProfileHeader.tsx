import {
  Badge,
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "index";
import { makeStyles } from "tss-react/mui";
import UserImage from "../UserImage";
import FlexBetween from "../FlexBetween";
import { CameraAlt, EditOffOutlined } from "@mui/icons-material";
import { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/system";
import { addOrRemoveFriend, changeAvatar } from "../../service/user.service";
import { setAvatar } from "../../state";
import { toast } from "react-toastify";
import useProfileStore from "hooks/stateProfile.store";
import { useTheme } from "@emotion/react";
import useChatStore from "../../hooks/stateChat.store";
import { useTrackedStore } from "../../hooks";

const ModalStyle = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: theme.palette.background.default,
  border: "2px solid #000",
  boxShadow: "24px",
  padding: "25px 20px",
  width: "max-content",
}));

const ProfileHeader = ({ user }: { user: IUser }) => {
  const { classes } = useStyles();
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { user: userRoot } = useAppSelector((state) => state);
  const { handleOpenModal } = useProfileStore();
  const { setIsOpenChat } = useChatStore();
  const socket = useTrackedStore().socket.socket();
  const { setUserSelected } = useProfileStore();

  // check is friend
  const [isFriend, setIsFriend] = useState<boolean>(() => {
    if (user.id === userRoot.id) {
      return false;
    }
    // @ts-ignore
    return !!user.friends.find((friend) => friend.id === userRoot.id);
  });

  const handleUploadAvatar = async (avatar: any) => {
    const file = avatar.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const { result } = e.target;
      setImageUrl(result);
    };
    if (file) {
      fileReader.readAsDataURL(file);
    }
    await new Promise((_) => setTimeout(_, 1500));

    if (file !== null) {
      setFileImage(file);
      setIsOpenModal(true);
    }
  };

  const handleChangeAvatar = async () => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("picture", fileImage as File);
      form.append("picturePath", fileImage!.name);
      await changeAvatar(form);
      await new Promise((_) => setTimeout(_, 1500));
      dispatch(setAvatar({ avatar: fileImage!.name }));
      toast.success("update avatar successfully");
    } catch (e) {
      console.log({ error: e });
      toast.error("update avatar fail");
    } finally {
      setLoading(false);
      setIsOpenModal(false);
    }
  };

  const patchFriend = async () => {
    try {
      const id = toast.info("loading ....", {
        autoClose: false,
        className: "rotateY animated",
      });
      const response = await addOrRemoveFriend(user.id, userRoot.id);
      const friends: IUser[] = response.data;
      // @ts-ignore
      const isFriends = friends.find((friend) => friend.id === userRoot.id);
      isFriends &&
        socket?.emit("createRoom", { members: [userRoot.id, user.id] });
      setIsFriend(!!isFriends);
      setTimeout((_: any): any => {
        toast.update(id, {
          render: isFriends
            ? "add friend successfully"
            : "remove friend successfully",
          type: toast.TYPE.SUCCESS,
          className: "rotateY animated",
          autoClose: 4000,
        });
      }, 1000);
      console.log(friends);
      const userWithNewFriend = { ...user, friends };
      setUserSelected(userWithNewFriend);
    } catch (e) {
      console.log({ error: e });
    }
  };

  // @ts-ignore
  const mode = theme.palette.mode;

  return (
    <Box
      sx={{
        backgroundImage:
          mode === "dark"
            ? "linear-gradient(to bottom,#0b4a55,#242526)"
            : "linear-gradient(to bottom,gray,#fff)",
      }}
    >
      <Box className={classes.background}>
        <img
          style={{
            maxWidth: "150rem",
            width: "70%",
            objectFit: "cover",
            height: "20rem",
            borderRadius: ".5rem",
            boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",
          }}
          src={`http://localhost:3001/${user.picturePath}`}
          alt=""
        />
      </Box>
      <FlexBetween mx={"15%"}>
        <FlexBetween>
          <Box sx={{ marginLeft: "5rem", transform: "translateY(-15%)" }}>
            <Badge
              badgeContent={
                <label
                  htmlFor="icon-button-file"
                  style={{ transform: "translate(-80%,350%)" }}
                >
                  <input
                    onChange={async (avatar: any) => {
                      await handleUploadAvatar(avatar);
                    }}
                    type="file"
                    accept="image/*"
                    id="icon-button-file"
                    style={{ display: "none" }}
                  />

                  <IconButton aria-label="upload picture" component="span">
                    <CameraAlt sx={{ fontSize: 20 }} />
                  </IconButton>
                </label>
              }
            >
              <UserImage
                style={{ border: "6px solid #242526" }}
                image={`${user.picturePath}`}
                size={150}
              />
            </Badge>
          </Box>
          <Box ml={2}>
            <Typography
              fontWeight={"bold"}
              variant={"h3"}
              sx={{ marginBottom: ".3rem" }}
            >
              {user.firstName + " " + user.lastName}
            </Typography>
            <Typography variant={"body1"}>
              {user.friends.length} friends
            </Typography>
            <Box mt={1} display={"flex"}>
              {user.friends.map((friend: IUser) => (
                <UserImage
                  image={friend.picturePath}
                  size={50}
                  style={{ border: "3px solid #242526" }}
                />
              ))}
            </Box>
          </Box>
        </FlexBetween>
        {user.id === userRoot.id ? (
          <Button variant={"contained"} onClick={handleOpenModal}>
            <EditOffOutlined />
            Edit profile
          </Button>
        ) : (
          <Box className={"flex gap-2"}>
            <Button onClick={() => setIsOpenChat(true)} variant={"contained"}>
              Message
            </Button>{" "}
            <Button onClick={patchFriend} variant={"contained"}>
              {!isFriend ? "Add Friend" : "Remove Friend"}
            </Button>
          </Box>
        )}
      </FlexBetween>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <ModalStyle>
          <img
            style={{
              width: "400px",
              height: "400px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
            src={imageUrl}
            alt="Avatar"
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: 25,
            }}
          >
            <Button
              size="medium"
              color="error"
              variant="contained"
              onClick={() => {
                setIsOpenModal(false);
                setImageUrl("");
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              onClick={handleChangeAvatar}
              loading={loading}
              size="medium"
              color="primary"
              variant="contained"
              style={{ marginLeft: 20 }}
            >
              Upload
            </LoadingButton>
          </div>
        </ModalStyle>
      </Modal>
    </Box>
  );
};

export default ProfileHeader;

const useStyles = makeStyles()((theme) => ({
  background: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

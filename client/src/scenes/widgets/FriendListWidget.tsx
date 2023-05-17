import WidgetWrapper from "../../components/WidgetWrapper";
import { IconButton, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useAppSelector } from "index";
import {
  addOrRemoveFriend,
  getFriends,
  getUser,
} from "../../service/user.service";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import { PersonRemoveOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { setFriends } from "../../state";
import useChatStore from "hooks/stateChat.store";

const FriendListWidget = () => {
  const dispatch = useDispatch();
  const { id: userId, friends } = useAppSelector((state) => state.user);
  const { setIsOpenChat, setMemberInfo } = useChatStore((state) => state);

  const removeFriend = async (friendId: string) => {
    const id = toast.info("loading ....", {
      autoClose: false,
      className: "rotateY animated",
    });
    try {
      const res = await addOrRemoveFriend(userId, friendId);
      const friends = res.data;
      dispatch(setFriends({ friends }));
      setTimeout((_: any) => {
        toast.update(id, {
          render: "remove friend successfully",
          type: toast.TYPE.SUCCESS,
          className: "rotateY animated",
          autoClose: 4000,
        });
      }, 1000);
    } catch (e) {
      console.log({ error: e });
    }
  };

  return (
    <WidgetWrapper>
      {friends.length > 0 &&
        friends.map((friend) => (
          <FlexBetween
            onClick={async () => {
              const memberInfoRes = await getUser(friend.id);
              const memberInfo: IUser = memberInfoRes.data;
              setMemberInfo(memberInfo);
              setIsOpenChat(true);
            }}
            key={friend.id}
            sx={{ marginBottom: "10px", cursor: "pointer" }}
          >
            <FlexBetween sx={{}}>
              <UserImage image={`${friend.picturePath}`} size={55} />
              <Typography sx={{ marginLeft: "10px" }}>
                {friend.firstName + " " + friend.lastName}
              </Typography>
            </FlexBetween>
            <IconButton
              sx={{ cursor: "pointer" }}
              onClick={async (e) => {
                e.stopPropagation();
                await removeFriend(friend.id);
              }}
            >
              <PersonRemoveOutlined />
            </IconButton>
          </FlexBetween>
        ))}
    </WidgetWrapper>
  );
};

export default FriendListWidget;

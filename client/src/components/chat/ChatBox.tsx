import { Divider, Menu, Typography } from "@mui/material";
import { Box } from "@mui/system";
import UserImage from "components/UserImage";
import { useAppSelector } from "index";
import { useEffect, useRef, useState } from "react";
import { getTitleMessage } from "service/chat.service";
import { makeStyles } from "tss-react/mui";
import { useHover } from "usehooks-ts";
import useChatStore, { chat } from "../../hooks/stateChat.store";
import { getUser } from "../../service/user.service";

interface ChatBoxProps {
  onClose: () => void;
  id: string;
  chatRef: HTMLElement | null;
}

interface TitleMessages {
  roomId: {
    members: string[];
  };
  messages: chat;
}

const ChatBox = ({ onClose, chatRef }: ChatBoxProps) => {
  const { classes } = useStyle();
  const [titleMessages, setTitleMessages] = useState<TitleMessages[]>([]);

  useEffect(() => {
    const handleGetTitleMessage = async () => {
      try {
        const titleMessage = await getTitleMessage();
        setTitleMessages(titleMessage.data);
      } catch (e) {
        console.log(e);
      }
    };
    handleGetTitleMessage();
  }, []);

  return (
    <Menu
      sx={{
        borderRadius: "100px !important",
        ".css-6hp17o-MuiList-root-MuiMenu-list": {
          borderRadius: "100px !important",
        },
      }}
      open={!!chatRef}
      onClose={onClose}
      id="chat-box"
      MenuListProps={{
        "aria-labelledby": "basic-button2",
      }}
      anchorEl={chatRef}
      className={classes.chatBox}
    >
      <Box className={""}>
        {titleMessages.length > 0 ? (
          titleMessages.map((message: any) => {
            return <ChatBoxEl message={message} />;
          })
        ) : (
          <Box padding={2}>
            <Typography>No message yet</Typography>
          </Box>
        )}
      </Box>
    </Menu>
  );
};

const ChatBoxEl = ({ message }: { message: any }) => {
  const chatElRef = useRef<HTMLDivElement | null>(null);
  const isHoverChat = useHover(chatElRef);
  const { classes } = useStyleEl({ chatBoxHover: isHoverChat });
  const { user } = useAppSelector((state) => state);
  const { setMemberInfo, setIsOpenChat } = useChatStore();

  const handleClickChatBox = async () => {
    const memberId = message[0].roomId.members.find(
      (member: string) => member !== user.id
    );
    const res = await getUser(memberId);
    await setMemberInfo(res.data);
    setIsOpenChat(true);
  };

  return (
    <>
      <Box
        ref={chatElRef}
        onClick={handleClickChatBox}
        className={`flex gap-2 px-2 py-3 min-w-[150px] ${classes.chatBoxEl}`}
      >
        <UserImage image={message[0].senderId.picturePath} size={35} />
        <Box>
          <Typography variant="h6">{message[0].senderId.firstName}</Typography>
          <Typography variant="body2">{message[0].message}</Typography>
        </Box>
      </Box>
      <Divider />
    </>
  );
};

export default ChatBox;

const useStyle = makeStyles()((theme) => ({
  chatBox: {
    "& .css-6hp17o-MuiList-root-MuiMenu-list": {
      background: theme.palette.background.default,
      borderRadius: "5px !important",
    },
  },
}));

const useStyleEl = makeStyles<{ chatBoxHover: boolean }>()(
  (theme, { chatBoxHover }) => ({
    chatBoxEl: {
      backgroundColor: chatBoxHover ? "#EEEEEE" : "inherit",
      color: chatBoxHover ? "#000" : "",
      cursor: "pointer",
      minWidth: "200px",
    },
  })
);

import {
  CloseOutlined,
  HorizontalRuleOutlined,
  SendAndArchiveOutlined,
} from "@mui/icons-material";
import { Divider, IconButton, InputBase, Typography } from "@mui/material";
import { Box } from "@mui/system";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { useAppSelector } from "index";
import { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import ScrollToBottom from "react-scroll-to-bottom";
import useChatStore, { chat } from "../../hooks/stateChat.store";
import { getMessages } from "../../service/chat.service";
import { useTrackedStore } from "../../hooks";
import moment from "moment";
import LoadingButton from "@mui/lab/LoadingButton";

interface ChatExcProps {
  isShow: boolean;
}

interface Chat {
  messages: chat[];
}

const ChatExc = ({ isShow }: ChatExcProps) => {
  const [isSmallSize, setIsSmallSize] = useState<boolean>(false);
  const { user } = useAppSelector((state) => state);
  const { classes, theme } = useStyles({ isShow, isSmallSize });
  const [messages, setMessages] = useState<chat[]>([]);
  const socket = useTrackedStore().socket.socket();
  const [messSend, setMessSend] = useState<string>("");
  const [room, setRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setIsOpenChat, memberInfo } = useChatStore();

  useEffect(() => {
    const handleGetMessages = async () => {
      const res = await getMessages({ members: [user.id, memberInfo!.id] });
      const chatRes: Chat = res.data;
      console.log(res);
      setMessages(chatRes.messages);
      setRoom(res.data.room);
    };
    handleGetMessages().then((r) => r);
  }, [memberInfo]);

  const handleSendMessage = async () => {
    setIsLoading(true);

    socket?.emit("getMessage", {
      senderId: user.id,
      message: messSend,
      roomId: room.id,
    });
    setMessSend("");
    await new Promise((_) => setTimeout(_, 500));
    setIsLoading(false);
  };

  useEffect(() => {
    const handler = ({
      senderId,
      message,
      createdAt,
    }: {
      senderId: string;
      message: string;
      createdAt: string;
    }) => {
      if (message !== "") {
        setMessages((state) => [
          ...state,
          {
            sender: +senderId === memberInfo?.id ? memberInfo : user,
            message,
            createdAt,
          },
        ]);
      }
    };
    socket?.on("sendMessage", handler);
    return () => {
      socket!.off("sendMessage", handler);
    };
  }, []);

  return (
    <Box className={classes.container}>
      <FlexBetween
        className={classes.header}
        onClick={() => setIsSmallSize(false)}
      >
        <FlexBetween>
          <UserImage
            size={40}
            image={memberInfo ? memberInfo.picturePath : user.picturePath}
          />
          <Typography
            className="pl-1 font-bold"
            variant="body2"
            fontWeight={"bold"}
          >
            {memberInfo
              ? memberInfo.firstName + " " + memberInfo.lastName
              : "User"}
          </Typography>
        </FlexBetween>

        <Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsSmallSize(!isSmallSize);
            }}
          >
            <HorizontalRuleOutlined />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsOpenChat(false);
            }}
          >
            <CloseOutlined />
          </IconButton>
        </Box>
      </FlexBetween>
      <ScrollToBottom className={classes.body}>
        {messages.map((message) => (
          <ChatContent
            createdAt={message.createdAt}
            senderInfo={message.sender}
            message={message.message}
            isSender={message.sender.id === user.id}
          />
        ))}
      </ScrollToBottom>
      <Box className={classes.input}>
        <Divider sx={{ backgroundColor: theme.palette.primary.main, mb: 1 }} />
        <InputBase
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="write some thing ..."
          sx={{
            border: "1px solid white",
            borderRadius: "20px !important",
            padding: "3px 10px",
          }}
          endAdornment={
            <LoadingButton sx={{ minWidth: "max-content" }} loading={isLoading}>
              <SendAndArchiveOutlined sx={{ cursor: "pointer" }} />
            </LoadingButton>
          }
          autoFocus
          fullWidth
          value={messSend}
          onChange={(event) => setMessSend(event.target.value)}
          // onClick={handleSendMessage}
        />
      </Box>
    </Box>
  );
};

interface ChatContentProps {
  isSender: boolean;
  senderInfo: IUser;
  message: string;
  createdAt: string;
}

const ChatContent = ({
  isSender,
  senderInfo,
  message,
  createdAt,
}: ChatContentProps) => {
  const { classes } = useChatContentStyles({ isSender });

  return (
    <Box className={classes.container}>
      <UserImage image={senderInfo.picturePath} size={40} />
      <Box style={{ maxWidth: "60%" }}>
        <Box className={classes.box}>
          <Typography fontSize={"15px"}>{message}</Typography>
        </Box>
        <Typography fontSize={"12px"} color={"grey"}>
          {moment(createdAt).fromNow()}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatExc;

const useStyles = makeStyles<{ isShow: boolean; isSmallSize: boolean }>()(
  (theme, { isShow, isSmallSize }) => ({
    container: {
      display: isShow ? "flex" : "none",
      flexDirection: "column",
      position: "fixed",
      right: "6%",
      bottom: "0",
      width: "max(20vw,300px)",
      height: isSmallSize ? "auto" : "max(50vh,300px)",
      backgroundColor: theme.palette.background.default,
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      overflowY: "hidden",
    },
    header: {
      background: `linear-gradient(
        to top,
        #243b55,
        #141e30)`,
      padding: "5px",
    },

    body: {
      flexGrow: "1",
      height: "230px",
      display: isSmallSize ? "none" : "block",
    },

    input: {
      marginBottom: "5px",
      bottom: "-4px",
      background: theme.palette.background.default,
      display: isSmallSize ? "none" : "block",
    },
  })
);

const useChatContentStyles = makeStyles<{ isSender: boolean }>()(
  (theme, { isSender }) => ({
    container: {
      display: "flex",
      flexDirection: isSender ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: "15px",
      paddingInline: "5px",
    },
    box: {
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      borderRadius: "40px",
      padding: "2px 10px",
      // overflow: "auto",
      // maxWidth: "60%",
      backgroundColor: isSender ? "green" : "blue",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
  })
);

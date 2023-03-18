import {
  CloseOutlined,
  HorizontalRuleOutlined,
  SendAndArchiveOutlined,
} from "@mui/icons-material";
import {
  Divider,
  IconButton,
  InputBase,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { useAppSelector } from "index";
import { useState } from "react";
import { makeStyles } from "tss-react/mui";
import ScrollToBottom from "react-scroll-to-bottom";

interface ChatExcProps {
  isShow: boolean;
}
interface Chat {
  room: string;
  chat: any;
}

const ChatExc = ({ isShow }: ChatExcProps) => {
  const [isSmallSize, setIsSmallSize] = useState<boolean>(false);
  const { user } = useAppSelector((state) => state);
  const { classes, theme } = useStyles({ isShow, isSmallSize });
  const [isClosed, setIsClosed] = useState<boolean>(false);

  return (
    <Box className={classes.container}>
      <FlexBetween
        className={classes.header}
        onClick={() => setIsSmallSize(false)}
      >
        <FlexBetween>
          <UserImage size={40} image={user.picturePath} />
          <Typography
            className="pl-1 font-bold"
            variant="body2"
            fontWeight={"bold"}
          >
            skdjasfhdsfkd
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
              setIsClosed(true);
            }}
          >
            <CloseOutlined />
          </IconButton>
        </Box>
      </FlexBetween>
      <ScrollToBottom className={classes.body}>
          <ChatContent isSender={true} />
      </ScrollToBottom>
      <Box className={classes.input}>
        <Divider sx={{ backgroundColor: theme.palette.primary.main, mb: 1 }} />
        <InputBase
          placeholder="write some thing ..."
          sx={{
            border: "1px solid white",
            borderRadius: "20px !important",
            padding: "3px 10px",
          }}
          endAdornment={<SendAndArchiveOutlined sx={{ cursor: "pointer" }} />}
          autoFocus
          fullWidth
        />
      </Box>
    </Box>
  );
};

const ChatContent = ({ isSender }: { isSender: boolean }) => {
  const { classes } = useChatContentStyles({ isSender });

  return (
    <Box className={classes.container}>
      <UserImage image="" size={40} />
      <Box className={classes.box}>
        <Typography fontSize={"12px"}>
          lkfdjgfdjg hdfgjf kasdjaks djkd jfd ksk kdsfj
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
      width: "20vw",
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
      display: isSmallSize ? "none" : "block",
      overflowY: isSmallSize ? "hidden" : "scroll",
      "&::-webkit-scrollbar": {
        display: "none",
      },
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
      marginBottom: "8px",
    },
    box: {
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      borderRadius: "40px",
      padding: "2px 8px",
      overflow: "auto",
      maxWidth: "60%",
      backgroundColor: isSender ? "green" : "blue",
    },
  })
);

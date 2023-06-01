import { Divider, Typography, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { NotiType, Notification } from "../scenes/navbar";
import { Link } from "react-router-dom";
import { CommentBankOutlined, ThumbUpAltOutlined } from "@mui/icons-material";

const NotificationBox = ({ notification }: { notification: Notification }) => {
  const { palette } = useTheme();
  console.log(notification.type)
  return (
    <>
      <Box
        bgcolor={palette.background.default}
        padding={"15px 10px"}
        sx={{ "&:hover": { background: "rgba(45,40,40,0.7)" } }}
      >
        <Link to={`/post/${notification.post.id}`}>
          <Stack flexDirection={"row"} gap={1}>
            {notification.type === NotiType.LIKE ? (
              <ThumbUpAltOutlined />
            ) : (
              <CommentBankOutlined />
            )}
            <Typography variant={"h6"} maxWidth={150}>
              <strong>{notification.senderName}</strong> {notification.message}
            </Typography>
          </Stack>
        </Link>
      </Box>
      <Divider />
    </>
  );
};

export default NotificationBox;

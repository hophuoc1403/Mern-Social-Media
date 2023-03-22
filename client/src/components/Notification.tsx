import {Divider, Typography, useTheme} from "@mui/material";
import {Box} from "@mui/system";
import {Notification} from "../scenes/navbar";
import {Link} from "react-router-dom";

const NotificationBox = ({notification}:{notification:Notification}) => {
  const {palette} = useTheme()
  return <>
    <Box bgcolor={palette.background.default} padding={"15px 10px"} sx={{"&:hover":{background:"rgba(45,40,40,0.7)"}}}>
      <Link to={`/post/${notification.postId}`} >
        <Typography variant={"h5"}>{notification.content}</Typography>
      </Link>
    </Box>
    <Divider /></>
}

export default  NotificationBox
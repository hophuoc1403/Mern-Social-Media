import MainLayout from "../../layouts/MainLayout";
import {Avatar, Box, Button, Chip, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {getNotifications} from "../../service/post.service";
import {useAppSelector} from "../../index";
import {Notification} from "../navbar";
import moment from "moment";
import {useNavigate} from "react-router-dom";

const Activities = () => {
  const [activities,setActivities] = useState<Notification[]>([])

  const user = useAppSelector(state => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    const handleGetActivities = async () => {
      const res = await getNotifications({userId:user.id})
      console.log(res)
      setActivities(res.data.notifications)
    }
    handleGetActivities()
  },[user.id])


  return <MainLayout >
    <Box>
      {activities.map(item => (
        <Button fullWidth sx={{my:2,px:2,py:2,borderRadius:"10px"}}>
          <Stack onClick={() => navigate(`/post/${item.post.id}`)} flexDirection={"row"} justifyContent={"space-between"} sx={{width:"100%"}} alignItems={"center"} >
            <Box textAlign={"left"}>
              <Stack flexDirection={"row"} sx={{mb:1}}>
                <Avatar src={"http://localhost:3001/" + item.user.picturePath} sx={{mr:1}}/>
                <Chip label={item.type} />
              </Stack>
              <Typography > <strong>{item.senderName}</strong>  <span style={{color:"white"}}>{ " " + item.message}</span></Typography>
            </Box>
            <Box>
              <Typography>{moment(item.post.createdAt).fromNow()}</Typography>
            </Box>
          </Stack>
        </Button>
      ))}
    </Box>
  </MainLayout>
}

export default Activities
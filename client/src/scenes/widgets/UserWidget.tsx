import {useEffect, useState} from "react";
import {Box, Divider, Typography, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useAppSelector} from "../../App";
import {getUser} from "../../service/user.service";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import {
  EditOutlined,
  LocationOnOutlined,
  ManageAccounts,
  ManageAccountsOutlined,
  WorkOutline
} from "@mui/icons-material";
import axios from "axios";

interface UserWidgetProps {
  userId: string,
  picturePath: string
}

const UserWidget = ({userId, picturePath}: UserWidgetProps) => {

  const [user, setUser] = useState<IUser | null>(null)
  const {palette} = useTheme()
  const navigate = useNavigate()
  const token = useAppSelector(state => state.token)
  // @ts-ignore
  const dark = palette.neutral.dark
  // @ts-ignore
  const medium = palette.neutral.medium
  // @ts-ignore
  const main = palette.neutral.main

  const handleGetUser = async () => {
    const user = await getUser(userId)
    // const user = await axios.get(`http://localhost:3001/users/${userId}`,{
    //   headers:{
    //     Authorization:`Bearer ${token}`
    //   }
    // })
    console.log(user)
    if (user) {
      setUser(user.data as IUser)
    }
  }

  useEffect(() => {
    handleGetUser().then()
  }, []);

  if (!user) {
    return null
  }

  const {
    firstName,
    lastName,
    friends,
    location,
    occupation,
    impressions,
    viewedProfile
  }
    = user

  return <WidgetWrapper>
    {/*first row */}
    <Box sx={{display: "flex", justifyContent: "space-between"}} gap={"0.5rem"} pb={"1.1rem"}
         onClick={() => navigate(`/profile/${userId}`)}>
      <FlexBetween gap={"1rem"}>
        <UserImage image={picturePath} size={30}/>
        <Box>
          <Typography variant={"h4"} color={dark} fontWeight={500}
                      sx={{"&:hover": {color: palette.primary.light, cursor: "pointer"}}}>
            {firstName} {lastName}
          </Typography>
          <Typography color={medium}>{friends.length} friends</Typography>
        </Box>
      </FlexBetween>
      <ManageAccountsOutlined/>
    </Box>

    <Divider/>

    {/*second row*/}
    <Box p={"1rem 0"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
      <Box display={"flex"} alignItems={"center"} gap={".5rem"} mb={"0.5rem"}>
        <LocationOnOutlined fontSize={"large"} sx={{color: main}}/>
        <Typography color={medium}>{location}</Typography>
      </Box>
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={"1rem"}>
        <WorkOutline fontSize={"large"} sx={{color: main}}/>
        <Typography color={medium}>{occupation}</Typography>
      </Box>
    </Box>
    <Divider/>

    {/*third row*/}
    <Box p={"1rem 0"}>
      <Box display={"flex"} justifyContent={"space-between"} mb={"0.5rem"}>
        <Typography color={medium}>
          Who viewed your profile ?
        </Typography>
        <Typography color={medium} fontWeight={500}>
          {viewedProfile}
        </Typography>
      </Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography color={medium}>
          Impressions of your post
        </Typography>
        <Typography color={medium} fontWeight={500}>
          {impressions}
        </Typography>
      </Box>
    </Box>
    <Divider/>

    {/*fourth row*/}
    <Box p={"1rem 0"}>
      <Typography fontSize={"1rem"} color={main} fontWeight={500} mb={"1rem"}>
        Social Profiles
      </Typography>
      <Box display={"flex"} justifyContent={"space-between"} gap={"1rem"} mb={"0.5rem"}>
        <FlexBetween gap={"1rem"}>
          <img src={"../assets/twitter.png"} alt={"twitter"}/>
          <Box>
            <Typography color={main} fontWeight={"500"}>
              Twitter
            </Typography>
            <Typography color={medium}>Social Network</Typography>
          </Box>
        </FlexBetween>
        <EditOutlined sx={{color: main}}/>
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} gap={"1rem"} mb={"0.5rem"}>
        <FlexBetween gap={"1rem"}>
          <img src={"../assets/linkedIn.png"} alt={"twitter"}/>
          <Box>
            <Typography color={main} fontWeight={"500"}>
              linkedIn
            </Typography>
            <Typography color={medium}>Network Platform</Typography>
          </Box>
        </FlexBetween>
        <EditOutlined sx={{color: main}}/>
      </Box>
    </Box>
  </WidgetWrapper>
}

export default UserWidget
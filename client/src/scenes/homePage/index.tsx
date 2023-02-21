import {Box, useMediaQuery} from "@mui/material";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import AdvertWidget from "../widgets/AdvertWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client/build/esm/socket";
import useAppStore from "hooks/stateApp";
import { useAppSelector } from "index";

const HomePage = () => {


  const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
  const {_id, picturePath,firstName,lastName} = useAppSelector(state => state.user)
  const {setSocket,socket} = useAppStore()
  useEffect(() => {
    const nameUser = firstName + ' ' + lastName
    socket?.emit("newUser", nameUser);
    
  }, [socket]);


  return <Box>
    <Box sx={{position: "sticky", top: "0px", zIndex: 999}}>
      <Navbar/>
    </Box>
    <Box width={"100%"} padding={"2rem 6%"}
         display={isNonMobileScreens ? "flex" : "block"}
         gap={"0.5rem"} justifyContent={"space-between"}>
      <Box flexBasis={isNonMobileScreens ? "22%" : undefined}>
        <Box style={{position: "sticky", top: "110px"}}>
          <UserWidget userId={_id} picturePath={picturePath}/>
        </Box>
      </Box>
      <Box flexBasis={isNonMobileScreens ? "50%" : undefined}
           mt={isNonMobileScreens ? undefined : "2rem"}>
        <MyPostWidget picturePath={picturePath}/>
        <PostsWidget userId={_id}/>
      </Box>
      {isNonMobileScreens && (
        <Box flexBasis={"22%"}>
          <Box style={{position: "sticky", top: "110px"}}>
            <AdvertWidget/>
            <Box m={"1rem 0"}>
              <FriendListWidget/>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  </Box>
}


// @ts-ignore
export default HomePage
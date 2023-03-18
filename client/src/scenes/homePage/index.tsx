import { Box, useMediaQuery } from "@mui/material";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import AdvertWidget from "../widgets/AdvertWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import { useEffect } from "react";
import useAppStore from "hooks/stateApp.store";
import { useAppSelector } from "index";
import { getFreePosts } from "service/post.service";
import { useScroll } from "hooks/useScroll";
import {actions, useTrackedStore} from "../../hooks";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath, firstName, lastName } = useAppSelector(
    (state) => state.user
  );
  const  socket  = useTrackedStore().socket.socket();
  const {setSocket} = actions().socket
  useEffect(() => {
    const nameUser = firstName + " " + lastName;
    socket?.emit("newUser", nameUser);
  }, [socket]);

  const { status, hasNextPage, fetchNextPage, characters } =
    useScroll(getFreePosts);

  return (
    <Box>
      <Box sx={{ position: "sticky", top: "0px", zIndex: 999 }}>
        <Navbar />
      </Box>
      <Box
        width={"100%"}
        padding={"2rem 6%"}
        display={isNonMobileScreens ? "flex" : "block"}
        gap={"0.5rem"}
        justifyContent={"space-between"}
      >
        <Box flexBasis={isNonMobileScreens ? "22%" : undefined}>
          <Box style={{ position: "sticky", top: "110px" }}>
            <UserWidget userId={_id} picturePath={picturePath} />
          </Box>
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "50%" : undefined}
          overflow={"hidden"}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget
            status={status}
            characters={characters}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis={"22%"}>
            <Box style={{ position: "sticky", top: "110px" }}>
              <AdvertWidget />
              <Box m={"1rem 0"}>
                <FriendListWidget />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// @ts-ignore
export default HomePage;

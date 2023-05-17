import { Box, useMediaQuery } from "@mui/material";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import AdvertWidget from "../widgets/AdvertWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import { useEffect, useState } from "react";
import { useAppSelector } from "index";
import { getFreePosts } from "service/post.service";
import { useScroll } from "hooks/useScroll";
import { useTrackedStore } from "../../hooks";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { picturePath, firstName, lastName } = useAppSelector(
    (state) => state.user
  );
  const { user } = useAppSelector((state) => state);
  const socket = useTrackedStore().socket.socket();
  useEffect(() => {
    const nameUser = firstName + " " + lastName;
    socket?.emit("newUser", nameUser);
  }, [socket]);
  // const [characters, setCharacters] = useState<any>([]);

  const { status, hasNextPage, fetchNextPage, characters } =
    useScroll(getFreePosts);

  // const handleGetAllPost = async () => {
  //   const response = await getFreePosts(1);
  //   setCharacters(response);
  // };

  // useEffect(() => {
  //   handleGetAllPost();
  // }, []);

  console.log({ characters });

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
          <Box style={{ position: "sticky", top: "95px" }}>
            <UserWidget user={user} />
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
            <Box style={{ position: "sticky", top: "95px" }}>
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

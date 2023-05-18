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
import Sidebar from "../../components/sidebar/SideBar";
import MainLayout from "../../layouts/MainLayout";

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
    <MainLayout>
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget
            status={status}
            characters={characters}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
    </MainLayout>
  );
};

// @ts-ignore
export default HomePage;

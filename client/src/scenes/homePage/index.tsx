import {  useMediaQuery } from "@mui/material";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import { useEffect } from "react";
import { useAppSelector } from "index";
import { getFreePosts } from "service/post.service";
import { useScroll } from "hooks/useScroll";
import { useTrackedStore } from "../../hooks";
import MainLayout from "../../layouts/MainLayout";

const HomePage = () => {
  const { picturePath, firstName, lastName } = useAppSelector(
    (state) => state.user
  );
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

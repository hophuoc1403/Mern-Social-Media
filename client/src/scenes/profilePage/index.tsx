import ProfileHeader from "components/profile/ProfileHeader";
import Navbar from "../navbar";
import { Box, useMediaQuery } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import UserWidget from "../widgets/UserWidget";
import { useAppSelector } from "index";
import PostsWidget from "../widgets/PostsWidget";
import ModalEdit from "components/profile/ModalEdit";
import { useParams } from "react-router-dom";
import { useScroll } from "hooks/useScroll";
import { getUserPosts } from "service/post.service";
import { useEffect } from "react";

const ProfilePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const { user } = useAppSelector((state) => state);
  const { userId } = useParams();

  const { status, hasNextPage, fetchNextPage, characters, refetch } = useScroll(
    (page: number) => getUserPosts(userId as string, page)
  );

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div>
      <Box sx={{ position: "sticky", top: "0px", zIndex: 999 }}>
        <Navbar />
      </Box>
      <ProfileHeader />
      <Box
        display={isNonMobileScreens ? "flex" : "block"}
        gap={"0.5rem"}
        justifyContent={"space-between"}
        mx={"15%"}
      >
        <Box flexBasis={"30%"} mt={"30px"}>
          <Box style={{ position: "sticky", top: "110px", width: "100%" }}>
            <UserWidget userId={user._id} picturePath={user.picturePath} />
          </Box>
        </Box>
        <Box flexBasis={"68%"}>
          <PostsWidget
            status={status}
            characters={characters}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        </Box>
      </Box>
      <ModalEdit />
    </div>
  );
};

export default ProfilePage;

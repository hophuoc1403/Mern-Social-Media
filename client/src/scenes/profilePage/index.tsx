import ProfileHeader from "components/profile/ProfileHeader";
import Navbar from "../navbar";
import { Box, useMediaQuery } from "@mui/material";
import UserWidget from "../widgets/UserWidget";
import {useAppDispatch, useAppSelector} from "index";
import PostsWidget from "../widgets/PostsWidget";
import ModalEdit from "components/profile/ModalEdit";
import { useParams } from "react-router-dom";
import { getUserPosts } from "service/post.service";
import {useEffect, useMemo} from "react";
import useProfileStore from "../../hooks/stateProfile.store";
import {useInfiniteQuery} from "@tanstack/react-query";
import {getFriends, getUser} from "../../service/user.service";

const ProfilePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const { user } = useAppSelector((state) => state);
  const {userSelected,setUserSelected} = useProfileStore()
  const { userId } = useParams();

  // const { status, hasNextPage, fetchNextPage, characters ,refetch} = useScroll(
  //   (page: number) => getUserPosts(userId as string, page)
  // );

  useEffect(()=>{
    const getUserSelected = async () => {
      if(userId === user._id){
        setUserSelected(user)
      }
      else {
        const response = await getUser(userId);
        const friendResponse = await getFriends(userId ?? user._id)
        const userSelectedRes : IUser = {...response.data,friends:friendResponse.data}
        setUserSelected(userSelectedRes)
      }
    }
    getUserSelected().then(r => r)
  },[])

  const {data, fetchNextPage, status, hasNextPage } =
    useInfiniteQuery(
      ["free-posts"+ userId],
      async ({pageParam = 1}) => {
        const res = await getUserPosts(userId!,pageParam);
        return res;
      },
      {
        getNextPageParam: (lastPage: any) => {
          if (lastPage.pagination.hasNextPage) {
            return lastPage.pagination.currentPage + 1
          } else {
            return false
          }

        },
      }
    );

  let characters = [];

  characters = useMemo(
    () =>

      data?.pages.reduce((prev, page) => {

        return {
          info: page.pagination,
          posts: [...prev.posts, ...page.posts.reverse()],
        };
      }),
    [data]
  );

  return (
    <div>
      <Box sx={{ position: "sticky", top: "0px", zIndex: 999 }}>
        <Navbar />
      </Box>
      {userSelected && <ProfileHeader user={userSelected} />}
      <Box
        display={isNonMobileScreens ? "flex" : "block"}
        gap={"0.5rem"}
        justifyContent={"space-between"}
        mx={"15%"}
      >
        <Box flexBasis={"30%"} mt={"30px"}>
          <Box style={{ position: "sticky", top: "110px", width: "100%" }}>
            <UserWidget user={userSelected!} />
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

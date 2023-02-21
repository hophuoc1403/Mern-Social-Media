import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "index";
import { getFreePosts, getUserPosts } from "../../service/post.service";
import { setPosts } from "../../state";
import { useEffect, useState } from "react";
import PostWidget from "./PostWidget";
import { useScroll } from "../../hooks/useScroll";
import InfiniteScroll from "react-infinite-scroll-component";
import SkeletonPost from "components/SkeletonPost";

interface PostWidgetProps {
  userId: string;
  isProfile?: boolean;
}

const PostsWidget = ({ isProfile = false, userId }: PostWidgetProps) => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const { status, hasNextPage, fetchNextPage, characters, refetch } = useScroll(
    isProfile ? (page: number) => getUserPosts(userId, page) : getFreePosts
  );

  useEffect(() => {
    refetch()
    const initialMount = setTimeout(() => setInitialLoading(false), 800);
    return () => {
      clearTimeout(initialMount);
    };
  }, []);

  // const handleGetFreePost =async () => {
  //   try{
  //     const response = await getFreePosts(currentPage)
  //
  //   }
  // }

  const handleGetUserPosts = async () => {
    try {
      // const response = await getUserPosts(userId)
      // const posts: IPost[] = response.data
      // console.log(response)
      dispatch(setPosts({ posts: posts }));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    console.log("change");
    if (characters) {
      dispatch(setPosts({ posts: [...characters.posts] }));
    }
  }, [characters]);

  return (
    <>
      {initialLoading ? (
        <>
          <SkeletonPost />
          <SkeletonPost />
        </>
      ) : (
        <InfiniteScroll
          next={async () => {
            setTimeout((_: any) => fetchNextPage(), 1500);
          }}
          hasMore={!!hasNextPage}
          loader={<SkeletonPost />}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          dataLength={characters ? characters.posts.length - 1 : 0}
        >
          {status == "success" &&
            posts.map((post: IPost) => <PostWidget key={post._id} {...post} />)}
        </InfiniteScroll>
      )}
    </>
  );
};
export default PostsWidget;

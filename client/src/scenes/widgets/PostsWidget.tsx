import { useAppDispatch, useAppSelector } from "index";
import { getFreePosts, getUserPosts } from "../../service/post.service";
import { setPosts } from "../../state";
import { useEffect, useState } from "react";
import PostWidget from "./PostWidget";
import { useScroll } from "../../hooks/useScroll";
import InfiniteScroll from "react-infinite-scroll-component";
import SkeletonPost from "components/loading/SkeletonPost";
import { Link, useParams } from "react-router-dom";
import {Typography} from "@mui/material";

function arrayEquals(a: any, b: any) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

interface PostWidgetProps {
  status: "error" | "loading" | "success";
  hasNextPage: boolean | undefined;
  characters: any;
  fetchNextPage: any;
}

const PostsWidget = ({
  characters,
  hasNextPage,
  status,
  fetchNextPage,
}: PostWidgetProps) => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    const initialMount = setTimeout(() => setInitialLoading(false), 500);
    return () => {
      clearTimeout(initialMount);
    };
  }, []);

  useEffect(() => {
    if (characters) {
      dispatch(setPosts({ posts: characters.items ? characters.items : [] }));
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
          hasMore={hasNextPage ? !!hasNextPage : false}
          loader={<SkeletonPost />}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          dataLength={characters ? characters.items.length - 1 : 0}
        >
          {status == "success" && (
            <div>
              {posts.map((post: IPost) => (
                <PostWidget key={post.id} {...post} />
              ))}
            </div>
          )}
        </InfiniteScroll>
      )}
    </>
  );
};
export default PostsWidget;

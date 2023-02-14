import {useDispatch} from "react-redux";
import {useAppDispatch, useAppSelector} from "../../App";
import {getFreePosts, getUserPosts} from "../../service/post.service";
import {setPosts} from "../../state";
import {useEffect} from "react";
import PostWidget from "./PostWidget";
import {useScroll} from "../../hooks/useScroll";
import InfiniteScroll from "react-infinite-scroll-component"

interface PostWidgetProps {
  userId: string,
  isProfile?: boolean
}


const PostsWidget = ({isProfile = false, userId}: PostWidgetProps) => {
  const dispatch = useAppDispatch()
  const posts = useAppSelector(state => state.posts)
  const {data, error, status, hasNextPage, fetchNextPage, characters,refetch} = useScroll()

  console.log({characters})

  useEffect(()=>{
    // console.log(characters)
    // dispatch(setPosts({posts:characters.posts}))
    // refetch()
  },[posts])
  const handleGetPosts = async () => {
    try {
      // const response = await getFreePosts()
      // const posts: IPost[] = response.data.posts

      // console.log(response)
      // dispatch(setPosts({posts: characters.posts}))
    await  refetch()
      console.log(refetch())
    } catch (e) {
      console.error(e)
    }
  }
  const handleGetUserPosts = async () => {
    try {
      const response = await getUserPosts(userId)
      const posts: IPost[] = response.data
      console.log(response)
      dispatch(setPosts({posts: posts}))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (isProfile) {
      handleGetUserPosts()
    } else {
      handleGetPosts()
    }
  }, [data])

  return <>
    <PostWidget  {...posts[0]} />
    <InfiniteScroll
       next={async () => {
         setTimeout(_ => fetchNextPage(), 1500)
       }} hasMore={!!hasNextPage} loader={"loading"}  endMessage={
      <p style={{ textAlign: "center" }}>
        <b>Yay! You have seen it all</b>
      </p>
    }
                    dataLength={characters ? characters.posts.length-1 : 0}>
      {status == "success" && characters.posts.map((post: IPost) => (<PostWidget key={post._id} {...post}/>))}
    </InfiniteScroll>
  </>
}
export default PostsWidget
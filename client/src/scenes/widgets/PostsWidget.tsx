import {useDispatch} from "react-redux";
import {useAppDispatch, useAppSelector} from "../../App";
import {getFreePosts, getUserPosts} from "../../service/post.service";
import {setPosts} from "../../state";
import {useEffect, useState} from "react";
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
  const { status, hasNextPage, fetchNextPage, characters,refetch} = useScroll()
  const [currentPage,setCurrentPage] = useState<number>(1)

  // const handleGetFreePost =async () => {
  //   try{
  //     const response = await getFreePosts(currentPage)
  //
  //   }
  // }

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
    console.log("change")
        if(characters){
          dispatch(setPosts({posts:characters.posts}))
        }
  }, [characters])

  console.log({posts})
  return <>
    <InfiniteScroll
       next={async () => {
         setCurrentPage(prevState => prevState+1)
         setTimeout(_ => fetchNextPage(), 1500)
       }} hasMore={!!hasNextPage} loader={"loading"}  endMessage={
      <p style={{ textAlign: "center" }}>
        <b>Yay! You have seen it all</b>
      </p>
    }
                    dataLength={characters ? characters.posts.length-1 : 0}>
      {status == "success" && posts.map((post: IPost) => (<PostWidget key={post._id} {...post}/>))}
    </InfiniteScroll>
  </>
}
export default PostsWidget
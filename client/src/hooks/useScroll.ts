import {useInfiniteQuery} from "@tanstack/react-query";
import {API_BASE_URL} from "../service/AxiosInstance.service";
import {useEffect, useMemo} from "react";
import {getFreePosts} from "../service/post.service";
import {useAppDispatch, useAppSelector} from "index";
import {setPosts} from "../state";

export const useScroll = (fetch:any ) => {
  const dispatch = useAppDispatch()
  const {data, error, fetchNextPage, status, hasNextPage ,refetch} = useInfiniteQuery(['free-posts'],
    async ({pageParam = 1}) => {
      const res =  await fetch(pageParam)
      return res
    }
    ,
    {
      getNextPageParam: (lastPage: any) => {
        console.log({lastPage})
        return  lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : false
      },
      refetchOnMount:true
    },
    
  )
  // console.log(data)
  // @ts-ignore
  // let characters = []
  // const characters = useMemo(() => data !== undefined ? data?.pages.reduce((prev, page) => {
  //     return {
  //       pagination: page.pagination,
  //       posts: [...prev?.posts, ...page?.posts]
  //     }
  //   }, [data]) : []
  // return {
  //   info: page?.info,
  //   results: [...prev?.results, ...page?.results]
  // }
  // )

  let characters = []

   characters = useMemo(() => data?.pages.reduce((prev, page) => {
    
    return {
      info: page.pagination,
      posts: [...prev.posts, ...page.posts.reverse()]
    }
  }), [data])

  

  return {
    error, fetchNextPage, status, hasNextPage,
    data, characters,refetch
  }
}
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useScroll = (fetch: any) => {
  const { data, error, fetchNextPage, status, hasNextPage, refetch } =
    useInfiniteQuery(
      ["free-posts"],
      async ({ pageParam = 1 }) => {
        console.log(fetch);
        const res = await fetch(pageParam);
        console.log(res);
        return res;
      },
      {
        getNextPageParam: (lastPage: any) => {
          return lastPage.pagination.hasNextPage
            ? lastPage.pagination.currentPage + 1
            : false;
        },
        refetchOnMount: true,
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

  return {
    error,
    fetchNextPage,
    status,
    hasNextPage,
    data,
    characters,
    refetch,
  };
};

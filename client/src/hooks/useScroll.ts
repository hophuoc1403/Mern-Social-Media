import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useScroll = (fetch: any) => {
  const { data, error, fetchNextPage, status, hasNextPage, refetch } =
    useInfiniteQuery(
      ["free-posts"],
      async ({ pageParam = 1 }) => {
        const res = await fetch(pageParam);
        return res;
      },
      {
        getNextPageParam: (lastPage: {
          items: IPost[];
          meta: PaginationOptions;
        }) => {
          if (lastPage.meta.currentPage < lastPage.meta.totalPages) {
            return lastPage.meta.currentPage + 1;
          } else {
            return false;
          }
        },
        refetchOnMount: true,
      }
    );

  let characters: any = [];

  characters = useMemo(
    () =>
      data?.pages.reduce((prev, page) => {
        return {
          meta: page.meta,
          items: [...prev.items, ...page.items.reverse()],
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

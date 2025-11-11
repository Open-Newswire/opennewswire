"use client";

import { fetchArticlesForFeedReader } from "@/actions/articles";
import {
  ArticleFeedReaderQuery,
  ArticleFeedReaderQuerySchema,
} from "@/schemas/articles";
import { SearchParams } from "@/types/shared";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";
import { Center, Loader } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { Fragment, useEffect } from "react";
import { Article } from "./Article";

export function ArticleList({ searchParams }: { searchParams: SearchParams }) {
  const query = parseSchemaWithDefaults(
    ArticleFeedReaderQuerySchema,
    searchParams,
  ) as ArticleFeedReaderQuery;
  const { data, fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery({
    queryKey: ["articles", query],
    queryFn: async ({ pageParam: page }) => {
      const [articles, { isLastPage }] = await fetchArticlesForFeedReader({
        ...query,
        page,
        size: 20,
      });

      return { articles, isLastPage };
    },
    initialPageParam: 1,
    getNextPageParam: ({ isLastPage }, __, lastPageParam) =>
      isLastPage ? null : lastPageParam + 1,
  });

  const { ref, entry } = useIntersection({
    rootMargin: "150px",
  });

  useEffect(() => {
    if (!isFetching && hasNextPage && entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, isFetching, hasNextPage, fetchNextPage]);

  return (
    <React.Fragment>
      {data?.pages.map(({ articles }, i) => (
        <Fragment key={i}>
          {articles.map((article, j, arr) => (
            <Article
              article={article}
              key={article.id}
              ref={j === arr.length - 2 ? ref : null}
            />
          ))}
        </Fragment>
      ))}
      <Center h="md" py="lg">
        {isFetching ? <Loader color="blue" type="dots" /> : null}
      </Center>
    </React.Fragment>
  );
}

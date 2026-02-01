"use client";

import {
  ArticleFeedReaderQuery,
  ArticleFeedReaderQuerySchema,
} from "@/domains/articles/schemas";
import { ArticleWithMetadata } from "@/domains/articles/types";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";
import { Center, Loader } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { PageNumberPagination } from "prisma-extension-pagination/dist/types";
import React, { Fragment, useEffect } from "react";
import { Article } from "./Article";

async function fetchArticles(query: ArticleFeedReaderQuery) {
  const params = new URLSearchParams(query as any);
  const res = await fetch(`/api/articles?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to load articles");
  }

  return (await res.json()) as {
    results: ArticleWithMetadata[];
    pagination: PageNumberPagination;
  };
}

export function ArticleList() {
  const searchParams = useSearchParams();
  const paramsAsObject = Object.fromEntries(searchParams.entries());
  const query = parseSchemaWithDefaults(
    ArticleFeedReaderQuerySchema,
    paramsAsObject,
  ) as ArticleFeedReaderQuery;
  const { data, fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery({
    queryKey: ["articles", query],
    queryFn: async ({ pageParam: page }) => {
      const { results, pagination } = await fetchArticles({
        ...query,
        page,
      });

      return { articles: results, isLastPage: pagination.isLastPage };
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

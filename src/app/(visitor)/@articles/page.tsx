import { fetchArticlesForFeedReader } from "@/actions/articles";
import {
  ArticleFeedReaderQuery,
  ArticleFeedReaderQuerySchema,
} from "@/schemas/articles";
import { SearchParams } from "@/types/shared";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ArticleList } from "./ArticleList";

export default async function ArticlesSlot(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const queryClient = new QueryClient();
  const query = parseSchemaWithDefaults(
    ArticleFeedReaderQuerySchema,
    searchParams,
  ) as ArticleFeedReaderQuery;

  await queryClient.prefetchInfiniteQuery({
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
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleList searchParams={searchParams} />
    </HydrationBoundary>
  );
}

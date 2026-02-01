import { fetchArticlesForFeedReader } from "@/domains/articles/actions";
import {
  ArticleFeedReaderQuery,
  ArticleFeedReaderQuerySchema,
} from "@/domains/articles/schemas";
import { SearchParams } from "@/domains/shared/types";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ArticleList } from "@/components/visitor/ArticleList";

export const dynamic = "force-dynamic";

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
      });

      return { articles, isLastPage };
    },
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticleList />
    </HydrationBoundary>
  );
}

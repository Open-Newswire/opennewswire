import { TopArticlesTable } from "@/app/admin/analytics/top-articles/TopArticlesTable";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/schemas/analytics";
import { getTopArticlesPaginated } from "@/services/analytics";
import { SearchParams } from "@/types/shared";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";

export default async function TopSearches(props: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await loadAnalyticsQueryParams(props.searchParams);
  const sanitizedQuery = parseSchemaWithDefaults(
    PaginatedAnalyticsQuerySchema,
    query,
  );
  const data = await getTopArticlesPaginated(sanitizedQuery);

  return <TopArticlesTable data={data} />;
}

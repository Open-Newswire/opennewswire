import { TopArticlesTable } from "@/components/admin/analytics/TopArticlesTable";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/domains/analytics";
import { getTopArticlesPaginated } from "@/domains/analytics/service";
import { SearchParams } from "@/domains/shared/types";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";

export default async function TopArticles(props: {
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

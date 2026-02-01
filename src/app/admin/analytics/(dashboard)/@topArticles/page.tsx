import { TopArticles } from "@/components/admin/analytics/TopArticles";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/domains/analytics";
import { getTopArticles } from "@/domains/analytics/service";
import { SearchParams } from "@/domains/shared/types";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";

export default async function topSearchesSlot(props: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await loadAnalyticsQueryParams(props.searchParams);
  const sanitizedQuery = parseSchemaWithDefaults(
    PaginatedAnalyticsQuerySchema,
    query,
  );
  const topArticles = await getTopArticles(sanitizedQuery);

  return <TopArticles isLoading={false} result={topArticles} />;
}

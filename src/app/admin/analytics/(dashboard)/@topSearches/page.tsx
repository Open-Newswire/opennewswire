import { TopSearches } from "@/components/admin/analytics/TopSearches";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/domains/analytics";
import { getTopSearches } from "@/domains/analytics/service";
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
  const topSearches = await getTopSearches(sanitizedQuery);

  return <TopSearches isLoading={false} result={topSearches} />;
}

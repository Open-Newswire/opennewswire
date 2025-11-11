import { TopSearches } from "@/app/admin/analytics/(dashboard)/@topSearches/TopSearches";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/schemas/analytics";
import { getTopSearches } from "@/services/analytics";
import { SearchParams } from "@/types/shared";
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

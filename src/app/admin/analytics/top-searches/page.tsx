import { TopSearchesTable } from "@/app/admin/analytics/top-searches/TopSearchesTable";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/schemas/analytics";
import { getTopSearchesPaginated } from "@/services/analytics";
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
  const data = await getTopSearchesPaginated(sanitizedQuery);

  return <TopSearchesTable data={data} />;
}

import { Map } from "@/app/admin/analytics/(dashboard)/@locations/Map";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/schemas/analytics";
import { getCountDistinctCountries } from "@/services/analytics";
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
  const result = await getCountDistinctCountries(sanitizedQuery);

  return <Map isLoading={false} result={result} />;
}

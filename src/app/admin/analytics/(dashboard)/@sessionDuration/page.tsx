import { SessionDuration } from "@/components/admin/analytics/SessionDuration";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/domains/analytics";
import { getAverageSessionDuration } from "@/domains/analytics/service";
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
  const duration = await getAverageSessionDuration(sanitizedQuery);

  return <SessionDuration isLoading={false} result={duration} />;
}

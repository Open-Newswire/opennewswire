import { SessionDuration } from "@/app/admin/analytics/(dashboard)/@sessionDuration/SessionDuration";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/schemas/analytics";
import { getAverageSessionDuration } from "@/services/analytics";
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
  const duration = await getAverageSessionDuration(sanitizedQuery);

  return <SessionDuration isLoading={false} result={duration} />;
}

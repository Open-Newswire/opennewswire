import { TotalEvents } from "@/app/admin/analytics/(dashboard)/@totalEvents/TotalEvents";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/schemas/analytics";
import { getTotalEvents } from "@/services/analytics";
import { SearchParams } from "@/types/shared";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";

export default async function totalEventsSlot(props: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await loadAnalyticsQueryParams(props.searchParams);
  const sanitizedQuery = parseSchemaWithDefaults(
    PaginatedAnalyticsQuerySchema,
    query,
  );
  const totalEvents = await getTotalEvents(sanitizedQuery);

  return <TotalEvents isLoading={false} result={totalEvents} />;
}

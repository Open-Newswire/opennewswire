import { EventsTable } from "@/components/admin/analytics/EventsTable";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/domains/analytics";
import { getEvents } from "@/domains/analytics/service";
import { SearchParams } from "@/domains/shared/types";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";

export default async function Events(props: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await loadAnalyticsQueryParams(props.searchParams);
  const sanitizedQuery = parseSchemaWithDefaults(
    PaginatedAnalyticsQuerySchema,
    query,
  );
  const [data, pagination] = await getEvents(sanitizedQuery);

  return <EventsTable data={{ results: data, pagination }} />;
}

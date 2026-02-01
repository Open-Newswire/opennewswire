import { UniqueSessionsByDayChart } from "@/components/admin/analytics/UniqueSessionsByDay";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/domains/analytics";
import { getUniqueSessionsByDay } from "@/domains/analytics/service";
import { SearchParams } from "@/domains/shared/types";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";

export default async function uniqueSessionByDaySlot(props: {
  props(searchParams: Promise<SearchParams>): unknown;
  searchParams: Promise<SearchParams>;
}) {
  const query = await loadAnalyticsQueryParams(props.searchParams);
  const sanitizedQuery = parseSchemaWithDefaults(
    PaginatedAnalyticsQuerySchema,
    query,
  );
  const data = await getUniqueSessionsByDay(sanitizedQuery);

  return <UniqueSessionsByDayChart isLoading={false} result={data} />;
}

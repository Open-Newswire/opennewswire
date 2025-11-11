import { UniqueSessionsByDayChart } from "@/app/admin/analytics/(dashboard)/@uniqueSessionsByDay/UniqueSessionsByDay";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/schemas/analytics";
import { getUniqueSessionsByDay } from "@/services/analytics";
import { SearchParams } from "@/types/shared";
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

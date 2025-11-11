import { UniqueSessions } from "@/app/admin/analytics/(dashboard)/@uniqueSessions/UniqueSessions";
import {
  PaginatedAnalyticsQuerySchema,
  loadAnalyticsQueryParams,
} from "@/schemas/analytics";
import { getUniqueSessions } from "@/services/analytics";
import { SearchParams } from "@/types/shared";
import { parseSchemaWithDefaults } from "@/utils/parse-schema-with-defaults";

export default async function uniqueSessionsSlot(props: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await loadAnalyticsQueryParams(props.searchParams);
  const sanitizedQuery = parseSchemaWithDefaults(
    PaginatedAnalyticsQuerySchema,
    query,
  );
  const count = await getUniqueSessions(sanitizedQuery);

  return <UniqueSessions isLoading={false} result={count} />;
}

import { SortDirection } from "@/domains/shared/types";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export function useSortQueryState(
  defaultSortBy: string,
  defaultSortDirection: SortDirection,
) {
  return useQueryStates(
    {
      sortBy: parseAsString.withDefault(defaultSortBy),
      sortDirection: parseAsStringEnum(
        Object.values(SortDirection),
      ).withDefault(defaultSortDirection),
    },
    { shallow: false },
  );
}

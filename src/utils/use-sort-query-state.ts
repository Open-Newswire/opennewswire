import { SortDirection } from "@/types/query";
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

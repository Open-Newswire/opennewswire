import { SortDirection } from "@/domains/shared/types";
import { useSortQueryState } from "@/utils/use-sort-query-state";
import { parseAsInteger, useQueryState } from "nuqs";

export function useArticlesTable() {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [size, setSize] = useQueryState(
    "size",
    parseAsInteger.withDefault(10).withOptions({ shallow: false }),
  );
  const [sort, setSort] = useSortQueryState("date", SortDirection.Desc);

  return {
    sort,
    setSort,
    page,
    setPage,
    size,
    setSize,
  };
}

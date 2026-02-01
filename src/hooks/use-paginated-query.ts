"use client";

import { PaginatedQueryParsers } from "@/domains/shared/schemas";
import { useQueryStates } from "nuqs";

export function usePaginatedQuery() {
  return useQueryStates(PaginatedQueryParsers, { shallow: false });
}

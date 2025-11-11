"use client";

import { PaginatedQueryParsers } from "@/schemas/shared";
import { useQueryStates } from "nuqs";

export function usePaginatedQuery() {
  return useQueryStates(PaginatedQueryParsers, { shallow: false });
}

import {
  PageNumberCounters,
  PageNumberPagination,
} from "prisma-extension-pagination/dist/types";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export type PaginationMeta = PageNumberPagination & PageNumberCounters;

export interface PaginatedData<T> {
  results: T[];
  pagination: {
    pageCount: number;
    totalCount: number;
  };
}

export type LoadingResult<T> =
  | { isLoading: true }
  | { isLoading: false; result: T };

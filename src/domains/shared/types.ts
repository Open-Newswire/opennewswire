import "@tanstack/react-table";
import { RowData } from "@tanstack/react-table";
import {
  PageNumberCounters,
  PageNumberPagination,
} from "prisma-extension-pagination/dist/types";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    displayName?: string;
    hiddenByDefault?: boolean;
    headClassName?: string;
  }
}

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

export enum SortDirection {
  None = "none",
  Asc = "asc",
  Desc = "desc",
}

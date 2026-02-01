"use client";

import { AnalyticsFilterBar } from "@/components/admin/analytics/AnalyticsFilterBar";
import { columns } from "./top-searches-columns";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { usePaginatedQuery } from "@/hooks/use-paginated-query";
import { TopSearchesCount } from "@/domains/analytics";
import { PaginatedData } from "@/domains/shared/types";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

export function TopSearchesTable({
  data,
}: {
  data: PaginatedData<TopSearchesCount>;
}) {
  const [{ page, size }, setPagination] = usePaginatedQuery();
  const table = useReactTable({
    data: data.results,
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: size,
      },
    },
    pageCount: data.pagination.pageCount,
    rowCount: data.pagination.totalCount,
    onPaginationChange: (updater) => {
      // make sure updater is callable (to avoid typescript warning)
      if (typeof updater !== "function") return;

      const newPageInfo = updater(table.getState().pagination);

      setPagination({
        page: newPageInfo.pageIndex + 1,
        size: newPageInfo.pageSize,
      });
    },
  });

  return (
    <>
      <AnalyticsFilterBar />
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </>
  );
}

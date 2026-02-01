"use client";

import { AnalyticsFilterBar } from "@/components/admin/analytics/AnalyticsFilterBar";
import { columns } from "@/components/admin/analytics/TopArticlesColumns";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { TopArticleCount } from "@/domains/analytics";
import { PaginatedData } from "@/domains/shared/types";
import { usePaginatedQuery } from "@/hooks/use-paginated-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

export function TopArticlesTable({
  data,
  showFilterBar = true,
}: {
  data: PaginatedData<TopArticleCount>;
  showFilterBar?: boolean;
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
      {showFilterBar ? <AnalyticsFilterBar /> : null}
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </>
  );
}

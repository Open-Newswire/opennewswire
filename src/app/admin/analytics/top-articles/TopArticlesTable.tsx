"use client";

import { AnalyticsFilterBar } from "@/app/admin/analytics/(shared)/AnalyticsFilterBar";
import { columns } from "@/app/admin/analytics/top-articles/columns";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { usePaginatedQuery } from "@/hooks/use-paginated-query";
import { TopArticleCount } from "@/types/analytics";
import { PaginatedData } from "@/types/shared";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

export function TopArticlesTable({
  data,
}: {
  data: PaginatedData<TopArticleCount>;
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

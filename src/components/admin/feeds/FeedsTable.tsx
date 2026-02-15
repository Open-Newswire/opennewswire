"use client";

import { columns } from "@/components/admin/feeds/columns";
import { FeedsFilterBar } from "@/components/admin/feeds/FeedsFilterBar";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { FeedsWithLicenseAndLanguage } from "@/domains/feeds/types";
import { PaginationMeta, SortDirection } from "@/domains/shared/types";
import { usePaginatedQuery } from "@/hooks/use-paginated-query";
import { useSortQueryState } from "@/utils/use-sort-query-state";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useLocalStorage } from "usehooks-ts";

export function FeedsTable({
  feeds,
  pagination,
}: {
  feeds: FeedsWithLicenseAndLanguage[];
  pagination: PaginationMeta;
}) {
  const [{ page, size }, setPagination] = usePaginatedQuery();
  const [sort, setSort] = useSortQueryState("title", SortDirection.Asc);
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "feeds-table-col-visibility",
    {},
  );

  const table = useReactTable({
    data: feeds,
    columns,
    manualPagination: true,
    manualSorting: true,
    enableMultiRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: size,
      },
      sorting: [
        {
          id: sort.sortBy,
          desc: sort.sortDirection === SortDirection.Desc,
        },
      ],
      columnVisibility,
    },
    pageCount: pagination.pageCount,
    rowCount: pagination.totalCount,
    onPaginationChange: (updater) => {
      if (typeof updater !== "function") return;

      const newPageInfo = updater(table.getState().pagination);

      setPagination({
        page: newPageInfo.pageIndex + 1,
        size: newPageInfo.pageSize,
      });
    },
    onSortingChange: (updater) => {
      if (typeof updater !== "function") return;

      const newSortInfo = updater(table.getState().sorting);

      setSort({
        sortBy: newSortInfo[0]?.id,
        sortDirection: newSortInfo[0]?.desc
          ? SortDirection.Desc
          : SortDirection.Asc,
      });
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <>
      <FeedsFilterBar accessory={<DataTableViewOptions table={table} />} />
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </>
  );
}

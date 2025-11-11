"use client";

import { LanguagesFilterBar } from "@/app/admin/languages/LanguagesFilterBar";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { usePaginatedQuery } from "@/hooks/use-paginated-query";
import { Language } from "@/types/languages";
import { SortDirection } from "@/types/query";
import { PaginationMeta } from "@/types/shared";
import { useSortQueryState } from "@/utils/use-sort-query-state";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useLocalStorage } from "usehooks-ts";
import { columns } from "./columns";

export function LanguagesTable({
  languages,
  pagination,
}: {
  languages: Language[];
  pagination: PaginationMeta;
}) {
  const [{ page, size }, setPagination] = usePaginatedQuery();
  const [sort, setSort] = useSortQueryState("order", SortDirection.Asc);
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "languages-table-col-visibility",
    {},
  );

  const table = useReactTable({
    data: languages,
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
      // make sure updater is callable (to avoid typescript warning)
      if (typeof updater !== "function") return;

      const newPageInfo = updater(table.getState().pagination);

      setPagination({
        page: newPageInfo.pageIndex + 1,
        size: newPageInfo.pageSize,
      });
    },
    onSortingChange: (updater) => {
      // make sure updater is callable (to avoid typescript warning)
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
      <LanguagesFilterBar accessory={<DataTableViewOptions table={table} />} />
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </>
  );
}

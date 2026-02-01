"use client";

import { AnalyticsFilterBar } from "@/components/admin/analytics/AnalyticsFilterBar";
import { columns } from "./events-columns";
import { EventDetailsSidebar } from "@/components/admin/analytics/EventDetailsSidebar";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { useInspector } from "@/components/ui/inspector";
import { usePaginatedQuery } from "@/hooks/use-paginated-query";
import { SortDirection, PaginatedData } from "@/domains/shared/types";
import { useSortQueryState } from "@/utils/use-sort-query-state";
import { AnalyticsEvent } from "@prisma/client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export function EventsTable({ data }: { data: PaginatedData<AnalyticsEvent> }) {
  const { showInspector, open, dismissInspector } = useInspector();
  const [{ page, size }, setPagination] = usePaginatedQuery();
  const [sort, setSort] = useSortQueryState("occuredAt", SortDirection.Desc);
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "events-table-col-visibility",
    {},
  );

  // Row selection state
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // Helper to get row id from event
  const getRowId = useCallback((row: AnalyticsEvent) => row.id, []);

  // When inspector closes, clear selection
  useEffect(() => {
    if (!open) {
      setRowSelection({});
    }
  }, [open]);

  const table = useReactTable({
    data: data.results,
    columns,
    manualPagination: true,
    manualSorting: true,
    enableMultiRowSelection: false,
    enableRowSelection: true,
    getRowId,
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
      rowSelection,
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
    onRowSelectionChange: setRowSelection,
  });

  const handleSelect = useCallback(
    (item: AnalyticsEvent) => {
      // Select the row
      setRowSelection({ [item.id]: true });
      showInspector(<EventDetailsSidebar event={item} />);
    },
    [showInspector],
  );

  return (
    <>
      <AnalyticsFilterBar accessory={<DataTableViewOptions table={table} />} />
      <DataTable table={table} onSelect={handleSelect} />
      <DataTablePagination table={table} />
    </>
  );
}

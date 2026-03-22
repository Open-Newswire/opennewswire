"use client";

import { columns } from "@/components/admin/jobs/columns";
import { JobsFilterBar } from "@/components/admin/jobs/JobsFilterBar";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { PaginationMeta, SortDirection } from "@/domains/shared/types";
import { SyncJobWithFeed } from "@/domains/jobs/types";
import { usePaginatedQuery } from "@/hooks/use-paginated-query";
import { useSortQueryState } from "@/utils/use-sort-query-state";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";

export function JobsTable({
  jobs,
  pagination,
}: {
  jobs: SyncJobWithFeed[];
  pagination: PaginationMeta;
}) {
  const [{ page, size }, setPagination] = usePaginatedQuery();
  const [sort, setSort] = useSortQueryState("triggeredAt", SortDirection.Desc);
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "jobs-table-col-visibility",
    {},
  );
  const router = useRouter();

  const table = useReactTable({
    data: jobs,
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
      <JobsFilterBar accessory={<DataTableViewOptions table={table} />} />
      <DataTable
        table={table}
        onSelect={(job) => router.push(`/admin/jobs/${job.id}`)}
      />
      <DataTablePagination table={table} />
    </>
  );
}

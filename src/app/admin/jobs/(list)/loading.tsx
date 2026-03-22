"use client";

import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

export default function Loading() {
  const mockData = Array.from({ length: 10 }, (_, i) => ({ id: `loading-${i}` }));

  const mockColumns = [
    {
      accessorKey: "feed",
      header: "Feed",
      cell: () => <Skeleton className="h-4 w-32" />,
      meta: { displayName: "Feed", headClassName: "w-[30%]" },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: () => <Skeleton className="h-5 w-20" />,
      meta: { displayName: "Status", headClassName: "w-[25%]" },
    },
    {
      accessorKey: "trigger",
      header: "Trigger",
      cell: () => <Skeleton className="h-5 w-20" />,
      meta: { displayName: "Trigger", headClassName: "w-[15%]" },
    },
    {
      accessorKey: "triggeredAt",
      header: "Triggered At",
      cell: () => <Skeleton className="h-4 w-28" />,
      meta: { displayName: "Triggered At", headClassName: "w-[30%]" },
    },
  ];

  const table = useReactTable({
    data: mockData,
    columns: mockColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <FilterBar accessory={<Skeleton className="h-8 w-28" />}>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </FilterBar>
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </>
  );
}

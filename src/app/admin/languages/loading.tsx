"use client";

import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

export default function Loading() {
  // Create mock data for the skeleton
  const mockData = Array.from({ length: 5 }, (_, i) => ({
    id: `loading-${i}`,
    name: "",
    slug: "",
    isRtl: false,
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const mockColumns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: () => <Skeleton className="h-4 w-32" />,
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: () => <Skeleton className="h-4 w-24" />,
    },
    {
      accessorKey: "isRtl",
      header: "RTL",
      cell: () => <Skeleton className="h-4 w-4" />,
    },
    {
      accessorKey: "order",
      header: "Order",
      cell: () => <Skeleton className="h-4 w-8" />,
    },
    {
      id: "actions",
      header: "",
      cell: () => <Skeleton className="h-8 w-8 rounded" />,
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
        <Skeleton className="h-9 w-80" />
        <Skeleton className="h-8 w-28" />
      </FilterBar>
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </>
  );
}

"use client";

import { FilterBar } from "@/components/shared/FilterBar";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

export default function Loading() {
  const mockData = Array.from({ length: 10 }, (_, i) => ({
    id: `loading-${i}`,
    title: "",
    link: "",
    date: new Date(),
    content: "",
    isHidden: false,
    feed: {
      id: "",
      title: "",
      iconSource: null,
      iconUrl: null,
      iconAssetUrl: null,
    },
    feedId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const mockColumns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: () => (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 relative">
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-48 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ),
      meta: {
        displayName: "Title",
        headClassName: "w-[35%]",
      },
    },
    {
      accessorKey: "date",
      header: "Publication Date",
      cell: () => <Skeleton className="h-4 w-24" />,
      meta: {
        displayName: "Publication Date",
        headClassName: "w-[15%]",
      },
    },
    {
      accessorKey: "feed.title",
      header: "Feed",
      cell: () => <Skeleton className="h-4 w-32" />,
      meta: {
        displayName: "Feed",
        headClassName: "w-[20%]",
      },
    },
    {
      accessorKey: "content",
      header: "Content",
      cell: () => <Skeleton className="h-4 w-64" />,
      meta: {
        displayName: "Content",
        headClassName: "w-[30%]",
      },
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
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20" />
        </div>
      </FilterBar>
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </>
  );
}

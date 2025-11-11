"use client";

import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Zap } from "lucide-react";

export default function Loading() {
  // Create mock data for the skeleton
  const mockData = Array.from({ length: 5 }, (_, i) => ({
    id: `loading-${i}`,
    name: "",
    slug: "",
    backgroundColor: "",
    textColor: "",
    symbols: "",
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
      accessorKey: "preview",
      header: "Preview",
      cell: () => <Skeleton className="h-6 w-20" />,
    },
    {
      id: "actions",
      header: () => (
        <div className="flex items-center justify-center">
          <Zap className="h-4 w-4" />
        </div>
      ),
      cell: () => <Skeleton className="h-8 w-8 rounded" />,
      meta: {
        headClassName: "w-[50px]",
      },
    },
  ];

  const table = useReactTable({
    data: mockData,
    columns: mockColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} />;
}

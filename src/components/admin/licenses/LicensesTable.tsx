"use client";

import { columns } from "@/components/admin/licenses/columns";
import { DataTable } from "@/components/ui/data-table";
import { License } from "@/lib/prisma-client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

export function LicensesTable({ licenses }: { licenses: License[] }) {
  const table = useReactTable({
    data: licenses,
    columns,
    enableMultiRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} />;
}

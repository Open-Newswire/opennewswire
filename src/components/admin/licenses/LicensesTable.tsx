"use client";

import { DataTable } from "@/components/ui/data-table";
import { License } from "@prisma/client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { columns } from "@/components/admin/licenses/columns";

export function LicensesTable({ licenses }: { licenses: License[] }) {
  const table = useReactTable({
    data: licenses,
    columns,
    enableMultiRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} />;
}

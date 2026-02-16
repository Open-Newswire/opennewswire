"use client";

import { DataTable } from "@/components/ui/data-table";
import { User } from "@/domains/users/types";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { columns } from "@/components/admin/users/columns";

export function UsersTable({ users }: { users: User[] }) {
  const table = useReactTable({
    data: users,
    columns,
    enableMultiRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} />;
}

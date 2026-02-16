"use client";

import { User } from "@/domains/users/types";
import { ColumnDef } from "@tanstack/react-table";
import { Zap } from "lucide-react";
import { UsersActionMenu } from "./UsersActionMenu";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
    meta: {
      displayName: "Name",
      headClassName: "w-[40%]",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      displayName: "Email",
      headClassName: "w-[55%]",
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="flex items-center justify-center">
        <Zap className="h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      return <UsersActionMenu user={row.original} />;
    },
    meta: {
      headClassName: "w-[50px]",
    },
  },
];

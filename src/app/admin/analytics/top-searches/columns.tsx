import { TopSearchesCount } from "@/types/analytics";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TopSearchesCount>[] = [
  {
    accessorKey: "normalizedQuery",
    header: "Query",
    meta: {
      headClassName: "w-3/4",
    },
  },
  {
    accessorKey: "count",
    header: "Count",
    meta: {
      headClassName: "w-1/4",
    },
  },
];

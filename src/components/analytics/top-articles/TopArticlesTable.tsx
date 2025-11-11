"use client";

import { FeedIcon } from "@/components/feeds/FeedIcon";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TopArticleCount } from "@/types/analytics";
import { Table } from "@mantine/core";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";

const columns: ColumnDef<TopArticleCount>[] = [
  {
    accessorKey: "title",
    header: "Article",
    cell: (props) => {
      const feed = props.row.original.feed!;

      return (
        <Link
          target="_blank"
          href={props.row.original.link!}
          className="underline"
        >
          <FeedIcon
            source={feed.iconSource}
            faviconUrl={feed.iconUrl}
            assetUrl={feed.iconAssetUrl}
            display="inline-block"
            mr="0.5rem"
            style={{ verticalAlign: "bottom" }}
          />
          {props.row.original.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "count",
    header: "Count",
  },
  {
    accessorKey: "feed.title",
    header: "Feed",
    cell: (props) => {
      return (
        <Link
          href={`/admin/feeds/${props.row.original.feed?.id}`}
          className="underline"
        >
          {props.row.original.feed?.title}
        </Link>
      );
    },
  },
];

interface TopArticlesTableProps {
  data: TopArticleCount[];
  isLoading?: boolean;
}

export function TopArticlesTable(props: TopArticlesTableProps) {
  const table = useReactTable({
    data: props.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

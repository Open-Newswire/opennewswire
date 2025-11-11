"use client";

import { ArticlesFilterBar } from "@/app/admin/articles/ArticlesFilterBar";
import { columns } from "@/app/admin/articles/columns";
import { useArticlesTable } from "@/components/articles/use-article-table";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { ArticleWithFeedLicenseAndLanguage } from "@/types/article";
import { SortDirection } from "@/types/query";
import { PaginationMeta } from "@/types/shared";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useLocalStorage } from "usehooks-ts";

export function ArticlesTable({
  articles,
  pagination,
}: {
  articles: ArticleWithFeedLicenseAndLanguage[];
  pagination: PaginationMeta;
}) {
  const { sort, setSort, page, setPage, size, setSize } = useArticlesTable();

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    "articles-table-col-visibility",
    {},
  );

  const table = useReactTable({
    data: articles,
    columns,
    manualPagination: true,
    manualSorting: true,
    enableMultiRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: size,
      },
      sorting: [
        {
          id: sort.sortBy,
          desc: sort.sortDirection === SortDirection.Desc,
        },
      ],
      columnVisibility,
    },
    pageCount: pagination.pageCount,
    rowCount: pagination.totalCount,
    onPaginationChange: (updater) => {
      // make sure updater is callable (to avoid typescript warning)
      if (typeof updater !== "function") return;

      const newPageInfo = updater(table.getState().pagination);

      setPage(newPageInfo.pageIndex + 1);
      setSize(newPageInfo.pageSize);
    },
    onSortingChange: (updater) => {
      // make sure updater is callable (to avoid typescript warning)
      if (typeof updater !== "function") return;

      const newSortInfo = updater(table.getState().sorting);

      setSort({
        sortBy: newSortInfo[0]?.id,
        sortDirection: newSortInfo[0]?.desc
          ? SortDirection.Desc
          : SortDirection.Asc,
      });
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <>
      <ArticlesFilterBar accessory={<DataTableViewOptions table={table} />} />
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </>
  );
}

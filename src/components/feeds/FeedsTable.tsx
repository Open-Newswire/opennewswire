"use client";

import {
  LanguageFeedFilter,
  LicenseFeedFilter,
  StatusFeedFilter,
} from "@/components/feeds/FeedsFilters";
import { FeedsTableRow } from "@/components/feeds/FeedsTableRow";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { SearchTextInput } from "@/components/shared/SearchTextInput";
import {
  TableThAction,
  TableThSortGroup,
  TableThSortNew,
} from "@/components/Table";
import { FeedsWithLicenseAndLanguage } from "@/types/feeds";
import { SortDirection } from "@/types/query";
import { PaginationMeta } from "@/types/shared";
import { useSortQueryState } from "@/utils/use-sort-query-state";
import { Table, TableTbody, TableThead, TableTr } from "@mantine/core";
import { parseAsInteger, useQueryState } from "nuqs";

export function FeedsTable({
  feeds,
  pagination,
}: {
  feeds: FeedsWithLicenseAndLanguage[];
  pagination: PaginationMeta;
}) {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    shallow: false,
  });
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "all",
    shallow: false,
  });
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [size, setSize] = useQueryState(
    "size",
    parseAsInteger.withDefault(10).withOptions({ shallow: false }),
  );
  const [language, setLanguage] = useQueryState("language", { shallow: false });
  const [license, setLicense] = useQueryState("license", { shallow: false });
  const [sort, setSort] = useSortQueryState("title", SortDirection.Asc);
  const rows = feeds.map((feed) => <FeedsTableRow key={feed.id} feed={feed} />);

  return (
    <>
      {/* Filter Bar */}
      <FilterBar>
        <SearchTextInput
          size="xs"
          w="20rem"
          placeholder="Search feeds..."
          value={search}
          onChange={(ev) => {
            setSearch(ev.target.value);
          }}
        />
        <LanguageFeedFilter value={language} onChange={setLanguage} />
        <LicenseFeedFilter value={license} onChange={setLicense} />
        <StatusFeedFilter value={status} onChange={setStatus} />
      </FilterBar>
      {/* Table */}
      <Table layout="fixed" highlightOnHover>
        <TableThead>
          <TableTr>
            <TableThSortGroup sort={sort} onChange={setSort}>
              <TableThSortNew w="30%" sortField="title">
                Title
              </TableThSortNew>
              <TableThSortNew w="40%" sortField="url">
                URL
              </TableThSortNew>
              <TableThSortNew w="15%" sortField="license">
                License
              </TableThSortNew>
              <TableThSortNew w="15%" sortField="language">
                Language
              </TableThSortNew>
              <TableThAction w="50px" />
            </TableThSortGroup>
          </TableTr>
        </TableThead>
        <TableTbody>{rows}</TableTbody>
      </Table>
      {/* Pagination */}
      <PaginationBar
        noun="feeds"
        page={page}
        size={size}
        totalPages={pagination.pageCount}
        totalItems={pagination.totalCount}
        onPageChange={setPage}
        onSizeChange={setSize}
      />
    </>
  );
}

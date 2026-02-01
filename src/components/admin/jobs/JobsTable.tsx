"use client";

import { JobsTableFilters } from "@/components/admin/jobs/JobsFilters";
import { PaginationBar } from "@/components/shared/PaginationBar";
import { TableThSortGroup, TableThSortNew } from "@/components/Table";
import { SortDirection } from "@/domains/shared/types";
import { PaginationMeta } from "@/domains/shared/types";
import { SyncJobWithFeed } from "@/domains/jobs/types";
import { useSortQueryState } from "@/utils/use-sort-query-state";
import {
  Badge,
  Group,
  Skeleton,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
} from "@mantine/core";
import { Status, SyncJob } from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { StatusChip } from "@/components/admin/jobs/StatusChip";
import { TriggerChip } from "@/components/admin/jobs/TriggerChip";

export function JobsTableHeader({ children }: { children: React.ReactNode }) {
  const [sort, setSort] = useSortQueryState("triggeredAt", SortDirection.Desc);

  return (
    <Table layout="fixed" highlightOnHover>
      <TableThead>
        <TableTr>
          <TableThSortGroup sort={sort} onChange={setSort}>
            <TableTh>Feed</TableTh>
            <TableThSortNew sortField="status">Status</TableThSortNew>
            <TableThSortNew sortField="trigger">Trigger</TableThSortNew>
            <TableThSortNew sortField="triggeredAt">
              Triggered At
            </TableThSortNew>
          </TableThSortGroup>
        </TableTr>
      </TableThead>
      <TableTbody>{children}</TableTbody>
    </Table>
  );
}

function StatusIndicator({ job }: { job: SyncJob }) {
  if (job.status !== Status.COMPLETED && job.parentId === null) {
    return <StatusChip status={job.status} />;
  }

  return (
    <Group gap="4">
      <StatusChip status={job.status} />
      {job.totalSuccess ? (
        <Badge color="green" variant="dot">
          {job.totalSuccess}
        </Badge>
      ) : null}
      {job.totalFailure ? (
        <Badge color="red" variant="dot">
          {job.totalFailure}
        </Badge>
      ) : null}
    </Group>
  );
}

function JobsTableRow({
  job,
  onClick,
}: {
  job: SyncJobWithFeed;
  onClick: (id: string) => void;
}) {
  const handleClick = onClick.bind(null, job.id);

  return (
    <TableTr style={{ cursor: "pointer" }}>
      <TableTd onClick={handleClick}>
        {job.feed?.title ?? (
          <Text size="sm" fs="italic">
            All Feeds
          </Text>
        )}
      </TableTd>
      <TableTd onClick={handleClick}>
        <StatusIndicator job={job} />
      </TableTd>
      <TableTd onClick={handleClick}>
        <TriggerChip trigger={job.trigger} />
      </TableTd>
      <TableTd onClick={handleClick}>{format(job.triggeredAt, "PP p")}</TableTd>
    </TableTr>
  );
}

export function JobsTableLoadingRow() {
  return (
    <TableTr>
      <TableTd>
        <Skeleton height={8} mt={6} radius="xl" />
      </TableTd>
      <TableTd>
        <Skeleton height={8} mt={6} radius="xl" />
      </TableTd>
      <TableTd>
        <Skeleton height={8} mt={6} radius="xl" />
      </TableTd>
      <TableTd>
        <Skeleton height={8} mt={6} radius="xl" />
      </TableTd>
    </TableTr>
  );
}

export function JobsTableLoadingFilters() {
  return <JobsTableFilters isLoading={true} />;
}

export function JobsTable({
  jobs,
  pagination,
  isLoading,
}: {
  jobs: SyncJobWithFeed[];
  pagination: PaginationMeta;
  isLoading?: boolean;
}) {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [size, setSize] = useQueryState(
    "size",
    parseAsInteger.withDefault(10).withOptions({ shallow: false }),
  );

  const router = useRouter();
  const onClick = (id: string) => router.push(`/admin/jobs/${id}`);
  const rows = jobs.map((job) => {
    return <JobsTableRow key={job.id} job={job} onClick={onClick} />;
  });

  return (
    <>
      <JobsTableFilters isLoading={isLoading} />
      <JobsTableHeader>{rows}</JobsTableHeader>
      <PaginationBar
        noun="jobs"
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

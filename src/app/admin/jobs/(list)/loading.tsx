import {
  JobsTableHeader,
  JobsTableLoadingFilters,
  JobsTableLoadingRow,
} from "@/components/admin/jobs/JobsTable";

export default function Loading() {
  return (
    <>
      <JobsTableLoadingFilters />
      <JobsTableHeader>
        <JobsTableLoadingRow />
        <JobsTableLoadingRow />
        <JobsTableLoadingRow />
        <JobsTableLoadingRow />
      </JobsTableHeader>
    </>
  );
}

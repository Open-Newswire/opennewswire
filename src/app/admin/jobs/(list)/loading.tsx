import {
  JobsTableHeader,
  JobsTableLoadingFilters,
  JobsTableLoadingRow,
} from "../../../../components/jobs/JobsTable";

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

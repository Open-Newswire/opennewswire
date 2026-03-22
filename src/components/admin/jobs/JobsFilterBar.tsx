"use client";

import { FilterBar } from "@/components/shared/FilterBar";
import { DataTableFacetedFilter } from "@/components/ui/data-table-filter";
import { Circle, Zap } from "lucide-react";
import { useQueryState } from "nuqs";
import { ReactNode } from "react";

const statusOptions = [
  { value: "not-started", label: "Not Started" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const triggerOptions = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
];

export function JobsFilterBar({ accessory }: { accessory?: ReactNode }) {
  const [status, setStatus] = useQueryState("status", {
    shallow: false,
  });
  const [trigger, setTrigger] = useQueryState("trigger", {
    shallow: false,
  });

  return (
    <FilterBar accessory={accessory}>
      <DataTableFacetedFilter
        title="Trigger"
        allLabel="All Triggers"
        value={trigger}
        onChange={setTrigger}
        options={triggerOptions}
        icon={<Zap />}
      />
      <DataTableFacetedFilter
        title="Status"
        allLabel="All Statuses"
        value={status}
        onChange={setStatus}
        options={statusOptions}
        icon={<Circle />}
      />
    </FilterBar>
  );
}

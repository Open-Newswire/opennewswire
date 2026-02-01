import { FilterBar } from "@/components/shared/FilterBar";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { IconBolt, IconPlayerRecordFilled } from "@tabler/icons-react";
import { useQueryState } from "nuqs";

const statusOptions = [
  {
    value: "not-started",
    label: "Not Started",
  },
  {
    value: "in-progress",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "failed",
    label: "Failed",
  },
];

const triggerOptions = [
  {
    value: "manual",
    label: "Manual",
  },
  {
    value: "automatic",
    label: "Automatic",
  },
];

export function JobsTableFilters({ isLoading }: { isLoading?: boolean }) {
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "all",
    shallow: false,
  });
  const [trigger, setTrigger] = useQueryState("trigger", {
    defaultValue: "all",
    shallow: false,
  });

  return (
    <FilterBar>
      <FilterSelect
        value={trigger}
        onChange={setTrigger}
        data={triggerOptions}
        defaultOption={{ value: "all", label: "All Triggers" }}
        leftSection={<IconBolt size={14} />}
        isLoading={isLoading}
      />
      <FilterSelect
        value={status}
        onChange={setStatus}
        data={statusOptions}
        defaultOption={{ value: "all", label: "All Statuses" }}
        leftSection={<IconPlayerRecordFilled size={14} />}
        isLoading={isLoading}
      />
    </FilterBar>
  );
}

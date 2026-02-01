import {
  FilterSelect,
  FilterSelectOption,
} from "@/components/shared/FilterSelect";
import { FeedStatus } from "@/domains/feeds/types";
import { Language } from "@/domains/languages/types";
import { License } from "@/domains/licenses/types";
import {
  IconCopyright,
  IconLanguage,
  IconPlayerRecordFilled,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

const statusOptions = [
  {
    value: FeedStatus.active,
    label: "Active",
  },
  {
    value: FeedStatus.inactive,
    label: "Inactive",
  },
];

export function StatusFeedFilter({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <FilterSelect
      value={value}
      onChange={onChange}
      data={statusOptions}
      defaultOption={{ value: FeedStatus.all, label: "All Statuses" }}
      leftSection={<IconPlayerRecordFilled size={14} />}
    />
  );
}

export function LanguageFeedFilter({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [options, setOptions] = useState<FilterSelectOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/languages");
      const json = (await response.json()) as Language[];
      const selectValues = json.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setOptions(selectValues);
    };

    fetchData();
  }, []);

  return (
    <FilterSelect
      value={value}
      onChange={onChange}
      data={options}
      defaultOption={{ value: "all", label: "All Languages" }}
      leftSection={<IconLanguage size={14} />}
    />
  );
}

export function LicenseFeedFilter({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [options, setOptions] = useState<FilterSelectOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/licenses");
      const json = (await response.json()) as License[];
      const selectValues = json.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setOptions(selectValues);
    };

    fetchData();
  }, []);

  return (
    <FilterSelect
      value={value}
      onChange={onChange}
      data={options}
      defaultOption={{ value: "all", label: "All Licenses" }}
      leftSection={<IconCopyright size={14} />}
    />
  );
}

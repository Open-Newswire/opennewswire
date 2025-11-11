"use client";

import { FilterBar } from "@/components/shared/FilterBar";
import { DataTableFacetedFilter } from "@/components/ui/data-table-filter";
import { SearchInput } from "@/components/ui/search-input";
import { ArrowLeftRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { ReactNode } from "react";

const directionOptions = [
  {
    value: "rtl",
    label: "RTL",
  },
  {
    value: "ltr",
    label: "LTR",
  },
];

export function LanguagesFilterBar({ accessory }: { accessory?: ReactNode }) {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    shallow: false,
  });
  const [direction, setDirection] = useQueryState("direction", {
    shallow: false,
  });
  return (
    <FilterBar accessory={accessory}>
      <SearchInput
        placeholder="Search languages..."
        value={search}
        onChange={(ev) => {
          setSearch(ev.target.value);
        }}
        className="w-80"
      />
      <DataTableFacetedFilter
        title="Direction"
        allLabel="Both Directions"
        value={direction}
        onChange={setDirection}
        options={directionOptions}
        icon={<ArrowLeftRight />}
      />
    </FilterBar>
  );
}

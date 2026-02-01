"use client";

import { FilterBar } from "@/components/shared/FilterBar";
import { DataTableFacetedFilter } from "@/components/ui/data-table-filter";
import { SearchInput } from "@/components/ui/search-input";
import { ArticleVisibility } from "@/domains/articles/types";
import { FeedStatus } from "@/domains/feeds/types";
import { useFilterOptions } from "@/utils/use-filter-options";
import { Circle, CreativeCommons, Eye, Languages } from "lucide-react";
import { useQueryState } from "nuqs";
import { ReactNode } from "react";

const visibilityOptions = [
  {
    value: ArticleVisibility.hidden,
    label: "Hidden",
  },
  {
    value: ArticleVisibility.visible,
    label: "Visible",
  },
];

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

export function ArticlesFilterBar({ accessory }: { accessory?: ReactNode }) {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    shallow: false,
  });
  const [visibility, setVisibility] = useQueryState("visibility", {
    shallow: false,
  });
  const [status, setStatus] = useQueryState("feedStatus", {
    shallow: false,
  });
  const [language, setLanguage] = useQueryState("language", {
    shallow: false,
  });
  const [license, setLicense] = useQueryState("license", {
    shallow: false,
  });

  const languages = useFilterOptions<{ id: string; name: string }>(
    "/api/languages",
    (l) => ({
      value: l.id,
      label: l.name,
    }),
  );

  const licenses = useFilterOptions<{ id: string; name: string }>(
    "/api/licenses",
    (l) => ({
      value: l.id,
      label: l.name,
    }),
  );

  return (
    <FilterBar accessory={accessory}>
      <SearchInput
        placeholder="Search articles..."
        value={search}
        onChange={(ev) => {
          setSearch(ev.target.value);
        }}
        className="w-80"
      />
      <DataTableFacetedFilter
        title="Visibility"
        allLabel="Any Visibility"
        value={visibility}
        onChange={setVisibility}
        options={visibilityOptions}
        icon={<Eye />}
      />
      <DataTableFacetedFilter
        title="Status"
        allLabel="Any Status"
        value={status}
        onChange={setStatus}
        options={statusOptions}
        icon={<Circle />}
      />
      <DataTableFacetedFilter
        searchable
        title="Language"
        allLabel="All Languages"
        value={language}
        onChange={setLanguage}
        options={languages}
        icon={<Languages />}
      />
      <DataTableFacetedFilter
        searchable
        title="License"
        allLabel="All Licenses"
        value={license}
        onChange={setLicense}
        options={licenses}
        icon={<CreativeCommons />}
      />
    </FilterBar>
  );
}

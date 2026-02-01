"use client";

import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import {
  DataTableFacetedFilter,
  DataTableToggleFilter,
} from "@/components/ui/data-table-filter";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  analyticsQuerySearchParams,
  AnalyticsEventTypeLabels,
} from "@/domains/analytics";
import { Language } from "@/domains/languages/types";
import { License } from "@/domains/licenses/types";
import { mapToOptions } from "@/utils/map-to-display-options";
import { useFilterOptions } from "@/utils/use-filter-options";
import { UTCDate } from "@date-fns/utc";
import { AnalyticsEventType } from "@prisma/client";
import {
  CreativeCommons,
  Earth,
  Eye,
  Flag,
  Languages,
  MousePointer2,
} from "lucide-react";
import { useQueryStates } from "nuqs";
import { ReactNode } from "react";

const EventTypeOptions = mapToOptions(
  [AnalyticsEventType.QUERY, AnalyticsEventType.INTERACTION],
  AnalyticsEventTypeLabels,
);

export function AnalyticsFilterBar({ accessory }: { accessory?: ReactNode }) {
  const [query, setQuery] = useQueryStates(analyticsQuerySearchParams, {
    shallow: false,
  });
  const licenseOptions = useFilterOptions<License>("/api/licenses", (l) => ({
    value: l.id,
    label: l.name,
  }));
  const countryOptions = useFilterOptions<{ name: string; code: string }>(
    "/api/countries",
    (l) => ({
      value: l.code,
      label: l.name,
    }),
  );
  const browserLanguageOptions = useFilterOptions<{ browserLanguage: string }>(
    "/api/browser-languages",
    (value) => ({ value: value.browserLanguage, label: value.browserLanguage }),
  );
  const languageOptions = useFilterOptions<Language>("/api/languages", (l) => ({
    value: l.id,
    label: l.name,
  }));

  return (
    <FilterBar accessory={accessory}>
      {!query.sessionId ? (
        <DatePickerWithRange
          range={{ from: query.sd, to: query.ed }}
          onChange={(value) => {
            setQuery((query) => ({
              ...query,
              sd: value?.from
                ? new UTCDate(value.from.toISOString())
                : new UTCDate(),
              ed: value?.to
                ? new UTCDate(value.to.toISOString())
                : new UTCDate(),
            }));
          }}
        />
      ) : null}
      {query.sessionId ? (
        <Button disabled size="sm">
          All Event Dates
        </Button>
      ) : null}
      {query.sessionId ? (
        <DataTableToggleFilter
          icon={<Eye />}
          title="Session ID"
          value={`ending in ${query.sessionId.substring(query.sessionId.length - 4)}`}
          onClick={() => setQuery((query) => ({ ...query, sessionId: null }))}
        />
      ) : null}
      <DataTableFacetedFilter
        title="Type"
        allLabel="All Event Types"
        value={query.eventType}
        onChange={(eventType) =>
          setQuery((query) => ({
            ...query,
            eventType,
          }))
        }
        options={EventTypeOptions}
        icon={<MousePointer2 />}
      />
      <DataTableFacetedFilter
        searchable
        title="Country"
        allLabel="All Countries"
        value={query.countryCode}
        onChange={(countryCode) =>
          setQuery((query) => ({
            ...query,
            countryCode,
          }))
        }
        options={countryOptions}
        icon={<Flag />}
      />
      <DataTableFacetedFilter
        searchable
        title="Browser Language"
        allLabel="All Browser Languages"
        value={query.browserLanguage}
        onChange={(browserLanguage) =>
          setQuery((query) => ({
            ...query,
            browserLanguage,
          }))
        }
        options={browserLanguageOptions}
        icon={<Earth />}
      />
      <DataTableFacetedFilter
        searchable
        title="Selected License"
        allLabel="All Licenses"
        value={query.license}
        onChange={(license) =>
          setQuery((query) => ({
            ...query,
            license,
          }))
        }
        options={licenseOptions}
        icon={<CreativeCommons />}
      />
      <DataTableFacetedFilter
        searchable
        title="Selected Language"
        allLabel="All Languages"
        value={query.language}
        onChange={(language) =>
          setQuery((query) => ({
            ...query,
            language,
          }))
        }
        options={languageOptions}
        icon={<Languages />}
      />
    </FilterBar>
  );
}

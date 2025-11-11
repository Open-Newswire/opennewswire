"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AnalyticsReportQuery,
  AnalyticsReportQuerySchema,
} from "@/schemas/analytics";
import { AnalyticsEventTypeLabels } from "@/types/analytics";
import { Language } from "@/types/languages";
import { License } from "@/types/licenses";
import { mapToOptions } from "@/utils/map-to-display-options";
import { useFilterOptions } from "@/utils/use-filter-options";
import { UTCDate } from "@date-fns/utc";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContextModalProps } from "@mantine/modals";
import { AnalyticsEventType } from "@prisma/client";
import { startOfDay, subDays } from "date-fns";
import {
  CalendarIcon,
  CreativeCommons,
  Earth,
  Flag,
  Languages,
  MousePointer2,
} from "lucide-react";
import { useForm } from "react-hook-form";

interface ReportType {
  id: string;
  title: string;
  description: string;
}

const reportTypes: ReportType[] = [
  {
    id: "events",
    title: "Events",
    description: "All events matching the selected filters.",
  },
  {
    id: "top-articles",
    title: "Top Articles",
    description:
      "Most frequently opened articles matching the selected filters.",
  },
  {
    id: "top-searches",
    title: "Top Searches",
    description:
      "Most frequently occurring search terms matching the selected filters.",
  },
  {
    id: "locations",
    title: "Locations",
    description: "Visitor locations from events matching the selected filters.",
  },
];

function ReportOption({ report }: { report: ReportType }) {
  return (
    <Label
      className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/20 flex items-start gap-3 rounded-lg border p-3"
      key="events"
    >
      <RadioGroupItem
        value={report.id}
        id={report.id}
        className="data-[state=checked]:border-primary"
      />
      <div className="grid gap-1 font-normal">
        <div className="font-medium">{report.title}</div>
        <div className="text-muted-foreground text-xs leading-snug text-balance">
          {report.description}
        </div>
      </div>
    </Label>
  );
}

const EventTypes = mapToOptions(
  [AnalyticsEventType.QUERY, AnalyticsEventType.INTERACTION],
  AnalyticsEventTypeLabels,
);

function ExportAnalyticsReportEditor() {
  const licenses = useFilterOptions<License>("/api/licenses", (l) => ({
    value: l.id,
    label: l.name,
  }));
  const languages = useFilterOptions<Language>("/api/languages", (l) => ({
    value: l.id,
    label: l.name,
  }));
  const countries = useFilterOptions<{ name: string; code: string }>(
    "/api/countries",
    (l) => ({
      value: l.code,
      label: l.name,
    }),
  );
  const browserLanguages = useFilterOptions<{ browserLanguage: string }>(
    "/api/browser-languages",
    (value) => ({ value: value.browserLanguage, label: value.browserLanguage }),
  );

  const form = useForm({
    resolver: zodResolver(AnalyticsReportQuerySchema),
    defaultValues: {
      reportType: "events",
      sd: startOfDay(subDays(new UTCDate(), 7)),
      ed: startOfDay(new UTCDate()),
    },
  });

  function parseFilenameFromContentDisposition(
    contentDisposition: string,
  ): string | null {
    if (!contentDisposition) return null;

    const filenameMatch = contentDisposition.match(
      /filename[^;=\n]*=(['"]?)([^'";]+)\1/,
    );
    return filenameMatch ? filenameMatch[2] : null;
  }

  async function onSubmit(values: AnalyticsReportQuery) {
    try {
      const response = await fetch("/api/analytics/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename =
        parseFilenameFromContentDisposition(contentDisposition || "") ||
        `analytics-export-${new Date().toISOString().split("T")[0]}.csv`;

      // Create a temporary URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h4 className="font-semibold text-md mb-2">Report Type</h4>
        <FormField
          control={form.control}
          name="reportType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || "events"}
                  className="grid grid-cols-2"
                >
                  {reportTypes.map((report) => (
                    <ReportOption key={report.id} report={report} />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h4 className="font-semibold text-md mt-6 mb-2">Filters</h4>
        <FormField
          control={form.control}
          name="sd"
          render={({ field }) => (
            <FormItem className="grid grid-cols-3 my-2">
              <FormLabel>
                <CalendarIcon size={20} />
                Start Date
              </FormLabel>
              <FormControl className="col-span-2">
                {/* @ts-ignore */}
                <DatePicker className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ed"
          render={({ field }) => (
            <FormItem className="grid grid-cols-3 my-2">
              <FormLabel>
                <CalendarIcon size={20} />
                End Date
              </FormLabel>
              <FormControl className="col-span-2">
                {/* @ts-ignore */}
                <DatePicker className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem className="grid grid-cols-3 my-2">
              <FormLabel>
                <MousePointer2 size={20} />
                Event Type
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl className="col-span-2">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Event Types" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Event Types</SelectItem>
                  <Separator />
                  {EventTypes.map((eventType) => (
                    <SelectItem key={eventType.value} value={eventType.value}>
                      {eventType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <FormItem className="grid grid-cols-3 my-2">
              <FormLabel>
                <Flag size={20} />
                Country
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl className="col-span-2">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <Separator />
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="browserLanguage"
          render={({ field }) => (
            <FormItem className="grid grid-cols-3 my-2">
              <FormLabel>
                <Earth size={20} />
                Browser Language
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl className="col-span-2">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Browser Languages" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Browser Languages</SelectItem>
                  <Separator />
                  {browserLanguages.map((browserLanguage) => (
                    <SelectItem
                      key={browserLanguage.value}
                      value={browserLanguage.value}
                    >
                      {browserLanguage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="license"
          render={({ field }) => (
            <FormItem className="grid grid-cols-3 my-2">
              <FormLabel>
                <CreativeCommons size={20} />
                Selected License
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl className="col-span-2">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Licenses" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Licenses</SelectItem>
                  <Separator />
                  {licenses.map((license) => (
                    <SelectItem key={license.value} value={license.value}>
                      {license.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="grid grid-cols-3 my-2">
              <FormLabel>
                <Languages size={20} />
                Selected Language
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl className="col-span-2">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Languages" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <Separator />
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <footer className="flex flex-row-reverse mt-6">
          <Button type="submit">Generate Report</Button>
        </footer>
      </form>
    </Form>
  );
}

export function ExportAnalyticsReportModal({ context, id }: ContextModalProps) {
  return <ExportAnalyticsReportEditor />;
}

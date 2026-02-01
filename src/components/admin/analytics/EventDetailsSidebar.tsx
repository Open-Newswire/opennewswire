import { getEventDetails } from "@/domains/analytics/actions";
import { EnrichmentStatusBadge } from "@/components/admin/analytics/EnrichmentStatusBadge";
import { EventTypeBadge } from "@/components/admin/analytics/EventTypeBadge";
import { LicenseBadge } from "@/components/admin/licenses/LicenseBadge";
import { Button } from "@/components/ui/button";
import {
  InspectorContent,
  InspectorGroup,
  InspectorHeader,
  useInspector,
} from "@/components/ui/inspector";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnalyticsEventDetails } from "@/domains/analytics";
import { AnalyticsEvent } from "@prisma/client";
import { IconInfoCircle } from "@tabler/icons-react";
import { format } from "date-fns";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

type ValueChipProps =
  | { label: React.ReactNode; value: string; children?: undefined }
  | { label: React.ReactNode; children: React.ReactNode; value?: undefined };

function EventDataCell({ label, value, children }: ValueChipProps) {
  return (
    <div className="mb-3 text-sm">
      <div className="font-semibold text-sm mb-1">{label}</div>
      {children ?? value}
    </div>
  );
}

export function EventDetailsSidebar({ event }: { event: AnalyticsEvent }) {
  const { dismissInspector } = useInspector();
  const [isLoading, startTransition] = useTransition();
  const [eventDetails, setEventDetails] = useState<
    AnalyticsEventDetails | undefined
  >();

  useEffect(() => {
    startTransition(async () => {
      if (event) {
        const eventDetails = await getEventDetails(event.id);
        setEventDetails(eventDetails);
      } else {
        setEventDetails(undefined);
      }
    });
  }, [event]);

  if (!event) {
    return null;
  }

  return (
    <InspectorContent>
      <InspectorHeader title="Event Details" />
      <InspectorGroup>
        <EventDataCell label="Date" value={format(event.occuredAt, "PP pp")} />
        <EventDataCell label="Type">
          <EventTypeBadge type={event.eventType} />
        </EventDataCell>
        <EventDataCell label="Session ID">
          <Link
            onClick={dismissInspector}
            href={`/admin/analytics/events?sessionId=${event.sessionId}`}
          >
            <span className="break-all">{event.sessionId}</span>
            <Button variant="outline" size="icon" className="ml-2">
              <SearchIcon />
            </Button>
          </Link>
        </EventDataCell>
        <EventDataCell
          label="IP Address"
          value={event.ipAddress ?? "No IP Address"}
        />
        <EventDataCell label="City" value={event.city ?? "No City"} />
        <EventDataCell
          label="Country"
          // @ts-ignore countryName is a derived field
          value={(event.countryName || event.countryCode) ?? "No Country"}
        />
        <EventDataCell label="Region" value={event.regionCode ?? "No Region"} />
        <EventDataCell
          label="Browser Language"
          value={event.browserLanguage ?? "No Browser Language"}
        />
        <EventDataCell label="Selected Languages">
          {isLoading ? (
            <Skeleton className="h-5 w-[150px]" />
          ) : event.selectedLanguages?.length ? (
            eventDetails?.selectedLanguages.map((lang) => lang.name).join(", ")
          ) : (
            "No Languages Selected"
          )}
        </EventDataCell>
        <EventDataCell label="Selected Licenses">
          {isLoading ? (
            <Skeleton className="h-5 w-[150px]" />
          ) : event.selectedLicenses?.length ? (
            eventDetails?.selectedLicenses.map((license) => (
              <div className="inline-block mr-2 mb-2" key={license.id}>
                <LicenseBadge license={license} />
              </div>
            ))
          ) : (
            "No Licenses Selected"
          )}
        </EventDataCell>
        <EventDataCell
          label="Search Query"
          value={event.searchQuery ?? "No Search Query"}
        />
        <EventDataCell
          label={
            <span className="flex items-center gap-1">
              Enrichment Status{" "}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0}>
                    <IconInfoCircle
                      size={14}
                      className="text-muted-foreground"
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Location data is enriched every 15 minutes.
                </TooltipContent>
              </Tooltip>
            </span>
          }
        >
          <EnrichmentStatusBadge status={event.enrichmentStatus} />
        </EventDataCell>
      </InspectorGroup>
    </InspectorContent>
  );
}

"use client";

import { EventsTable } from "@/app/admin/analytics/events/EventsTable";

export default function Loading() {
  return (
    <EventsTable
      data={{ results: [], pagination: { pageCount: 0, totalCount: 0 } }}
    />
  );
}

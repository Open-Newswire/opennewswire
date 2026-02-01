"use client";

import { EventsTable } from "@/components/admin/analytics/EventsTable";

export default function Loading() {
  return (
    <EventsTable
      data={{ results: [], pagination: { pageCount: 0, totalCount: 0 } }}
    />
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { exportReport } from "@/triggers/analytics";

export function ExportAnalyticsReportActionButton() {
  return <Button onClick={exportReport}>Export Report</Button>;
}

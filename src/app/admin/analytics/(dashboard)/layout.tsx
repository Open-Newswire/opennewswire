import { ExportAnalyticsReportActionButton } from "@/app/admin/analytics/(dashboard)/ExportAnalyticsReportActionButton";
import { AnalyticsFilterBar } from "@/app/admin/analytics/(shared)/AnalyticsFilterBar";
import { PageContainer } from "@/components/shared/PageContainer";
import { ReactNode } from "react";

interface AnalyticsDashboardLayoutProps {
  children: ReactNode;
  totalEvents: ReactNode;
  sessionDuration: ReactNode;
  uniqueSessions: ReactNode;
  topSearches: ReactNode;
  locations: ReactNode;
  topArticles: ReactNode;
  uniqueSessionsByDay: ReactNode;
}

export default function AnalyticsDashboardLayout({
  children,
  totalEvents,
  topSearches,
  sessionDuration,
  uniqueSessions,
  locations,
  topArticles,
  uniqueSessionsByDay,
  ...rest
}: AnalyticsDashboardLayoutProps) {
  return (
    <PageContainer
      title="Analytics"
      actions={<ExportAnalyticsReportActionButton />}
    >
      <AnalyticsFilterBar />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4">{totalEvents}</div>
        <div className="md:col-span-4">{sessionDuration}</div>
        <div className="md:col-span-4">{uniqueSessions}</div>
        <div className="md:col-span-6">{topSearches}</div>
        <div className="md:col-span-6">{locations}</div>
        <div className="md:col-span-12">{topArticles}</div>
        <div className="md:col-span-12">{uniqueSessionsByDay}</div>
      </div>
    </PageContainer>
  );
}

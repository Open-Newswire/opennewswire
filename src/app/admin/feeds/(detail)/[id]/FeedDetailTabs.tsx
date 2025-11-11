"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tab, useTabs } from "@/hooks/use-tabs";

const tabs: Tab[] = [
  {
    label: "Feed Information",
    value: "info",
    isBase: true,
  },
  {
    label: "Articles",
    value: "articles",
  },
  {
    label: "Sync History",
    value: "sync-history",
  },
];

export function FeedDetailTabs({
  feedId,
  children,
}: {
  feedId: string;
  children: React.ReactNode;
}) {
  const { value, handleChange } = useTabs(`/admin/feeds/${feedId}`, tabs);

  return (
    <Tabs value={value} onValueChange={handleChange}>
      <TabsList className="mb-3">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}

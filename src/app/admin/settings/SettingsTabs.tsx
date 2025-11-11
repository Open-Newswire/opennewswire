"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tab, useTabs } from "@/hooks/use-tabs";

const tabs: Tab[] = [
  {
    label: "General",
    value: "general",
    isBase: true,
  },
  {
    label: "Account and Users",
    value: "users",
  },
  {
    label: "System Diagnostics",
    value: "diagnostics",
  },
];

export function SettingsTabs({ children }: { children: React.ReactNode }) {
  const { value, handleChange } = useTabs("/admin/settings", tabs);

  return (
    <Tabs value={value} onValueChange={handleChange}>
      <TabsList>
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

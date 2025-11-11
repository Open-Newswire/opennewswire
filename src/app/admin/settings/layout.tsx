import { PageContainer } from "@/components/shared/PageContainer";
import { validateRequest } from "@/services/auth";
import { redirect } from "next/navigation";
import React from "react";
import { SettingsTabs } from "./SettingsTabs";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  return (
    <PageContainer title="Settings">
      <SettingsTabs>{children}</SettingsTabs>
    </PageContainer>
  );
}

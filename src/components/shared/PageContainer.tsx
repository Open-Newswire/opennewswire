"use client";

import { PageHeader, PageHeaderHistory } from "@/components/PageHeader";
import {
  Inspector,
  InspectorInset,
  InspectorProvider,
} from "@/components/ui/inspector";
import { ReactNode } from "react";

export function PageContainer({
  title,
  history,
  actions,
  children,
}: {
  title: string;
  history?: PageHeaderHistory[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <InspectorProvider defaultOpen={false}>
      <InspectorInset>
        <PageHeader title={title} history={history}>
          {actions}
        </PageHeader>
        <div className="p-5">{children}</div>
      </InspectorInset>
      <Inspector side="right" />
    </InspectorProvider>
  );
}

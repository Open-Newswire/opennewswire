import { PageContainer } from "@/components/shared/PageContainer";
import { ReactNode } from "react";

export default function JobsLayout({ children }: { children: ReactNode }) {
  return <PageContainer title="Sync Jobs">{children}</PageContainer>;
}

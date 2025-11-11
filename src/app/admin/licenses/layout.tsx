import { PageContainer } from "@/components/shared/PageContainer";
import { ReactNode } from "react";
import { AddLicenseActionButton } from "./AddLicenseActionButton";

export default function LicensesLayout({ children }: { children: ReactNode }) {
  return (
    <PageContainer title="Licenses" actions={<AddLicenseActionButton />}>
      {children}
    </PageContainer>
  );
}

import { ReorderLanguagesActionButton } from "@/app/admin/languages/ReorderLanguagesActionButton";
import { PageContainer } from "@/components/shared/PageContainer";
import { ReactNode } from "react";
import { AddLanguageActionButton } from "./AddLanguageActionButton";

export default function LanguagesLayout({ children }: { children: ReactNode }) {
  return (
    <PageContainer
      title="Languages"
      actions={
        <>
          <ReorderLanguagesActionButton />
          <AddLanguageActionButton />
        </>
      }
    >
      {children}
    </PageContainer>
  );
}

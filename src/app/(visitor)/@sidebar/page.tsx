import { fetchLanguages } from "@/domains/languages/actions";
import { fetchLicenses } from "@/domains/licenses/actions";
import { Sidebar } from "@/components/visitor/Sidebar";
import { Suspense } from "react";

export default async function SidebarSlot() {
  const languages = await fetchLanguages();
  const licenses = await fetchLicenses();

  return (
    <Suspense>
      <Sidebar languages={languages} licenses={licenses} />
    </Suspense>
  );
}

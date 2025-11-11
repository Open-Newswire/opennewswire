import { fetchLanguages } from "@/actions/languages";
import { fetchLicenses } from "@/actions/licenses";
import { Sidebar } from "@/app/(visitor)/@sidebar/Sidebar";
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

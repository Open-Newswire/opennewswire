import { fetchLicenses } from "@/actions/licenses";
import { LicensesTable } from "./LicensesTable";

export default async function Licenses() {
  const licenses = await fetchLicenses();

  return <LicensesTable licenses={licenses} />;
}

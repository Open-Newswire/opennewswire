import { fetchLicenses } from "@/domains/licenses/actions";
import { LicensesTable } from "@/components/admin/licenses/LicensesTable";

export default async function Licenses() {
  const licenses = await fetchLicenses();

  return <LicensesTable licenses={licenses} />;
}

import { fetchLicenses } from "@/domains/licenses/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  const licenses = await fetchLicenses();

  return Response.json(licenses);
}

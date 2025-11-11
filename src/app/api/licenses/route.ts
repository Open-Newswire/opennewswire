import { fetchLicenses } from "@/actions/licenses";

export const dynamic = "force-dynamic";

export async function GET() {
  const licenses = await fetchLicenses();

  return Response.json(licenses);
}

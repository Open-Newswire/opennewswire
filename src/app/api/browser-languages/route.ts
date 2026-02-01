import { getDistinctBrowserLanguages } from "@/domains/analytics/service";

export async function GET() {
  const browserLanguages = await getDistinctBrowserLanguages();

  return Response.json(browserLanguages);
}

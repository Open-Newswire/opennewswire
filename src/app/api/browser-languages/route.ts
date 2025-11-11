import { getDistinctBrowserLanguages } from "@/services/analytics";

export async function GET() {
  const browserLanguages = await getDistinctBrowserLanguages();

  return Response.json(browserLanguages);
}

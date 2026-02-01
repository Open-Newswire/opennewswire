import { fetchLanguages } from "@/domains/languages/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  const languages = await fetchLanguages();

  return Response.json(languages);
}

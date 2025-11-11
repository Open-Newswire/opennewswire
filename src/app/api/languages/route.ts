import { fetchLanguages } from "@/actions/languages";

export const dynamic = "force-dynamic";

export async function GET() {
  const languages = await fetchLanguages();

  return Response.json(languages);
}

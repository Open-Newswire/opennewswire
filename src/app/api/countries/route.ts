import { getDistinctCountryCodes } from "@/domains/analytics/service";

export async function GET() {
  const countryCodes = await getDistinctCountryCodes();
  const regionNamesInEnglish = new Intl.DisplayNames(["en"], {
    type: "region",
  });
  const response = countryCodes
    .map((countryCode) => ({
      name:
        regionNamesInEnglish.of(countryCode.countryCode!) ||
        countryCode.countryCode,
      code: countryCode.countryCode,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return Response.json(response);
}

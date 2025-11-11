const regionNamesInEnglish = new Intl.DisplayNames(["en"], {
  type: "region",
});

/**
 * Returns a country's name from a country code
 * @param code Alpha-3 country code
 */
export function getCountryName(code: string | null) {
  if (!code) {
    return "";
  }

  return regionNamesInEnglish.of(code);
}

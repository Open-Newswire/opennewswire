const MAX_SEARCH_LENGTH = 200;

export function sanitizeSearchString(search: string) {
  if (!search || typeof search !== "string") {
    return "";
  }

  const trimmedSearch = search.slice(0, MAX_SEARCH_LENGTH);

  return trimmedSearch
    .replace(/[^a-zA-Z0-9\s\-']/g, " ")
    .replace(/\s\s+/g, " ")
    .trim()
    .split(" ")
    .filter((word) => word.length > 0)
    .slice(0, 10)
    .join(" & ");
}

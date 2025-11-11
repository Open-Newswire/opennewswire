/**
 * Given a hostname url string containing a sub-domain, returns only the root domain.
 *
 * @param hostname String containing hostname with sub-domain, eg api.opennewswire.org
 * @returns String containing base domain, eg opennewswire.org
 */
export default function getRootDomain(hostname: string) {
  let parts = hostname.split(".");
  if (parts.length <= 2) return hostname;

  parts = parts.slice(-3);
  if (["co", "com"].indexOf(parts[1]) > -1) return parts.join(".");

  return parts.slice(-2).join(".");
}

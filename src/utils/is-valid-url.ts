export default function isValidUrl(url: string) {
  try {
    return Boolean(new URL(url));
  } catch (_) {
    return false;
  }
}

// Client-side cookie utilities.

function writeClientCookie(serializedCookie: string) {
  if (typeof document !== 'undefined') {
    // biome-ignore lint/suspicious/noDocumentCookie: Preferences intentionally use browser-readable cookies.
    document.cookie = serializedCookie;
  }
}

export function setClientCookie(key: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  writeClientCookie(`${key}=${value}; expires=${expires}; path=/`);
}

export function getClientCookie(key: string) {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${key}=`))
    ?.split('=')[1];
}

export function deleteClientCookie(key: string) {
  writeClientCookie(`${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`);
}

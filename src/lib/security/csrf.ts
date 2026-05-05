// Double-submit cookie pattern.
// Frontend sets csrf_token cookie + sends X-CSRF-Token header.
// Backend (Sliplane/Express) validates header === cookie value.

const COOKIE_NAME = "csrf_token";
const TOKEN_LENGTH = 32;

function generateToken(): string {
  const arr = new Uint8Array(TOKEN_LENGTH);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Returns existing token or generates + persists a new one
export function getCsrfToken(): string {
  const existing = readCookie(COOKIE_NAME);
  if (existing) return existing;
  const token = generateToken();
  // SameSite=Strict prevents cross-site requests from including the cookie
  document.cookie = `${COOKIE_NAME}=${token}; path=/; SameSite=Strict`;
  return token;
}

// Ready-to-spread headers object for fetch/axios calls
// Usage: fetch(url, { method: "POST", headers: { ...csrfHeader(), "Content-Type": "application/json" }, body: ... })
export function csrfHeader(): Record<string, string> {
  return { "X-CSRF-Token": getCsrfToken() };
}

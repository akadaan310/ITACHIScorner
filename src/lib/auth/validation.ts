export function safeNextPath(value: unknown): string {
  if (typeof value !== "string" || value.length > 500 || /[\x00-\x20\x7f\\]/.test(value)) return "/me";
  let decoded = value;
  try {
    for (let i = 0; i < 3; i++) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
  } catch { return "/me"; }
  if (!decoded.startsWith("/") || decoded.startsWith("//") || /[\x00-\x20\x7f\\]/.test(decoded)) return "/me";
  if (/^\/(auth|api|join)(\/|\?|#|$)/i.test(decoded)) return "/me";
  return value;
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; }
  catch { return false; }
}

export function parseEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim();
  return email.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ? email : null;
}

export function parseOtp(value: unknown): string | null {
  return typeof value === "string" && /^\d{6}$/.test(value.trim()) ? value.trim() : null;
}

export function parseNickname(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const nickname = value.trim();
  return nickname.length >= 2 && nickname.length <= 40 && /^[\p{L}\p{N} ._'-]+$/u.test(nickname) ? nickname : null;
}

export function parseHandle(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const handle = value.trim();
  return /^@?[\p{L}\p{N}_.-]{1,60}$/u.test(handle) ? handle : null;
}

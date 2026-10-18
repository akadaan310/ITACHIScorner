export interface SupabaseConfig { url: string; publishableKey: string }

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !publishableKey || publishableKey.startsWith("sb_secret_")) return null;
  try {
    const parsed = new URL(url);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
    if ((parsed.protocol !== "https:" && !(local && parsed.protocol === "http:")) || parsed.username || parsed.password || parsed.pathname !== "/") return null;
    if (!publishableKey.startsWith("sb_publishable_")) {
      // Local Supabase currently emits legacy anon JWTs. Never accept a service key here.
      const payload = JSON.parse(atob(publishableKey.split(".")[1] ?? ""));
      if (payload.role !== "anon") return null;
    }
    return { url: parsed.origin, publishableKey };
  } catch { return null; }
}

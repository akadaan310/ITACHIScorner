import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function updateSession(request: NextRequest) {
  const config = getSupabaseConfig();
  if (!config) return NextResponse.next({ request });
  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.publishableKey, {
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: init?.signal ?? AbortSignal.timeout(10000) }) },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items, cacheHeaders) => {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(cacheHeaders).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });
  try { await supabase.auth.getClaims(); } catch { /* Page/route checks fail closed independently. */ }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

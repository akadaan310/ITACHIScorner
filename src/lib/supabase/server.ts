import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function createServerSupabase() {
  const config = getSupabaseConfig();
  if (!config) return null;
  const cookieStore = await cookies();
  return createServerClient(config.url, config.publishableKey, {
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: init?.signal ?? AbortSignal.timeout(10000) }) },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (items) => {
        try { items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch {
          // Rendering cannot mutate cookies. Proxy refreshes and sends them before rendering.
        }
      },
    },
  });
}

/** This module imports next/headers, so Next prevents it entering a client bundle. */
export function createAdminSupabase() {
  const config = getSupabaseConfig();
  const secret = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!config || !secret) return null;
  return createClient(config.url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: init?.signal ?? AbortSignal.timeout(10000) }) },
  });
}

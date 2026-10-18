import { createServerSupabase } from "@/lib/supabase/server";
import { authServiceUnavailable } from "@/lib/auth/validation";

export type StaffRole = "reviewer" | "creator" | "admin";
export interface MemberProfile { id: string; nickname: string }
export interface MemberPreferences { languages: string[]; reduced_motion: boolean; email_updates: boolean }
export type AccountContext =
  | { status: "unconfigured" | "unavailable" | "signed-out" }
  | { status: "authenticated"; user: { id: string; email: string | null }; profile: MemberProfile | null; preferences: MemberPreferences | null; staffRoles: StaffRole[] };

export async function getAccountContext(): Promise<AccountContext> {
  const client = await createServerSupabase();
  if (!client) return { status: "unconfigured" };
  try {
    const { data: { user }, error } = await client.auth.getUser();
    if (error) return { status: authServiceUnavailable(error) ? "unavailable" : "signed-out" };
    if (!user || user.is_anonymous) return { status: "signed-out" };
    const [profile, preferences, staff] = await Promise.all([
      client.from("profiles").select("id,nickname").eq("id", user.id).maybeSingle(),
      client.from("member_preferences").select("languages,reduced_motion,email_updates").eq("user_id", user.id).maybeSingle(),
      client.from("creator_staff").select("role").eq("user_id", user.id),
    ]);
    if (profile.error || preferences.error || staff.error) return { status: "unavailable" };
    return {
      status: "authenticated", user: { id: user.id, email: user.email ?? null },
      profile: profile.data as MemberProfile | null, preferences: preferences.data as MemberPreferences | null,
      staffRoles: (staff.data ?? []).map((row) => row.role).filter((role): role is StaffRole => ["reviewer", "creator", "admin"].includes(role)),
    };
  } catch { return { status: "unavailable" }; }
}

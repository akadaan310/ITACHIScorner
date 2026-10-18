import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const backend = vi.hoisted(() => ({ client: null as unknown, admin: null as unknown }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: async () => backend.client, createAdminSupabase: () => backend.admin }));
import { getAccountContext } from "@/lib/auth/session";
import { POST as requestEmail } from "@/app/auth/request/route";
import { POST as verifyCode } from "@/app/auth/verify/route";
import { POST as logout } from "@/app/auth/logout/route";
import { GET as exportAccount } from "@/app/api/account/export/route";
import { POST as deleteAccount } from "@/app/api/account/delete/route";

function post(path: string, fields: Record<string, string>, origin = "https://corner.test") {
  return new Request(`https://corner.test${path}`, { method: "POST", headers: { origin }, body: new URLSearchParams(fields) });
}
beforeEach(() => { backend.client = null; backend.admin = null; });
afterEach(() => vi.restoreAllMocks());

describe("SSR account session boundary", () => {
  it("distinguishes unavailable auth providers from missing sessions", async () => {
    backend.client = { auth: { getUser: async () => ({ data: { user: null }, error: { name: "AuthRetryableFetchError", status: 503 } }) } };
    expect(await getAccountContext()).toEqual({ status: "unavailable" });
    expect((await exportAccount(new Request("https://corner.test/api/account/export"))).status).toBe(503);
    backend.client = { auth: { getUser: async () => ({ data: { user: null }, error: { name: "AuthSessionMissingError", status: 400 } }) } };
    expect(await getAccountContext()).toEqual({ status: "signed-out" });
  });
  it("does not grant member account capabilities to anonymous auth identities", async () => {
    backend.client = { auth: { getUser: async () => ({ data: { user: { id: "anonymous", is_anonymous: true } }, error: null }) } };
    expect((await exportAccount(new Request("https://corner.test/api/account/export"))).status).toBe(401);
  });
});

describe("auth and privacy HTTP boundaries", () => {
  it("rejects hostile origins with 403 before any sign-in or deletion", async () => {
    for (const [path, handler] of [["/auth/request", requestEmail], ["/auth/verify", verifyCode], ["/auth/logout", logout], ["/api/account/delete", deleteAccount]] as const) {
      const response = await handler(post(path, { email: "member@example.test", token: "123456", confirmation: "DELETE" }, "https://hostile.test"));
      expect(response.status).toBe(403); expect(response.headers.get("cache-control")).toContain("no-store");
    }
  });
  it("never returns a fabricated export or deletion when accounts are unconfigured", async () => {
    const response = await exportAccount(new Request("https://corner.test/api/account/export"));
    expect(response.status).toBe(503); expect(response.headers.get("cache-control")).toContain("no-store");
    expect(await response.json()).toEqual({ error: "Accounts are not configured." });
    expect((await deleteAccount(post("/api/account/delete", { confirmation: "DELETE" }))).status).toBe(503);
  });
  it("does not tell users email was sent when the provider rejects the request", async () => {
    backend.client = { auth: { signInWithOtp: async () => ({ error: { message: "rate limited" } }) } };
    const response = await requestEmail(post("/auth/request", { email: "member@example.test" }));
    expect(response.status).toBe(303); expect(new URL(response.headers.get("location")!).searchParams.get("notice")).toBe("send-failed");
  });
  it("keeps an expired OTP signed out and never follows an external next target", async () => {
    backend.client = { auth: { verifyOtp: async () => ({ error: { message: "expired" } }) } };
    const response = await verifyCode(post("/auth/verify", { email: "member@example.test", token: "123456", next: "https://hostile.test" }));
    expect(response.status).toBe(303); expect(new URL(response.headers.get("location")!).origin).toBe("https://corner.test");
    expect(new URL(response.headers.get("location")!).searchParams.get("notice")).toBe("expired-code");
  });
  it("deletes the revalidated user only after revocation, ignoring submitted IDs", async () => {
    const accounts = new Set(["member-a", "member-b"]); let revoked = false;
    backend.client = { auth: { getUser: async () => ({ data: { user: { id: "member-a" } }, error: null }), getSession: async () => ({ data: { session: { access_token: "opaque" } }, error: null }), signOut: async () => ({ error: null }) } };
    backend.admin = { auth: { admin: { signOut: async () => { revoked = true; return { error: null }; }, deleteUser: async (id: string) => { if (!revoked) throw Error("must revoke first"); accounts.delete(id); return { error: null }; } } } };
    const response = await deleteAccount(post("/api/account/delete", { confirmation: "DELETE", user_id: "member-b" }));
    expect(accounts).toEqual(new Set(["member-b"])); expect(new URL(response.headers.get("location")!).searchParams.get("notice")).toBe("deleted");
  });
  it("does not delete or report deletion when session revocation fails", async () => {
    const accounts = new Set(["member-a"]);
    backend.client = { auth: { getUser: async () => ({ data: { user: { id: "member-a" } }, error: null }), getSession: async () => ({ data: { session: { access_token: "opaque" } }, error: null }) } };
    backend.admin = { auth: { admin: { signOut: async () => ({ error: { message: "unavailable" } }), deleteUser: async (id: string) => { accounts.delete(id); return { error: null }; } } } };
    const response = await deleteAccount(post("/api/account/delete", { confirmation: "DELETE" }));
    expect(accounts).toEqual(new Set(["member-a"])); expect(new URL(response.headers.get("location")!).searchParams.get("notice")).toBe("delete-failed");
  });
});

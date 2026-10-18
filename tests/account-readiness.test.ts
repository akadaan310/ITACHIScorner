import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
const backend = vi.hoisted(() => ({ client: null as unknown }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: async () => backend.client }));
vi.mock("@/lib/auth/session", () => ({ getAccountContext: async () => ({ status: "authenticated", user: { id: "member", email: "member@example.test" }, profile: null, preferences: null, staffRoles: ["creator"] }) }));
import SettingsPage from "@/app/me/settings/page";
import CreatorWorkspace from "@/app/studio/creator/page";
beforeEach(() => { backend.client = null; });

describe("truthful private account reads", () => {
  it("preserves the latest consent decision even after many unrelated scope decisions", async () => {
    const records = [...Array.from({ length: 100 }, (_, i) => ({ scope: "product-updates", granted: false, recorded_at: `newer-${i}` })), { scope: "community-publication", granted: true, recorded_at: "older" }];
    backend.client = { from: (table: string) => {
      let scope: unknown = null, limit = 1000;
      const query = { select: () => query, eq: (key: string, value: unknown) => { if (key === "scope") scope = value; return query; }, order: () => query, limit: (value: number) => { limit = value; return query; }, then: (resolve: (value: unknown) => unknown) => Promise.resolve({ data: table === "consents" ? records.filter((row) => !scope || row.scope === scope).slice(0, limit) : [], error: null }).then(resolve) };
      return query;
    } };
    const html = renderToStaticMarkup(await SettingsPage({ searchParams: Promise.resolve({}) }));
    expect(html.match(/<input[^>]*name="granted"[^>]*>/)?.[0]).toContain("checked");
  });
  it("does not turn malformed private queue data into a claim of no pending reviews", async () => {
    for (const data of [{ unexpected: true }, [{ status: "pending" }]]) {
      backend.client = { rpc: async () => ({ data, error: null }) };
      const html = renderToStaticMarkup(await CreatorWorkspace());
      expect(html).toContain("The private queue could not be loaded"); expect(html).not.toContain("No source gaps or pending reviews");
    }
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
const state = vi.hoisted(() => ({ client: null as unknown }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: async () => state.client }));
import { AccountActivity } from "@/components/account/activity";
beforeEach(() => { state.client = null; });
describe("owned activity summaries", () => {
  it("never substitutes zero for missing or failed private counts", async () => {
    for (const count of [null, -1, 1.5]) {
      state.client = { from: () => ({ select: () => ({ eq: async () => ({ count, error: null }) }) }) };
      const html = renderToStaticMarkup(await AccountActivity({ userId: "member-a" }));
      expect(html).toContain("Your activity could not be loaded");
      expect(html).not.toContain("Private notes</dt>");
    }
  });
  it("summarizes only the signed-in member's actual records", async () => {
    const records = { learning_notes: ["member-a", "member-a", "member-b"], saved_questions: ["member-b", "member-a"] };
    state.client = { from: (table: keyof typeof records) => ({ select: () => ({ eq: async (field: string, userId: string) => ({ count: field === "user_id" ? records[table].filter(owner => owner === userId).length : null, error: null }) }) }) };
    const html = renderToStaticMarkup(await AccountActivity({ userId: "member-a" }));
    expect(html).toContain('Private notes</dt><dd>2</dd>');
    expect(html).toContain('Saved questions</dt><dd>1</dd>');
    expect(html).not.toMatch(/streak|level|faith score/i);
  });
});

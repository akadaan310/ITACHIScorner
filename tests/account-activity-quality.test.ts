import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const state = vi.hoisted(() => ({ client: null as unknown }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: async () => state.client }));
import { AccountActivity } from "@/components/account/activity";

beforeEach(() => { state.client = null; });

describe("account activity availability boundaries", () => {
  it("reports an unavailable private client without showing personal counts", async () => {
    const html = renderToStaticMarkup(await AccountActivity({ userId: "member-a" }));
    expect(html).toContain('role="alert"');
    expect(html).toContain("Your activity could not be loaded");
    expect(html).not.toContain("<dd>");
  });

  it("does not mistake failed or interrupted counts for an empty account", async () => {
    for (const result of [
      { count: 0, error: { message: "permission denied" } },
      { count: Number.MAX_SAFE_INTEGER + 1, error: null },
      new Error("connection interrupted"),
    ]) {
      state.client = { from: () => ({ select: () => ({ eq: async () => {
        if (result instanceof Error) throw result;
        return result;
      } }) }) };
      const html = renderToStaticMarkup(await AccountActivity({ userId: "member-a" }));
      expect(html).toContain("Your activity could not be loaded");
      expect(html).not.toContain("<dd>");
    }
  });

  it("shows zero only when both owned counts actually return zero", async () => {
    const filters: [string, string, string][] = [];
    state.client = { from: (table: string) => ({ select: () => ({ eq: async (field: string, userId: string) => {
      filters.push([table, field, userId]);
      return { count: 0, error: null };
    } }) }) };
    const html = renderToStaticMarkup(await AccountActivity({ userId: "member-empty" }));
    expect(filters).toEqual([["learning_notes", "user_id", "member-empty"], ["saved_questions", "user_id", "member-empty"]]);
    expect(html).toContain("Private notes</dt><dd>0</dd>");
    expect(html).toContain("Saved questions</dt><dd>0</dd>");
    expect(html).not.toContain('role="alert"');
  });
});

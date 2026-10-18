import { beforeEach, expect, it, vi } from "vitest";
const backend = vi.hoisted(() => ({ client: null as unknown }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: async () => backend.client }));
import { GET as exportAccount } from "@/app/api/account/export/route";
beforeEach(() => { backend.client = null; });

it("does not silently omit surviving notes when an earlier note is removed between export pages", async () => {
  const notes = Array.from({ length: 501 }, (_, i) => ({ id: `${String(i + 1).padStart(8, "0")}-0000-0000-0000-000000000000`, user_id: "member-a", body: `Private ${i + 1}` }));
  let removed = false;
  backend.client = { auth: { getUser: async () => ({ data: { user: { id: "member-a", email: "member@example.test", created_at: "2026-10-18" } }, error: null }) }, from: (table: string) => {
    let start = 0, count = 500, after = "";
    const query = {
      select: () => query, eq: () => query, order: () => query,
      range: (first: number, last: number) => { start = first; count = last - first + 1; return query; },
      gt: (_key: string, value: string) => { after = value; return query; },
      limit: (value: number) => { count = value; return query; },
      then: (resolve: (value: unknown) => unknown) => {
        const data = table === "learning_notes" ? notes.filter((row) => row.id > after).slice(start, start + count).map((row) => ({ ...row })) : [];
        if (table === "learning_notes" && !removed) { notes.shift(); removed = true; }
        return Promise.resolve({ data, error: null }).then(resolve);
      },
    };
    return query;
  } };
  const response = await exportAccount(new Request("https://corner.test/api/account/export"));
  expect(response.status).toBe(200);
  const json = await response.json();
  expect(json.records.learning_notes).toContainEqual(expect.objectContaining({ body: "Private 501" }));
  expect(json.records.learning_notes).toHaveLength(501);
  expect(JSON.stringify(json)).not.toContain("access_token");
});

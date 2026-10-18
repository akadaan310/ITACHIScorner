import { beforeEach, describe, expect, it, vi } from "vitest";
const backend = vi.hoisted(() => ({ client: null as unknown }));
vi.mock("@/lib/supabase/server", () => ({ createServerSupabase: async () => backend.client }));
import { POST as notes } from "@/app/api/account/notes/route";
import { POST as savedQuestions } from "@/app/api/account/saved-questions/route";

type Row = Record<string, unknown>;
const memberA = "00000000-0000-0000-0000-000000000001", memberB = "00000000-0000-0000-0000-000000000002", noteId = "10000000-0000-0000-0000-000000000001";
let tables: Record<string, Row[]>;

// External database boundary only. Real RLS is separately exercised on PostgreSQL.
function query(table: string) {
  const filters: [string, unknown][] = []; let operation = "read", payload: Row = {};
  function execute() {
    const matches = (row: Row) => filters.every(([key, value]) => row[key] === value);
    if (operation === "insert") { const row = { id: crypto.randomUUID(), ...payload }; tables[table]!.push(row); return { data: [row], error: null }; }
    const rows = tables[table]!.filter(matches);
    if (operation === "delete") tables[table] = tables[table]!.filter((row) => !matches(row));
    if (operation === "update") rows.forEach((row) => Object.assign(row, payload));
    return { data: rows, error: null };
  }
  const result = {
    select: () => result,
    eq: (key: string, value: unknown) => { filters.push([key, value]); return result; },
    insert: (value: Row) => { operation = "insert"; payload = value; return result; },
    update: (value: Row) => { operation = "update"; payload = value; return result; },
    delete: () => { operation = "delete"; return result; },
    maybeSingle: async () => { const executed = execute(); return { data: executed.data[0] ?? null, error: null }; },
    then: (resolve: (value: { data: Row[]; error: null }) => unknown) => Promise.resolve(execute()).then(resolve),
  };
  return result;
}

function post(path: string, fields: Record<string, string>, origin = "https://corner.test") {
  return new Request(`https://corner.test${path}`, { method: "POST", headers: { origin }, body: new URLSearchParams(fields) });
}
function notice(response: Response) { const location = response.headers.get("location"); return location ? new URL(location).searchParams.get("notice") : null; }

beforeEach(() => {
  tables = { learning_notes: [], saved_questions: [], published_questions: [] };
  backend.client = { auth: { getUser: async () => ({ data: { user: { id: memberA } }, error: null }) }, from: query };
});

describe("private notes", () => {
  it("binds new private notes to the session and ignores supplied owner and unit IDs", async () => {
    const response = await notes(post("/api/account/notes", { body: "A private reflection", user_id: memberB, unit_id: "unapproved" }));
    expect(response.status).toBe(303); expect(notice(response)).toBe("note-saved");
    expect(tables.learning_notes).toEqual([expect.objectContaining({ user_id: memberA, body: "A private reflection", unit_id: null })]);
  });
  it("rejects blank and oversized notes instead of reporting a save", async () => {
    for (const body of ["   ", "a".repeat(10001)]) expect(notice(await notes(post("/api/account/notes", { body })))).toBe("invalid-note");
    expect(tables.learning_notes).toEqual([]);
  });
  it("cannot edit or delete another member's note even with its known ID", async () => {
    tables.learning_notes = [{ id: noteId, user_id: memberB, body: "Private B" }];
    for (const action of ["update", "delete"]) expect(notice(await notes(post("/api/account/notes", { id: noteId, action, body: "Injected" })))).toBe("missing-note");
    expect(tables.learning_notes[0]?.body).toBe("Private B");
  });
  it("updates and removes the owner's note with truthful results", async () => {
    tables.learning_notes = [{ id: noteId, user_id: memberA, body: "Before" }];
    expect(notice(await notes(post("/api/account/notes", { id: noteId, action: "update", body: "After" })))).toBe("note-saved");
    expect(tables.learning_notes[0]?.body).toBe("After");
    expect(notice(await notes(post("/api/account/notes", { id: noteId, action: "delete" })))).toBe("note-deleted");
    expect(tables.learning_notes).toEqual([]);
  });
});

describe("saved reviewed questions", () => {
  it("rejects unavailable questions without saving or following an external return path", async () => {
    const response = await savedQuestions(post("/api/account/saved-questions", { question_id: "unpublished", next: "https://hostile.test" }));
    expect(response.status).toBe(303); expect(notice(response)).toBe("question-unavailable");
    expect(new URL(response.headers.get("location")!).origin).toBe("https://corner.test"); expect(tables.saved_questions).toEqual([]);
  });
  it("saves only an RLS-visible published question for the current member and toggles their save", async () => {
    tables.published_questions = [{ id: "approved" }];
    expect(notice(await savedQuestions(post("/api/account/saved-questions", { question_id: "approved", user_id: memberB })))).toBe("question-saved");
    expect(tables.saved_questions).toEqual([expect.objectContaining({ user_id: memberA, question_id: "approved" })]);
    tables.saved_questions!.push({ id: "other-save", user_id: memberB, question_id: "approved" });
    expect(notice(await savedQuestions(post("/api/account/saved-questions", { question_id: "approved" })))).toBe("question-removed");
    expect(tables.saved_questions).toEqual([{ id: "other-save", user_id: memberB, question_id: "approved" }]);
  });
  it("requires same-origin authenticated requests", async () => {
    for (const [path, handler] of [["/api/account/notes", notes], ["/api/account/saved-questions", savedQuestions]] as const) {
      expect((await handler(post(path, { body: "Private", question_id: "approved" }, "https://hostile.test"))).status).toBe(403);
      backend.client = null;
      expect((await handler(post(path, { body: "Private", question_id: "approved" }))).status).toBe(503);
    }
  });
});

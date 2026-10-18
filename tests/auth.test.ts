import { afterEach, describe, expect, it, vi } from "vitest";
import { safeNextPath, isSameOrigin, parseEmail, parseOtp, parseNickname, parseHandle } from "@/lib/auth/validation";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { getPublishedQuestions } from "@/lib/published-content";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("account input boundaries", () => {
  it("allows local redirects and rejects external, encoded and backslash redirects", () => {
    expect(safeNextPath("/me/settings?updated=1")).toBe("/me/settings?updated=1");
    for (const value of ["https://evil.test", "//evil.test", "/\\evil.test", "/%2f%2fevil.test", "/%5cevil.test", "/auth/logout", "\n/evil", "/me\n"]) {
      expect(safeNextPath(value)).toBe("/me");
    }
  });
  it("requires same-origin mutation requests", () => {
    expect(isSameOrigin(new Request("https://site.test/api/account/delete", { headers: { origin: "https://site.test" } }))).toBe(true);
    expect(isSameOrigin(new Request("https://site.test/api/account/delete", { headers: { origin: "https://evil.test" } }))).toBe(false);
    expect(isSameOrigin(new Request("https://site.test/api/account/delete"))).toBe(false);
  });
  it("validates email, six digit codes, nickname and self-entered handle", () => {
    expect(parseEmail("  person@example.com ")).toBe("person@example.com");
    expect(parseEmail("invalid")).toBeNull();
    expect(parseOtp("123456")).toBe("123456");
    expect(parseOtp("12345x")).toBeNull();
    expect(parseNickname("  Curious learner ")).toBe("Curious learner");
    expect(parseNickname("<script>")).toBeNull();
    expect(parseHandle("@my_name")).toBe("@my_name");
    expect(parseHandle("owner<script>")).toBeNull();
  });
});

describe("backend readiness", () => {
  it("does not substitute a project when configuration is missing or malformed", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", ""); vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    expect(getSupabaseConfig()).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "not-a-url"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
    expect(getSupabaseConfig()).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://creator.supabase.co");
    expect(getSupabaseConfig()?.url).toBe("https://creator.supabase.co");
  });
  it("returns no public questions without a configured backend", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", ""); vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    expect(await getPublishedQuestions()).toEqual({ items: [], status: "unconfigured" });
  });
  it("fails closed on query errors and malformed publication records", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://creator.supabase.co"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "unavailable" }), { status: 503 })));
    expect(await getPublishedQuestions()).toEqual({ items: [], status: "unavailable" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify([{ id: "q", title: "Unsupported", summary: "Missing evidence" }]), { status: 200, headers: { "content-type": "application/json" } })));
    expect(await getPublishedQuestions()).toEqual({ items: [], status: "unavailable" });
  });
  it("exposes only reviewed safe fields and filters literal search input", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://creator.supabase.co"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
    const row = { id: "q", title: "A sourced question", summary: "A reviewed summary", source_url: "https://www.youtube.com/watch?v=abcdefghijk&t=1", video_id: "abcdefghijk", start_ms: 1000, end_ms: 1501, speaker: "Creator", confidence: 0.9, reviewed_at: "2026-10-18T00:00:00Z", transcript_body: "MUST NOT EXPORT" };
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify([row]), { headers: { "content-type": "application/json" } }))));
    const result = await getPublishedQuestions("sourced");
    expect(result.status).toBe("ready"); expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual({ id: "q", title: row.title, summary: row.summary, sourceUrl: "https://www.youtube.com/watch?v=abcdefghijk&t=1s", videoId: row.video_id, startMs: 1000, endMs: 1501, speaker: row.speaker, confidence: 0.9, reviewedAt: row.reviewed_at });
    expect((await getPublishedQuestions("%_")).status).toBe("ready");
  });
  it("rejects mismatched video IDs, credentialed and noncanonical source URLs", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://creator.supabase.co"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
    for (const source_url of ["https://evil.test/watch?v=abcdefghijk", "https://user:pass@www.youtube.com/watch?v=abcdefghijk", "https://www.youtube.com/watch?v=wrongvideo1"]) {
      const row = { id: "q", title: "Question", summary: "Reviewed", source_url, video_id: "abcdefghijk", start_ms: 1341, end_ms: 2000, speaker: "Creator", confidence: 0.9, reviewed_at: "2026-10-18T00:00:00Z" };
      vi.stubGlobal("fetch", vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify([row]), { headers: { "content-type": "application/json" } }))));
      expect(await getPublishedQuestions()).toEqual({ items: [], status: "unavailable" });
    }
  });
  it("searches the database across published records and builds canonical timestamp links", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://creator.supabase.co"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
    let requestedUrl = "";
    vi.stubGlobal("fetch", (input: RequestInfo | URL) => { requestedUrl = String(input); return Promise.resolve(new Response(JSON.stringify([{ id:"q",title:"Older match",summary:"Reviewed",source_url:"https://www.youtube.com/watch?v=abcdefghijk",video_id:"abcdefghijk",start_ms:1341,end_ms:2000,speaker:"Creator",confidence:0.9,reviewed_at:"2026-10-18T00:00:00Z" }]), { headers: { "content-type": "application/json" } })); });
    const result = await getPublishedQuestions("older match");
    expect(new URL(requestedUrl).searchParams.get("search_document")).toBe("wfts(simple).older match");
    expect(result.items[0]?.sourceUrl).toBe("https://www.youtube.com/watch?v=abcdefghijk&t=1s");
  });
});

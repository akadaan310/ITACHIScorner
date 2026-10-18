import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
vi.mock("@/lib/published-content", () => ({ getPublishedQuestions: async () => ({ status: "ready", items: [] }) }));
vi.mock("@/lib/auth/session", () => ({ getAccountContext: async () => { throw new Error("Empty public search must not read a private account"); } }));
import ExplorePage from "@/app/explore/page";
describe("empty collection versus filtered search", () => {
  it("does not mistake no matching results for an empty published collection", async () => {
    const html = renderToStaticMarkup(await ExplorePage({ searchParams: Promise.resolve({q:"no-matching-result"}) }));
    expect(html).toContain("No published questions found");
    expect(html).toContain("Try another phrase");
    expect(html).not.toContain("No reviewed source excerpts are published yet");
  });
});

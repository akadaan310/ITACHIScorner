import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { adapters } from "@/lib/adapters";
import { creator } from "@/lib/config/creator";
import { atlasEdges, atlasNodes, getNode } from "@/lib/fixtures/atlas";
import { book, dialogueCatalog } from "@/lib/fixtures/content";
import { dojoPath } from "@/lib/fixtures/dojo";
import { events } from "@/lib/fixtures/events";
import { quranRefs } from "@/lib/fixtures/quran";

const appDir = path.resolve(__dirname, "../src/app");
function routes(dir = appDir, prefix = ""): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...routes(full, `${prefix}/${name}`));
    else if (name === "page.tsx") out.push(prefix || "/");
  }
  return out;
}
const known = routes();
const resolves = (href: string) => {
  const p = href.split(/[?#]/)[0]!;
  return known.some((r) => (r.includes("[") ? new RegExp(`^${r.replace(/\[[^\]]+\]/g, "[^/]+")}$`).test(p) : r === p));
};

describe("Night Atlas", () => {
  it("every edge connects two existing stars", () => {
    for (const [a, b] of atlasEdges) {
      expect(getNode(a), a).toBeDefined();
      expect(getNode(b), b).toBeDefined();
    }
  });
  it("every star points to a real route", () => {
    for (const n of atlasNodes) expect(resolves(n.href), `${n.id} → ${n.href}`).toBe(true);
  });
  it("every star is connected to at least one other", () => {
    for (const n of atlasNodes) expect(atlasEdges.some(([a, b]) => a === n.id || b === n.id), n.id).toBe(true);
  });
  it("passage stars reference a known Qur'an passage", () => {
    for (const n of atlasNodes.filter((x) => x.referenceId)) expect(quranRefs[n.referenceId!], n.id).toBeDefined();
  });
});

describe("Qur'an references", () => {
  it("have Arabic verses, a translation and an honest review status", () => {
    for (const r of Object.values(quranRefs)) {
      expect(r.verses.length).toBeGreaterThan(0);
      for (const v of r.verses) expect(/[؀-ۿ]/.test(v)).toBe(true);
      expect(r.translation.length).toBeGreaterThan(10);
      expect(r.reviewStatus).toBe("text-retrieved-pending-editor-review");
    }
  });
  it("Al-Ikhlas has four verses", () => {
    expect(quranRefs["112"]!.verses).toHaveLength(4);
  });
});

describe("honesty of fixtures", () => {
  it("no demo event claims verified provenance", () => {
    for (const e of events) {
      expect(["sample", "simulated"]).toContain(e.provenance.verificationStatus);
      expect(e.scheduleVerification).toBe("sample");
    }
  });
  it("no sample moment carries a timestamp", () => {
    for (const e of events) for (const m of e.recap?.moments ?? []) if (m.timestampStatus === "sample") expect(m.timestamp).toBeUndefined();
  });
  it("catalogue entries are all labelled sample", () => {
    for (const d of dialogueCatalog) expect(d.status).toBe("sample");
  });
  it("the creator has not endorsed the concept and the portrait is not yet approved", () => {
    expect(creator.endorsed).toBe(false);
    expect(creator.portrait.creatorApproved).toBe(false);
  });
  it("external links are https and official", () => {
    for (const url of Object.values(creator.links)) expect(url).toMatch(/^https:\/\/(www\.)?(tiktok|youtube|instagram|x|patreon|linktr)\./);
  });
  it("the book is a planned concept", () => {
    expect(book.status.toLowerCase()).toContain("planned");
  });
});

describe("integration adapters", () => {
  it("platform integrations are unavailable and produce no attendance", async () => {
    for (const a of adapters) {
      const st = a.status();
      if (["YouTubeLiveChat", "TikTokOfficialIfAuthorized", "ManualCreatorExport"].includes(st.source)) expect(st.available).toBe(false);
      expect(await a.attendance("demo-live-now")).toEqual([]);
    }
  });
});

describe("Simulator path", () => {
  it("has 5–7 steps and covers the three exercise types", () => {
    expect(dojoPath.steps.length).toBeGreaterThanOrEqual(5);
    expect(dojoPath.steps.length).toBeLessThanOrEqual(7);
    const types = new Set(dojoPath.steps.map((s) => s.type));
    for (const t of ["next-question", "assumption", "match"]) expect(types.has(t as never)).toBe(true);
  });
  it("every choice step has exactly one best option", () => {
    for (const s of dojoPath.steps) if (s.type === "next-question") expect(s.options.filter((o) => o.best)).toHaveLength(1);
  });
});

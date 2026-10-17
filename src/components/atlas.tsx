"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { StarField, starPath } from "@/components/art";
import { QuranPassage, Tag } from "@/components/ui";
import { ATLAS_H, ATLAS_W, atlasClusters, atlasEdges, atlasNodes, getNode } from "@/lib/fixtures/atlas";
import { useDemo, useHydrated } from "@/lib/store";
import type { AtlasNode } from "@/lib/types";

type View = { x: number; y: number; k: number };
const HOME: View = { x: 0, y: 0, k: 1 };
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const colorOf = (n: AtlasNode) => atlasClusters.find((c) => c.id === n.cluster)?.color ?? "#D7AD65";
const kindLabel: Record<AtlasNode["kind"], string> = {
  cluster: "Constellation",
  passage: "Sourced passage",
  practice: "Practice",
  episode: "Afterglow episode",
  track: "Learning track",
  chapter: "Book chapter",
  question: "Question wall",
};
const neighbours = (id: string) => atlasEdges.filter(([a, b]) => a === id || b === id).map(([a, b]) => (a === id ? b : a));

export function NightAtlas() {
  const params = useSearchParams();
  const hydrated = useHydrated();
  const visited = useDemo((s) => s.visitedStars);
  const visit = useDemo((s) => s.visitStar);
  const initial = params.get("star");
  const [selected, setSelected] = useState<string>(initial && getNode(initial) ? initial : "oneness");
  const [view, setView] = useState<View>(() => {
    const n = initial ? getNode(initial) : undefined;
    return n ? { k: 1.4, x: ATLAS_W / 2 - n.x * 1.4, y: ATLAS_H / 2 - n.y * 1.4 } : HOME;
  });
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; k: number } | null>(null);
  const cardsRef = useRef<HTMLUListElement>(null);

  const scale = () => {
    const el = svgRef.current;
    if (!el) return 1;
    const r = el.getBoundingClientRect();
    return Math.min(r.width / ATLAS_W, r.height / ATLAS_H) || 1;
  };

  const centerOn = useCallback((id: string, k?: number) => {
    const n = getNode(id);
    if (!n) return;
    setView((v) => {
      const kk = k ?? Math.max(v.k, 1.25);
      return { k: kk, x: ATLAS_W / 2 - n.x * kk, y: ATLAS_H / 2 - n.y * kk };
    });
  }, []);

  const select = useCallback(
    (id: string, opts: { center?: boolean; scrollCard?: boolean } = {}) => {
      setSelected(id);
      visit(id);
      if (opts.center) centerOn(id);
      if (opts.scrollCard) cardsRef.current?.querySelector<HTMLElement>(`[data-card="${id}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    },
    [visit, centerOn],
  );

  useEffect(() => {
    if (hydrated && initial && getNode(initial)) visit(initial);
  }, [hydrated, initial, visit]);

  const zoomBy = (f: number, cx = ATLAS_W / 2, cy = ATLAS_H / 2) =>
    setView((v) => {
      const k = clamp(v.k * f, 0.6, 3.2);
      const r = k / v.k;
      return { k, x: cx - (cx - v.x) * r, y: cy - (cy - v.y) * r };
    });

  const toWorld = (clientX: number, clientY: number) => {
    const el = svgRef.current!;
    const r = el.getBoundingClientRect();
    const s = scale();
    const ox = (r.width - ATLAS_W * s) / 2;
    const oy = (r.height - ATLAS_H * s) / 2;
    return { x: (clientX - r.left - ox) / s, y: (clientY - r.top - oy) / s };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as Element).closest("[data-node]")) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setDragging(true);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a!.x - b!.x, a!.y - b!.y), k: view.k };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      const mid = toWorld((a!.x + b!.x) / 2, (a!.y + b!.y) / 2);
      const target = clamp((pinch.current.k * d) / pinch.current.d, 0.6, 3.2);
      zoomBy(target / view.k, mid.x, mid.y);
      return;
    }
    const s = scale();
    setView((v) => ({ ...v, x: v.x + (e.clientX - prev.x) / s, y: v.y + (e.clientY - prev.y) / s }));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) setDragging(false);
  };

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = toWorld(e.clientX, e.clientY);
      zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12, p.x, p.y);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 80 / view.k;
    const map: Record<string, () => void> = {
      ArrowLeft: () => setView((v) => ({ ...v, x: v.x + step })),
      ArrowRight: () => setView((v) => ({ ...v, x: v.x - step })),
      ArrowUp: () => setView((v) => ({ ...v, y: v.y + step })),
      ArrowDown: () => setView((v) => ({ ...v, y: v.y - step })),
      "+": () => zoomBy(1.2),
      "=": () => zoomBy(1.2),
      "-": () => zoomBy(1 / 1.2),
      "0": () => setView(HOME),
    };
    const fn = map[e.key];
    if (fn && (e.target as Element).tagName !== "INPUT") {
      e.preventDefault();
      fn();
    }
  };

  const node = getNode(selected)!;
  const near = new Set(neighbours(selected));
  const isVisited = (id: string) => hydrated && visited.includes(id);
  const visitedCount = hydrated ? visited.length : 0;

  // Viewport rectangle in world units, for the minimap.
  const vp = { x: -view.x / view.k, y: -view.y / view.k, w: ATLAS_W / view.k, h: ATLAS_H / view.k };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Map */}
        <div
          className="relative overflow-hidden rounded-xl border border-violet/30 bg-[radial-gradient(ellipse_at_50%_45%,#231a44_0%,#120e24_55%,#08070f_100%)] focus-within:ring-2 focus-within:ring-amber"
          onKeyDown={onKeyDown}
        >
          <StarField seed={64} count={160} width={1000} height={650} className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
          <svg
            ref={svgRef}
            viewBox={`0 0 ${ATLAS_W} ${ATLAS_H}`}
            className="relative block aspect-[4/3] w-full cursor-grab touch-none select-none active:cursor-grabbing sm:aspect-[2000/1300]"
            role="group"
            aria-label="Night Atlas map. Drag to pan, scroll or pinch to zoom. Arrow keys pan, plus and minus zoom, 0 resets. Tab through stars."
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`} style={{ transition: dragging ? "none" : "transform 0.5s cubic-bezier(.16,1,.3,1)" }}>
              {atlasClusters.map((c) => (
                <g key={c.id} aria-hidden="true">
                  <circle cx={c.cx} cy={c.cy} r="230" fill={c.color} opacity="0.05" />
                  <circle cx={c.cx} cy={c.cy} r="230" fill="none" stroke={c.color} strokeOpacity="0.14" strokeDasharray="2 10" />
                  <text x={c.cx} y={c.cy - 250} textAnchor="middle" fill={c.color} fillOpacity="0.75" fontSize="26" fontFamily="Bebas Neue, sans-serif" letterSpacing="4">{c.name.toUpperCase()}</text>
                </g>
              ))}
              {atlasEdges.map(([a, b]) => {
                const A = getNode(a)!;
                const B = getNode(b)!;
                const on = a === selected || b === selected;
                const mx = (A.x + B.x) / 2 + (B.y - A.y) * 0.12;
                const my = (A.y + B.y) / 2 - (B.x - A.x) * 0.12;
                return <path key={a + b} d={`M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}`} fill="none" stroke={on ? "#F7C65B" : colorOf(A)} strokeOpacity={on ? 0.9 : 0.28} strokeWidth={on ? 3 : 1.6} strokeDasharray={on ? undefined : "6 8"} aria-hidden="true" />;
              })}
              {atlasNodes.map((n) => {
                const c = colorOf(n);
                const sel = n.id === selected;
                const big = n.kind === "cluster";
                const R = big ? 26 : 15;
                return (
                  <g
                    key={n.id}
                    data-node={n.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={sel}
                    aria-label={`${n.label}. ${kindLabel[n.kind]}. ${n.question}`}
                    className="cursor-pointer outline-none [&:focus-visible_.ring]:opacity-100"
                    onClick={() => select(n.id, { scrollCard: true })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        select(n.id, { center: true, scrollCard: true });
                      }
                    }}
                    onFocus={() => setSelected(n.id)}
                  >
                    <circle className="ring opacity-0" cx={n.x} cy={n.y} r={R + 18} fill="none" stroke="#F7C65B" strokeWidth="3" />
                    <circle cx={n.x} cy={n.y} r={R + 26} fill={c} opacity={sel ? 0.22 : near.has(n.id) ? 0.12 : 0.06} />
                    <path d={starPath(big ? 8 : 4, R, big ? R * 0.62 : R * 0.32, n.x, n.y)} fill={n.status === "planned" ? "none" : c} stroke={c} strokeWidth={n.status === "planned" ? 2.5 : 0} className={sel ? "" : "twinkle"} style={{ animationDelay: `${(n.x % 7) * 0.4}s` }} />
                    {isVisited(n.id) && <circle cx={n.x + R} cy={n.y - R} r="7" fill="#26C4B3" stroke="#0b0a14" strokeWidth="2" />}
                    <text x={n.x} y={n.y + R + 30} textAnchor="middle" fill="#F6EBDC" fillOpacity={sel ? 1 : 0.78} fontSize={big ? 24 : 19} fontFamily="Inter, sans-serif" fontWeight={sel ? 700 : 500}>
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Controls */}
          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            <button type="button" className="grid h-11 w-11 place-items-center rounded-md border border-white/15 bg-black/60 text-lg text-cream" aria-label="Zoom in" onClick={() => zoomBy(1.25)}>+</button>
            <button type="button" className="grid h-11 w-11 place-items-center rounded-md border border-white/15 bg-black/60 text-lg text-cream" aria-label="Zoom out" onClick={() => zoomBy(1 / 1.25)}>−</button>
            <button type="button" className="grid h-11 w-11 place-items-center rounded-md border border-white/15 bg-black/60 font-mono text-[0.6rem] uppercase text-cream" aria-label="Reset map" data-testid="atlas-reset" onClick={() => setView(HOME)}>Reset</button>
          </div>
          <p className="absolute left-3 top-3 rounded bg-black/60 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-cream/70">
            ✦ {visitedCount}/{atlasNodes.length} charted · zoom {view.k.toFixed(1)}×
          </p>

          {/* Minimap */}
          <svg
            viewBox={`0 0 ${ATLAS_W} ${ATLAS_H}`}
            className="absolute bottom-3 right-3 hidden w-40 cursor-pointer rounded-md border border-white/15 bg-black/70 sm:block"
            role="img"
            aria-label="Minimap. Click to move the view."
            onClick={(e) => {
              const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
              const wx = ((e.clientX - r.left) / r.width) * ATLAS_W;
              const wy = ((e.clientY - r.top) / r.height) * ATLAS_H;
              setView((v) => ({ ...v, x: ATLAS_W / 2 - wx * v.k, y: ATLAS_H / 2 - wy * v.k }));
            }}
          >
            {atlasNodes.map((n) => (
              <circle key={n.id} cx={n.x} cy={n.y} r={n.kind === "cluster" ? 26 : 14} fill={colorOf(n)} opacity={n.id === selected ? 1 : 0.6} />
            ))}
            <rect x={vp.x} y={vp.y} width={vp.w} height={vp.h} fill="none" stroke="#F7C65B" strokeWidth="18" />
          </svg>
        </div>

        {/* Station card */}
        <aside aria-live="polite" className="card card-bar flex flex-col p-6" data-testid="atlas-card">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: colorOf(node) }}>{kindLabel[node.kind]}</span>
            {node.status === "planned" ? <Tag kind="planned" /> : node.status === "sample" ? <Tag kind="sample" /> : <Tag kind="verified">Live page</Tag>}
          </div>
          <h2 className="mt-2 text-4xl leading-none text-cream">{node.label}</h2>
          {node.arabic && <p lang="ar" className="ar text-2xl" style={{ color: colorOf(node) }}>{node.arabic}</p>}
          <p className="mt-3 font-serif text-lg italic text-cream/85">{node.question}</p>
          <p className="mt-2 text-sm text-cream/70">{node.summary}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-2"><dt className="text-cream/65">Path</dt><dd className="text-cream">{node.path}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-cream/65">You already</dt><dd className="text-right text-cream">{isVisited(node.id) ? "charted this star ✓" : "haven't visited yet"}</dd></div>
          </dl>
          {near.size > 0 && (
            <div className="mt-4">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-cream/65">Connected stars</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[...near].map((id) => (
                  <button key={id} type="button" className="chip min-h-9 hover:text-cream" onClick={() => select(id, { center: true, scrollCard: true })}>✦ {getNode(id)?.label}</button>
                ))}
              </div>
            </div>
          )}
          {node.referenceId && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gold">Read the passage</summary>
              <div className="mt-3"><QuranPassage id={node.referenceId} compact /></div>
            </details>
          )}
          <div className="mt-auto pt-6">
            {node.status === "planned" ? (
              <span className="btn btn-ghost w-full" aria-disabled="true">Planned — not built yet</span>
            ) : (
              <Link href={node.href} className="btn btn-primary w-full" data-testid="enter-star">Enter this star ⟶</Link>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile star-path story cards */}
      <div className="lg:hidden">
        <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cream/65">{"// "}Swipe the star path</p>
        <ul ref={cardsRef} className="scroll-x -mx-4 flex gap-3 px-4 pb-2" aria-label="Star path cards">
          {atlasNodes.map((n) => (
            <li key={n.id} data-card={n.id} className="w-[78%] shrink-0">
              <button type="button" onClick={() => select(n.id, { center: true })} aria-pressed={n.id === selected} className={`card block h-full w-full p-5 text-left ${n.id === selected ? "border-amber" : ""}`} style={{ borderTop: `3px solid ${colorOf(n)}` }}>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em]" style={{ color: colorOf(n) }}>{kindLabel[n.kind]}</span>
                <span className="mt-1 block font-display text-2xl leading-none text-cream">{n.label}</span>
                <span className="mt-2 block text-sm text-cream/70">{n.question}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

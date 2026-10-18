/**
 * Original generative artwork for the Celestial Majlis: brand mark,
 * star fields, Cairo skyline, dunes and geometric stars. Everything is SVG,
 * deterministic (seeded) so server and client render identically, and
 * beautiful without JavaScript.
 */
import type { CSSProperties, ReactNode } from "react";

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Star polygon path with n points, centred at (cx, cy). */
export function starPath(n: number, R: number, r: number, cx = 0, cy = 0, rot = -Math.PI / 2) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = rot + (i * Math.PI) / n;
    pts.push(`${r2(cx + rad * Math.cos(a))},${r2(cy + rad * Math.sin(a))}`);
  }
  return `M${pts.join("L")}Z`;
}

/* ── Brand ──────────────────────────────────────────────────── */

/** Unendorsed signature study; UI names remain readable text. */
export function Mark({ size = 40, className = "", title = "Itachi's Corner" }: { size?: number; className?: string; title?: string }) {
  return <svg width={size} height={size} viewBox="0 0 128 128" className={className} role={title ? "img" : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : true}><image href="/brand/v4/favicon-study.svg" width="128" height="128" /></svg>;
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return <span className={`corner-wordmark ${compact ? "corner-wordmark-compact" : ""}`}><svg width="112" height="43" viewBox="0 0 334 128" aria-hidden="true"><image href="/brand/v4/itachi-signature-dark.svg" width="334" height="128" /></svg><span><span className="sr-only">Itachi&rsquo;s </span>Corner</span></span>;
}

/* ── Sky ────────────────────────────────────────────────────── */

export function StarField({
  seed = 7,
  count = 140,
  width = 1440,
  height = 900,
  className = "",
  twinkle = true,
  style,
}: {
  seed?: number;
  count?: number;
  width?: number;
  height?: number;
  className?: string;
  twinkle?: boolean;
  style?: CSSProperties;
}) {
  const rnd = mulberry32(seed);
  const stars = Array.from({ length: count }, (_, i) => {
    const big = rnd() > 0.93;
    return {
      i,
      x: r2(rnd() * width),
      y: r2(Math.pow(rnd(), 1.4) * height),
      r: r2(big ? 1.3 + rnd() * 1.2 : 0.4 + rnd() * 0.8),
      o: r2(0.35 + rnd() * 0.65),
      d: r2(rnd() * 6),
      warm: rnd() > 0.82,
      big,
    };
  });
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" className={className} style={style} aria-hidden="true">
      {stars.map((s) =>
        s.big ? (
          <path
            key={s.i}
            d={starPath(4, s.r * 3.2, s.r * 0.6, s.x, s.y)}
            fill={s.warm ? "#F7D79B" : "#F4EEFF"}
            opacity={s.o}
            className={twinkle ? "twinkle" : undefined}
            style={twinkle ? { animationDelay: `${s.d}s` } : undefined}
          />
        ) : (
          <circle
            key={s.i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={s.warm ? "#F7D79B" : "#EDE7FF"}
            opacity={s.o}
            className={twinkle && s.i % 3 === 0 ? "twinkle" : undefined}
            style={twinkle && s.i % 3 === 0 ? { animationDelay: `${s.d}s` } : undefined}
          />
        ),
      )}
    </svg>
  );
}

export function Crescent({ size = 90, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="moon-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#F7D79B" stopOpacity="0.35" />
          <stop offset="1" stopColor="#F7D79B" stopOpacity="0" />
        </radialGradient>
        <mask id="moon-cut">
          <rect width="100" height="100" fill="#fff" />
          <circle cx="62" cy="40" r="26" fill="#000" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#moon-glow)" />
      <circle cx="50" cy="50" r="28" fill="#FBE7BE" mask="url(#moon-cut)" />
    </svg>
  );
}

/* ── Cairo skyline (Mamluk / Fatimid inspired silhouette) ──── */

function dome(x: number, w: number, base: number, ground: number, rise = 0.95) {
  const top = ground - base;
  const h = w * rise;
  const cx = x + w / 2;
  // Drum, then a slightly pointed (Mamluk) dome with a finial.
  return [
    `M${x},${ground}V${top}`,
    `C${x},${top - h * 0.55} ${cx - w * 0.12},${top - h * 0.92} ${cx},${top - h}`,
    `C${cx + w * 0.12},${top - h * 0.92} ${x + w},${top - h * 0.55} ${x + w},${top}`,
    `V${ground}Z`,
    `M${cx - 1.2},${top - h}V${top - h - w * 0.28}H${cx + 1.2}V${top - h}Z`,
  ].join("");
}

function minaret(x: number, h: number, ground: number, w = 16) {
  const t1 = ground - h * 0.45;
  const t2 = ground - h * 0.75;
  const t3 = ground - h;
  const cx = x + w / 2;
  return [
    `M${x},${ground}V${t1}H${x - 3}V${t1 - 4}H${x + w + 3}V${t1}H${x + w}V${ground}Z`,
    `M${x + 2},${t1 - 4}V${t2}H${x - 1}V${t2 - 4}H${x + w + 1}V${t2}H${x + w - 2}V${t1 - 4}Z`,
    `M${x + 4},${t2 - 4}V${t3 + 10}H${x + w - 4}V${t2 - 4}Z`,
    // pear-shaped mabkhara finial
    `M${x + 4},${t3 + 10}C${x + 1},${t3 + 2} ${cx - 2},${t3 - 6} ${cx},${t3 - 12}C${cx + 2},${t3 - 6} ${x + w - 1},${t3 + 2} ${x + w - 4},${t3 + 10}Z`,
    `M${cx - 0.8},${t3 - 12}V${t3 - 20}H${cx + 0.8}V${t3 - 12}Z`,
  ].join("");
}

export function Skyline({ className = "", fill = "#0E0B1C", accent = true }: { className?: string; fill?: string; accent?: boolean }) {
  const G = 300;
  const parts = [
    `M0,${G}V250H90V236H150V250H210V${G}Z`,
    dome(60, 70, 40, 250),
    minaret(180, 150, 250),
    `M230,${G}V214H420V${G}Z`,
    dome(270, 110, 36, 214, 1.0),
    minaret(240, 190, 214, 18),
    minaret(400, 170, 214, 15),
    `M440,${G}V262H560V${G}Z`,
    dome(470, 56, 22, 262),
    `M590,${G}V224H780V${G}Z`,
    dome(625, 120, 30, 224, 0.9),
    minaret(760, 205, 224, 18),
    minaret(600, 160, 224, 14),
    `M820,${G}V256H930V${G}Z`,
    dome(845, 60, 24, 256),
    `M960,${G}V230H1120V${G}Z`,
    dome(990, 96, 32, 230),
    minaret(1100, 176, 230, 16),
    `M1150,${G}V258H1260V${G}Z`,
    dome(1170, 70, 20, 258, 0.85),
    `M1280,${G}V244H1440V${G}Z`,
    minaret(1320, 150, 244, 15),
    dome(1360, 64, 26, 244),
  ];
  return (
    <svg viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <path d={parts.join("")} fill={fill} />
      {accent &&
        [282, 318, 652, 706, 1012, 1046, 92].map((x, i) => (
          <rect key={i} x={x} y={i % 2 ? 268 : 276} width="5" height="9" rx="2.5" fill="#F7C65B" opacity={0.55 + (i % 3) * 0.15} />
        ))}
    </svg>
  );
}

export function Dunes({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="dune-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A2346" />
          <stop offset="1" stopColor="#1A1226" />
        </linearGradient>
        <linearGradient id="dune-b" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5B3446" />
          <stop offset="0.5" stopColor="#8C5546" />
          <stop offset="1" stopColor="#4A2C44" />
        </linearGradient>
        <linearGradient id="dune-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B1428" />
          <stop offset="1" stopColor="#0B0A14" />
        </linearGradient>
      </defs>
      <path d="M0,90 C220,40 380,120 620,80 C860,40 1040,110 1240,70 C1330,52 1400,60 1440,66 V220 H0Z" fill="url(#dune-b)" opacity="0.65" />
      <path d="M0,130 C200,90 420,160 700,120 C980,80 1180,150 1440,110 V220 H0Z" fill="url(#dune-a)" />
      <path d="M0,170 C260,140 520,200 860,165 C1100,140 1300,180 1440,160 V220 H0Z" fill="url(#dune-c)" />
    </svg>
  );
}

/* ── Geometry ───────────────────────────────────────────────── */

/** A 12-point rosette medallion — stands in for a portrait until one is approved. */
export function Medallion({ className = "", children }: { className?: string; children?: ReactNode }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="med-bg" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#3B2A5C" />
          <stop offset="0.7" stopColor="#1A1430" />
          <stop offset="1" stopColor="#0B0A14" />
        </radialGradient>
        <linearGradient id="med-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F8DFA6" />
          <stop offset="1" stopColor="#B9823C" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="196" fill="url(#med-bg)" stroke="url(#med-gold)" strokeOpacity="0.6" strokeWidth="2" />
      <circle cx="200" cy="200" r="178" fill="none" stroke="#D7AD65" strokeOpacity="0.25" strokeDasharray="2 6" />
      {petals.map((a) => (
        <g key={a} transform={`rotate(${a} 200 200)`}>
          <path d="M200 40 L222 120 L200 160 L178 120Z" fill="none" stroke="url(#med-gold)" strokeWidth="1.4" strokeOpacity="0.7" />
          <circle cx="200" cy="52" r="3" fill="#F7C65B" opacity="0.8" />
        </g>
      ))}
      <path d={starPath(12, 120, 84, 200, 200)} fill="none" stroke="url(#med-gold)" strokeWidth="1.6" />
      <path d={starPath(8, 76, 50, 200, 200, -Math.PI / 8)} fill="#21183C" stroke="#FA536D" strokeOpacity="0.8" strokeWidth="1.6" />
      <path d={starPath(8, 76, 50, 200, 200, 0)} fill="none" stroke="url(#med-gold)" strokeOpacity="0.7" strokeWidth="1.2" />
      <circle cx="200" cy="200" r="34" fill="#141025" stroke="url(#med-gold)" strokeWidth="1.4" />
      {children}
    </svg>
  );
}

export function GeoStar({ n = 8, size = 28, className = "", color = "currentColor", fill = "none" }: { n?: number; size?: number; className?: string; color?: string; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" className={className} aria-hidden="true">
      <path d={starPath(n, 46, n >= 10 ? 34 : 26)} fill={fill} stroke={color} strokeWidth="4" strokeLinejoin="round" />
      <circle r="8" fill={color} />
    </svg>
  );
}

/** Ornamental star-and-arch separator for long scrolls. */
export function Separator({ className = "" }: { className?: string }) {
  return (
    <div className={`divider-star ${className}`} aria-hidden="true">
      <svg width="64" height="20" viewBox="0 0 64 20">
        <path d={starPath(8, 9, 4.5, 32, 10)} fill="currentColor" />
        <circle cx="12" cy="10" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="52" cy="10" r="2" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
}

/** Pointed-arch doorway frame used for chapter portals. */
export function ArchFrame({ className = "", stroke = "#D7AD65" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true">
      <path d="M10 260V110C10 50 60 14 100 4C140 14 190 50 190 110V260" fill="none" stroke={stroke} strokeWidth="2" />
      <path d="M26 260V114C26 64 66 32 100 22C134 32 174 64 174 114V260" fill="none" stroke={stroke} strokeOpacity="0.45" strokeWidth="1.2" />
      <path d={starPath(8, 16, 8, 100, 74)} fill="none" stroke={stroke} strokeWidth="1.4" />
    </svg>
  );
}

/** Small direction cue drawn in SVG so it does not depend on font glyph coverage. */
export function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>;
}

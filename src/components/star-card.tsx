"use client";

import { forwardRef } from "react";
import { mulberry32, starPath } from "@/components/art";
import { constellations, intentions, levelFor } from "@/lib/progression";
import type { Profile } from "@/lib/types";

/** The Explorer's Star Card: a unique constellation seeded from the member. */
export const StarCard = forwardRef<SVGSVGElement, { profile: Profile; xp: number; badges: number }>(function StarCard({ profile, xp, badges }, ref) {
  const c = constellations.find((x) => x.id === profile.constellation) ?? constellations[0];
  const rnd = mulberry32(profile.starSeed || 1);
  const pts = Array.from({ length: 7 }, (_, i) => ({ x: 330 + rnd() * 230, y: 50 + rnd() * 200, lit: i < 2 + badges }));
  const lvl = levelFor(xp).level;
  const intention = intentions.find((i) => i.id === profile.intention)?.label ?? "Explorer";
  return (
    <svg ref={ref} viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl shadow-[0_30px_70px_-30px_rgba(250,83,109,0.6)]" role="img" aria-label={`Explorer's Star Card for ${profile.nickname}: ${c.name}, ${lvl.name}, ${xp} credits`}>
      <defs>
        <linearGradient id="sc-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0B0A14" />
          <stop offset="0.55" stopColor="#21183C" />
          <stop offset="1" stopColor="#5a1a2e" />
        </linearGradient>
        <linearGradient id="sc-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FA536D" />
          <stop offset="1" stopColor="#F7C65B" />
        </linearGradient>
      </defs>
      <rect width="600" height="340" rx="20" fill="url(#sc-bg)" />
      <rect x="1.5" y="1.5" width="597" height="337" rx="19" fill="none" stroke="url(#sc-edge)" strokeOpacity="0.7" strokeWidth="2" />
      {Array.from({ length: 50 }, (_, i) => (
        <circle key={i} cx={(i * 173) % 600} cy={(i * 97) % 340} r={i % 9 === 0 ? 1.6 : 0.8} fill="#F6EBDC" opacity="0.45" />
      ))}
      <polyline points={pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} fill="none" stroke={c.color} strokeOpacity="0.55" strokeDasharray="3 5" />
      {pts.map((p, i) => (
        <path key={i} d={starPath(4, p.lit ? 10 : 5, p.lit ? 3 : 1.6, p.x, p.y)} fill={p.lit ? c.color : "#7d7596"} />
      ))}
      <path d="M44 34 L62 44.5 V65.5 L44 76 L26 65.5 V44.5 Z" fill="#FA536D" />
      <path d={starPath(8, 11, 6, 44, 55)} fill="none" stroke="#FFF0CC" strokeWidth="1.6" />
      <text x="76" y="52" fill="#F6EBDC" fontFamily="Bebas Neue, Impact, sans-serif" fontSize="22" letterSpacing="2">ITACHI&apos;S CORNER</text>
      <text x="76" y="68" fill="#D7AD65" fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2">EXPLORER&apos;S STAR CARD</text>
      <text x="32" y="150" fill="#F6EBDC" fontFamily="Bebas Neue, Impact, sans-serif" fontSize="52">{profile.nickname.toUpperCase().slice(0, 16)}</text>
      <text x="32" y="178" fill="#FA536D" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="2">{`${lvl.name.toUpperCase()} · ${xp} CREDITS`}</text>
      <text x="32" y="232" fill={c.color} fontFamily="Georgia, serif" fontStyle="italic" fontSize="22">{c.name}</text>
      <text x="32" y="254" fill="#F6EBDC" fillOpacity="0.65" fontFamily="Inter, sans-serif" fontSize="12">{intention} · since {new Date(profile.joinedAt).toLocaleDateString("en", { month: "short", year: "numeric" })}</text>
      {profile.flair && <text x="32" y="276" fill="#F7C65B" fontFamily="Inter, sans-serif" fontSize="11">✦ {profile.flair}</text>}
      <text x="32" y="316" fill="#F6EBDC" fillOpacity="0.45" fontFamily="JetBrains Mono, monospace" fontSize="8.5" letterSpacing="1">LEVELS = APP PARTICIPATION ONLY · INDEPENDENT CONCEPT, NOT ENDORSED</text>
    </svg>
  );
});

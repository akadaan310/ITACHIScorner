"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { starPath } from "@/components/art";
import { StarCard } from "@/components/star-card";
import { ProgressBar, Tag } from "@/components/ui";
import { adapters } from "@/lib/adapters";
import { events, getEvent } from "@/lib/fixtures/events";
import { getTriviaSet } from "@/lib/fixtures/trivia";
import { LEVEL_DISCLAIMER, badges, levelFor, quests, scoreAttempt, streaks, totalXp, type QuestState } from "@/lib/progression";
import { exportData, useDemo, useHydrated, type DemoState } from "@/lib/store";
import type { DemoRole, Platform } from "@/lib/types";

const tabs = [
  { href: "/me", label: "Profile" },
  { href: "/me/constellation", label: "Constellation" },
  { href: "/me/quests", label: "Quests" },
  { href: "/me/afterglow", label: "Afterglow" },
  { href: "/me/journal", label: "Journal" },
  { href: "/me/settings", label: "Settings" },
];

export function useQuestState(): QuestState {
  const s = useDemo();
  return {
    checkIns: new Set(s.checkIns.filter((c) => c.kind === "app-check-in").map((c) => c.eventId)).size,
    triviaDone: Object.values(s.trivia).some((t) => t.finishedAt && !t.practice),
    journal: s.journal.length,
    dojoDone: s.dojo.completed,
    starsVisited: s.visitedStars.length,
    momentsSaved: s.savedMoments.length,
    sanctuaryOpened: s.sanctuaryOpened.length > 0,
  };
}

/** Member shell: tabs + signed-out gate. */
export function MemberFrame({ title, children, allowGuest = false }: { title: string; children: ReactNode; allowGuest?: boolean }) {
  const path = usePathname();
  const hydrated = useHydrated();
  const profile = useDemo((s) => s.profile);
  const role = useDemo((s) => s.role);
  const loadRole = useDemo((s) => s.loadRole);
  return (
    <div className="pb-10">
      <div className="shell pt-8">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">My journey</p>
          {hydrated && profile && <Tag kind="demo">Demo profile · {role.replace("-", " ")}</Tag>}
        </div>
        <h1 className="mt-2 text-6xl leading-[0.9] text-cream sm:text-7xl">{title}</h1>
        <nav aria-label="My journey sections" className="scroll-x -mx-4 mt-6 flex gap-1 border-b border-white/10 px-4">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href} aria-current={path === t.href ? "page" : undefined} className={`relative shrink-0 whitespace-nowrap px-3 py-3 text-[0.72rem] font-bold uppercase tracking-[0.12em] ${path === t.href ? "text-coral" : "text-cream/60 hover:text-cream"}`}>
              {t.label}
              {path === t.href && <span className="absolute inset-x-3 -bottom-px h-[2px] bg-coral" />}
            </Link>
          ))}
        </nav>
      </div>
      <div className="shell mt-8">
        {!hydrated ? (
          <div className="card p-8 text-cream/60">Loading your journey…</div>
        ) : !profile && !allowGuest ? (
          <div className="card hud mx-auto max-w-xl p-8 text-center" data-testid="signed-out">
            <p className="font-display text-5xl text-cream">Your star is waiting.</p>
            <p className="mt-2 text-cream/70">Join free to keep progress, or load a clearly-labelled demo profile to look around.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/join" className="btn btn-primary">Join the Ranks</Link>
              <button type="button" className="btn btn-ghost" onClick={() => loadRole("return-member")} data-testid="load-demo">Load demo profile</button>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function StreakTrio() {
  const checkIns = useDemo((s) => s.checkIns);
  const st = streaks(checkIns, events);
  const items = [
    { v: st.appStreak, l: "Corner streak", tag: <Tag kind="verified">In-app</Tag>, help: "Consecutive lives with an in-app check-in." },
    { v: st.selfReported, l: "Self-reported", tag: <Tag kind="self-entered">Self</Tag>, help: "Lives you said you watched. Not verified." },
    { v: st.platformVerified, l: "Platform-verified", tag: <Tag kind="unavailable">Not connected</Tag>, help: "Requires an authorised integration. None exists." },
  ];
  return (
    <ul className="grid gap-3 sm:grid-cols-3" data-testid="streaks">
      {items.map((i) => (
        <li key={i.l} className="card p-4">
          <div className="flex items-center justify-between gap-2">{i.tag}<span className="font-display text-4xl leading-none text-cream">{i.v}</span></div>
          <p className="mt-2 font-semibold text-cream">{i.l}</p>
          <p className="text-xs text-cream/60">{i.help}</p>
        </li>
      ))}
    </ul>
  );
}

export function ProfileOverview() {
  const s = useDemo();
  const xp = totalXp(s.xp);
  const lv = levelFor(xp);
  const qs = useQuestState();
  const since = s.previousVisit ? new Date(s.previousVisit) : null;
  const newSince = since ? s.xp.filter((e) => new Date(e.at) > since).length : 0;
  const cardRef = useRef<SVGSVGElement>(null);
  if (!s.profile) return null;
  return (
    <div className="space-y-6">
      {s.notices.length > 0 && s.settings.showAchievements && (
        <ul className="space-y-2" aria-live="polite">
          {s.notices.slice(0, 3).map((n) => (
            <li key={n.id} className="flex items-center justify-between gap-3 rounded-lg border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-cream">
              <span>✦ {n.text}</span>
              <button type="button" className="text-xs underline" onClick={() => s.dismissNotice(n.id)}>Dismiss</button>
            </li>
          ))}
        </ul>
      )}
      {since && (
        <div className="card card-bar-coral p-5" data-testid="return-ritual">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-coral">{"// "}Welcome back</p>
          <p className="mt-1 text-cream">Last visit {since.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}. {newSince ? `${newSince} new entries in your ledger since then.` : "The sky kept your place."} Next: {qs.triviaDone ? "write tonight's reflection" : "try the First-30 challenge"}.</p>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <StarCard ref={cardRef} profile={s.profile} xp={xp} badges={s.badges.length} />
        </div>
        <div className="card p-6">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-gold">{"// "}Rank</p>
          <p className="mt-1 font-display text-5xl leading-none text-cream" data-testid="level-name">{lv.level.name}</p>
          <p className="mt-1 text-sm text-cream/65">{lv.level.blurb}</p>
          <div className="mt-4"><ProgressBar value={lv.progress} label="Progress to next rank" /></div>
          <p className="mt-2 font-mono text-xs text-cream/60" data-testid="xp-total">◆ {xp} credits{lv.next ? ` · ${lv.next.min - xp} to ${lv.next.name}` : ""}</p>
          <p className="mt-4 text-xs text-cream/65">{LEVEL_DISCLAIMER}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/me/constellation" className="btn btn-ghost !min-h-10">My constellation</Link>
            <Link href="/me/quests" className="btn btn-ghost !min-h-10">Quests</Link>
          </div>
        </div>
      </div>
      <StreakTrio />
      {s.settings.showAchievements && (
        <div className="card p-6">
          <div className="flex items-center justify-between gap-2"><h2 className="text-3xl text-cream">Badges</h2><span className="font-mono text-xs text-cream/65">{s.badges.length}/{badges.length}</span></div>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {badges.map((b) => {
              const got = s.badges.some((x) => x.id === b.id);
              return (
                <li key={b.id} className={`rounded-lg border p-3 text-center ${got ? "border-amber/50 bg-amber/10" : "border-white/10 opacity-60"}`} title={b.hint}>
                  <span className={`hex mx-auto grid h-12 w-12 text-xl ${got ? "bg-amber text-[#1a1206]" : "bg-white/10 text-cream/65"}`} aria-hidden="true">{b.glyph}</span>
                  <p className="mt-2 text-xs font-semibold text-cream">{b.name}</p>
                  <p className="text-[0.65rem] text-cream/65">{got ? "Unlocked" : b.hint}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ConstellationView() {
  const s = useDemo();
  const xp = totalXp(s.xp);
  const qs = useQuestState();
  const nodes = quests.map((q, i) => {
    const a = (i / quests.length) * Math.PI * 2 - Math.PI / 2;
    const done = q.measure(qs) >= q.goal;
    return { q, x: 300 + Math.cos(a) * 180, y: 230 + Math.sin(a) * 150, done, progress: Math.min(1, q.measure(qs) / q.goal) };
  });
  if (!s.profile) return null;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <figure className="card overflow-hidden p-4">
        <svg viewBox="0 0 600 460" className="w-full" role="img" aria-label={`Personal constellation: ${nodes.filter((n) => n.done).length} of ${nodes.length} quest stars lit`}>
          <defs>
            <radialGradient id="pc-bg" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stopColor="#2a1f4a" /><stop offset="1" stopColor="#0b0a14" /></radialGradient>
          </defs>
          <rect width="600" height="460" rx="16" fill="url(#pc-bg)" />
          {nodes.map((n, i) => {
            const nx = nodes[(i + 1) % nodes.length]!;
            return <line key={i} x1={n.x} y1={n.y} x2={nx.x} y2={nx.y} stroke="#F7C65B" strokeOpacity={n.done && nx.done ? 0.8 : 0.15} strokeDasharray={n.done && nx.done ? undefined : "4 6"} />;
          })}
          {nodes.map((n) => (
            <line key={`c-${n.q.id}`} x1="300" y1="230" x2={n.x} y2={n.y} stroke="#FA536D" strokeOpacity={0.1 + n.progress * 0.4} />
          ))}
          <path d={starPath(8, 34, 20, 300, 230)} fill="#FA536D" />
          <text x="300" y="290" textAnchor="middle" fill="#F6EBDC" fontSize="20" fontFamily="Bebas Neue, sans-serif" letterSpacing="2">{s.profile.nickname.toUpperCase()}</text>
          {nodes.map((n) => (
            <g key={n.q.id}>
              <circle cx={n.x} cy={n.y} r={24} fill="#F7C65B" opacity={n.done ? 0.2 : 0.04} />
              <path d={starPath(4, n.done ? 15 : 8, n.done ? 4.5 : 2.4, n.x, n.y)} fill={n.done ? "#F7C65B" : "#6d6688"} />
              <text x={n.x} y={n.y + 38} textAnchor="middle" fill="#F6EBDC" fillOpacity={n.done ? 0.95 : 0.6} fontSize="13" fontFamily="Inter, sans-serif">{n.q.title}</text>
            </g>
          ))}
        </svg>
        <figcaption className="px-2 pt-3 text-sm text-cream/60">Each quest is a star. Complete it to light the star and the paths between them.</figcaption>
      </figure>
      <div className="card p-6">
        <h2 className="text-3xl text-cream">Credits ledger</h2>
        <p className="text-sm text-cream/60">Every credit names its reason. None can be bought.</p>
        <ul className="mt-4 max-h-96 space-y-1 overflow-y-auto pr-1" data-testid="ledger">
          {[...s.xp].reverse().map((e) => (
            <li key={e.key} className="flex items-center justify-between gap-2 border-b border-white/5 py-2 text-sm">
              <span className="text-cream/85">{e.reason}</span>
              <span className="font-mono text-amber">+{e.amount}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-display text-3xl text-cream">Total ◆ {xp}</p>
      </div>
    </div>
  );
}

export function QuestBoard() {
  const qs = useQuestState();
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {quests.map((q) => {
        const v = Math.min(q.goal, q.measure(qs));
        const done = v >= q.goal;
        return (
          <li key={q.id} className={`card p-6 ${done ? "border-teal/50" : ""}`} data-testid={`quest-${q.id}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-coral">{q.world}</span>
              {done ? <span className="tag-verified">Complete</span> : <span className="font-mono text-xs text-cream/60">{v}/{q.goal}</span>}
            </div>
            <h3 className="mt-2 text-3xl text-cream">{q.title}</h3>
            <p className="mt-1 text-sm text-cream/70">{q.body}</p>
            <div className="mt-4"><ProgressBar value={v / q.goal} label={`${q.title} progress`} color={done ? "#26C4B3" : undefined} /></div>
            {!done && <Link href={q.href} className="btn btn-ghost mt-4 !min-h-10">Go</Link>}
          </li>
        );
      })}
      <li className="card p-6 md:col-span-2">
        <h3 className="text-3xl text-cream">Collaborative goal <span className="align-middle"><Tag kind="demo">Demo</Tag></span></h3>
        <p className="mt-1 text-sm text-cream/70">“Light 1,000 reflection stars together.” A shared, optional goal — shown here as a design concept with no real community count.</p>
      </li>
    </ul>
  );
}

export function MyAfterglow() {
  const s = useDemo();
  const set = getTriviaSet("trivia-signs")!;
  const attempt = s.trivia["trivia-signs"];
  const score = attempt?.finishedAt ? scoreAttempt(set, attempt) : null;
  return (
    <div className="space-y-6">
      <StreakTrio />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-3xl text-cream">Attendance history</h2>
          <p className="text-sm text-cream/60">Each entry shows its evidence source.</p>
          {s.checkIns.length === 0 ? (
            <p className="mt-4 text-cream/60">No check-ins yet. <Link href="/afterglow/live" className="underline">Try the demo live</Link>.</p>
          ) : (
            <ul className="mt-4 space-y-2" data-testid="attendance">
              {s.checkIns.map((c, i) => (
                <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 p-3 text-sm">
                  <span className="text-cream">{getEvent(c.eventId)?.title ?? c.eventId}</span>
                  <span className="flex items-center gap-2">
                    {c.kind === "app-check-in" ? <Tag kind="verified">In-app check-in</Tag> : c.kind === "self-reported" ? <Tag kind="self-entered">Self-reported</Tag> : <Tag kind="self-entered">Intent only</Tag>}
                    <span className="font-mono text-[0.6rem] text-cream/65">{c.provenance.source}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card p-6">
          <h2 className="text-3xl text-cream">Trivia results</h2>
          {score ? (
            <p className="mt-3 text-cream"><span className="font-display text-5xl">{score.correct}/{score.total}</span> <span className="text-cream/60">· {attempt!.practice ? "practice" : `+${score.xp} credits`}</span></p>
          ) : (
            <p className="mt-3 text-cream/60">No completed challenge yet.</p>
          )}
          <Link href="/afterglow/live" className="btn btn-ghost mt-4 !min-h-10">Open the First-30</Link>
        </div>
      </div>
      <div className="card p-6">
        <h2 className="text-3xl text-cream">Saved moments</h2>
        {s.savedMoments.length === 0 ? (
          <p className="mt-3 text-cream/60">Star moments in any Afterglow recap to keep them here.</p>
        ) : (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {s.savedMoments.map((key) => {
              const [eid, mid] = key.split(":");
              const ev = getEvent(eid!);
              const m = ev?.recap?.moments.find((x) => x.id === mid);
              return (
                <li key={key}>
                  <Link href={`/afterglow/episodes/${eid}#${mid}`} className="card card-hover block p-4">
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider text-coral">{ev?.title}</span>
                    <span className="mt-1 block text-cream">★ {m?.label ?? key}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export function JournalView() {
  const s = useDemo();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <form className="card p-6" onSubmit={(e) => { e.preventDefault(); if (!body.trim()) return; s.addJournal({ title: title.trim() || "Untitled reflection", body: body.trim() }); setTitle(""); setBody(""); }}>
        <h2 className="text-3xl text-cream">New reflection</h2>
        <label htmlFor="j-title" className="mt-4 block text-sm text-cream/70">Title</label>
        <input id="j-title" className="field mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label htmlFor="j-body" className="mt-3 block text-sm text-cream/70">Reflection</label>
        <textarea id="j-body" className="field mt-1 min-h-36" value={body} onChange={(e) => setBody(e.target.value)} placeholder="What question is still glowing?" />
        <button type="submit" className="btn btn-primary mt-4" data-testid="journal-add">Save reflection</button>
        <p className="mt-2 text-xs text-cream/65">Private · stored only in this browser.</p>
      </form>
      <div>
        {s.journal.length === 0 ? (
          <div className="card p-8 text-center text-cream/60">Your journal is a quiet sky. Write the first star.</div>
        ) : (
          <ul className="space-y-3" data-testid="journal-list">
            {s.journal.map((j) => (
              <li key={j.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-wider text-cream/65">{new Date(j.at).toLocaleString()}{j.eventId ? ` · ${getEvent(j.eventId)?.title ?? ""}` : ""}</p>
                    <h3 className="mt-1 text-2xl text-cream">{j.title}</h3>
                  </div>
                  <button type="button" className="text-xs text-cream/60 underline" onClick={() => s.removeJournal(j.id)}>Delete</button>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-cream/80">{j.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const roles: { id: DemoRole; label: string }[] = [
  { id: "signed-out", label: "Signed out" },
  { id: "new-member", label: "New member" },
  { id: "return-member", label: "Return member" },
  { id: "free-member", label: "Free member" },
  { id: "patron-preview", label: "Patron preview" },
  { id: "moderator", label: "Moderator" },
];

export function DemoStateSwitcher() {
  const role = useDemo((s) => s.role);
  const load = useDemo((s) => s.loadRole);
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Demo state">
      {roles.map((r) => (
        <button key={r.id} type="button" role="radio" aria-checked={role === r.id} onClick={() => load(r.id)} className={`min-h-10 rounded-md border px-3 text-sm ${role === r.id ? "border-coral bg-coral/15 text-cream" : "border-white/10 text-cream/70 hover:text-cream"}`}>
          {r.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, help, checked, onChange, testId }: { label: string; help?: string; checked: boolean; onChange: (v: boolean) => void; testId?: string }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-start justify-between gap-4 border-b border-white/5 py-3">
      <span>
        <span className="block text-cream">{label}</span>
        {help && <span className="text-xs text-cream/65">{help}</span>}
      </span>
      <input type="checkbox" role="switch" className="mt-1 h-5 w-9 shrink-0 cursor-pointer accent-[#FA536D]" checked={checked} onChange={(e) => onChange(e.target.checked)} data-testid={testId} />
    </label>
  );
}

export function SettingsView() {
  const s = useDemo();
  const [nick, setNick] = useState(s.profile?.nickname ?? "");
  const [handleDraft, setHandleDraft] = useState<Record<Platform, string>>({ tiktok: "", youtube: "" });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [msg, setMsg] = useState("");

  const doExport = () => {
    const url = URL.createObjectURL(new Blob([exportData(useDemo.getState() as DemoState)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "itachis-corner-my-data.json";
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Export downloaded.");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card p-6" aria-labelledby="s-profile">
        <h2 id="s-profile" className="text-3xl text-cream">Profile &amp; visibility</h2>
        <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (nick.trim().length >= 2) { s.updateProfile({ nickname: nick.trim().slice(0, 20) }); setMsg("Nickname updated."); } }}>
          <label htmlFor="s-nick" className="sr-only">Nickname</label>
          <input id="s-nick" className="field" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={20} />
          <button type="submit" className="btn btn-ghost">Save</button>
        </form>
        <fieldset className="mt-5">
          <legend className="text-sm text-cream/70">Profile visibility</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["private", "circle", "public"] as const).map((v) => (
              <label key={v} className={`flex min-h-11 cursor-pointer items-center justify-center rounded-md border text-sm capitalize ${s.settings.profileVisibility === v ? "border-coral bg-coral/10 text-cream" : "border-white/10 text-cream/70"}`}>
                <input type="radio" className="sr-only" name="vis" checked={s.settings.profileVisibility === v} onChange={() => s.updateSettings({ profileVisibility: v })} /> {v}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-cream/65">Demo only — nothing is published anywhere. Religious identity and journey are never shown publicly.</p>
        </fieldset>
        <div className="mt-4">
          <Toggle label="Appear on the opt-in leaderboard" help="Pseudonym only. Ranks learning participation, never faith." checked={s.settings.leaderboardOptIn} onChange={(v) => s.updateSettings({ leaderboardOptIn: v })} testId="toggle-leaderboard" />
          <Toggle label="Show rankings" help="Turn off to mute all boards." checked={s.settings.showRankings} onChange={(v) => s.updateSettings({ showRankings: v })} testId="toggle-rankings" />
          <Toggle label="Show achievements & badges" checked={s.settings.showAchievements} onChange={(v) => s.updateSettings({ showAchievements: v })} testId="toggle-achievements" />
          <Toggle label="Milestone notices" checked={s.settings.milestoneNotices} onChange={(v) => s.updateSettings({ milestoneNotices: v })} />
          <Toggle label="Reduce motion" help="Overrides animations even if your system allows them." checked={s.settings.motion === "reduced"} onChange={(v) => s.updateSettings({ motion: v ? "reduced" : "system" })} testId="toggle-motion" />
        </div>
      </section>

      <section id="handles" className="card scroll-mt-24 p-6" aria-labelledby="s-handles">
        <h2 id="s-handles" className="text-3xl text-cream">Platform handles</h2>
        <p className="mt-1 text-sm text-cream/65">
          You can type your TikTok or YouTube name so friends recognise you. <strong className="text-cream">A typed handle does not prove you own the account</strong>, and we never use it to read comments or track attendance.
        </p>
        {(["tiktok", "youtube"] as Platform[]).map((p) => {
          const h = s.handles[p];
          return (
            <div key={p} className="mt-5 rounded-lg border border-white/10 p-4" data-testid={`handle-${p}`}>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-coral">{p === "tiktok" ? "TikTok" : "YouTube"}</p>
              {h ? (
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-cream">@{h.handle}</span>
                  <span className="flex items-center gap-2">
                    <Tag kind={h.status} />
                    <button type="button" className="btn btn-ghost !min-h-9" onClick={() => s.unbindHandle(p)} data-testid={`unbind-${p}`}>Unbind</button>
                  </span>
                </div>
              ) : (
                <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); s.setHandle(p, handleDraft[p]); setHandleDraft({ ...handleDraft, [p]: "" }); }}>
                  <label htmlFor={`h-${p}`} className="sr-only">{p} handle</label>
                  <input id={`h-${p}`} className="field" placeholder="@yourname" value={handleDraft[p]} onChange={(e) => setHandleDraft({ ...handleDraft, [p]: e.target.value })} />
                  <button type="submit" className="btn btn-ghost">Add</button>
                </form>
              )}
            </div>
          );
        })}
        <div className="mt-5 rounded-lg border border-white/10 p-4 text-sm">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-cream/60">Identity labels</p>
          <ul className="mt-2 space-y-1.5 text-cream/75">
            <li className="flex items-center gap-2"><Tag kind="self-entered" /> typed by you — proves nothing</li>
            <li className="flex items-center gap-2"><Tag kind="connected-via-provider" /> official login with consent — not available</li>
            <li className="flex items-center gap-2"><Tag kind="verified-event" /> confirmed attendance via authorised integration — not available</li>
          </ul>
        </div>
      </section>

      <section className="card p-6" aria-labelledby="s-consent">
        <h2 id="s-consent" className="text-3xl text-cream">Consent &amp; integrations</h2>
        <Toggle label="Allow future comment matching (if ever authorised)" help="Off by default. Even when on, nothing happens until an official, permitted integration exists." checked={s.settings.commentConsent} onChange={(v) => s.updateSettings({ commentConsent: v })} />
        <ul className="mt-4 space-y-2">
          {adapters.map((a) => {
            const st = a.status();
            return (
              <li key={st.source} className="rounded-lg border border-white/10 p-3 text-sm">
                <div className="flex items-center justify-between gap-2"><span className="font-semibold text-cream">{st.label}</span>{st.available ? <Tag kind="verified">Active</Tag> : <Tag kind="unavailable">Not connected</Tag>}</div>
                <p className="mt-1 text-xs text-cream/60">{st.reason}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card p-6" aria-labelledby="s-data">
        <h2 id="s-data" className="text-3xl text-cream">Your data</h2>
        <p className="mt-1 text-sm text-cream/65">Everything lives in this browser&rsquo;s storage. Export it, or erase it completely.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-ghost" onClick={doExport}>Export my data (JSON)</button>
          {!confirmDelete ? (
            <button type="button" className="btn btn-ghost !border-ruby text-coral" onClick={() => setConfirmDelete(true)} data-testid="reset-demo">Delete everything / reset demo</button>
          ) : (
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-cream">Erase all progress?</span>
              <button type="button" className="btn btn-primary" onClick={() => { s.resetAll(); setConfirmDelete(false); setMsg("All demo data erased."); }} data-testid="confirm-reset">Yes, erase</button>
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </span>
          )}
        </div>
        <h3 className="mt-6 text-2xl text-cream">Demo states</h3>
        <p className="text-xs text-cream/65">Switch between preset, clearly-labelled demo states.</p>
        <div className="mt-3"><DemoStateSwitcher /></div>
        {msg && <p role="status" className="mt-3 text-sm text-teal">{msg}</p>}
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { GeoStar } from "@/components/art";
import { StarCard } from "@/components/star-card";
import { constellations, intentions, languages, totalXp } from "@/lib/progression";
import { useDemo, useHydrated } from "@/lib/store";
import type { Intention } from "@/lib/types";

const STEPS = ["Nickname", "Intention", "Languages", "Constellation", "Star card"];

export function Onboarding() {
  const hydrated = useHydrated();
  const profile = useDemo((s) => s.profile);
  const join = useDemo((s) => s.join);
  const xp = useDemo((s) => totalXp(s.xp));
  const badgeCount = useDemo((s) => s.badges.length);
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [intention, setIntention] = useState<Intention | null>(null);
  const [langs, setLangs] = useState<string[]>(["English"]);
  const [constellation, setConstellation] = useState<string | null>(null);
  const [invite, setInvite] = useState("");
  const [error, setError] = useState("");
  const cardRef = useRef<SVGSVGElement>(null);

  if (!hydrated) return <div className="card p-8 text-cream/70">Preparing your invitation…</div>;

  if (profile && step < 4) {
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-4xl text-cream">You&rsquo;re already in the ranks, {profile.nickname}.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/me" className="btn btn-primary">My profile</Link>
          <Link href="/me/settings" className="btn btn-ghost">Settings</Link>
        </div>
      </div>
    );
  }

  const next = () => {
    setError("");
    if (step === 0) {
      const n = nickname.trim();
      if (n.length < 2 || n.length > 20) return setError("Choose a nickname between 2 and 20 characters.");
      if (!/^[\p{L}\p{N} _.-]+$/u.test(n)) return setError("Letters, numbers, spaces, dots, dashes and underscores only.");
    }
    if (step === 1 && !intention) return setError("Pick whichever feels closest — you can change it later.");
    if (step === 2 && langs.length === 0) return setError("Choose at least one language.");
    if (step === 3) {
      if (!constellation) return setError("Choose a starting constellation.");
      join({
        nickname: nickname.trim(),
        intention: intention!,
        languages: langs,
        constellation,
        flair: invite.trim() ? "Invited Star (cosmetic)" : undefined,
      });
    }
    setStep((s) => s + 1);
  };

  const download = () => {
    const svg = cardRef.current;
    if (!svg) return;
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "explorers-star-card.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="mb-6 grid grid-cols-5 gap-1" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s} className="text-center" aria-current={i === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full ${i <= step ? "bg-coral" : "bg-white/10"}`} />
            <span className={`mt-1.5 hidden font-mono text-[0.58rem] uppercase tracking-wider sm:block ${i === step ? "text-coral" : "text-cream/60"}`}>{s}</span>
          </li>
        ))}
      </ol>

      <form
        className="card card-bar-coral p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        noValidate
      >
        {step === 0 && (
          <div className="portal-enter">
            <label htmlFor="nick" className="font-display text-4xl text-cream">What should the ranks call you?</label>
            <p className="mt-1 text-sm text-cream/60">A nickname, not your real name. You can change it any time.</p>
            <input id="nick" className="field mt-4 text-lg" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="e.g. Nightjar" autoComplete="nickname" maxLength={20} aria-invalid={!!error} aria-describedby={error ? "ob-error" : undefined} />
            <label htmlFor="invite" className="mt-5 block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-cream/60">Invite code (optional · cosmetic flair only)</label>
            <input id="invite" className="field mt-2" value={invite} onChange={(e) => setInvite(e.target.value)} placeholder="Unlocks a decorative star, never content" />
          </div>
        )}
        {step === 1 && (
          <fieldset className="portal-enter">
            <legend className="font-display text-4xl text-cream">What brings you here?</legend>
            <p className="mt-1 text-sm text-cream/60">Private. Used only to suggest a gentle starting path.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {intentions.map((it) => (
                <label key={it.id} className={`flex min-h-16 cursor-pointer flex-col justify-center rounded-lg border p-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber ${intention === it.id ? "border-coral bg-coral/10" : "border-white/10 bg-black/20 hover:border-white/30"}`}>
                  <input type="radio" name="intention" className="sr-only" checked={intention === it.id} onChange={() => setIntention(it.id)} />
                  <span className="font-semibold text-cream">{it.label}</span>
                  <span className="text-sm text-cream/60">{it.blurb}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {step === 2 && (
          <fieldset className="portal-enter">
            <legend className="font-display text-4xl text-cream">Preferred languages</legend>
            <p className="mt-1 text-sm text-cream/60">Choose any. Content in more languages comes as it&rsquo;s reviewed.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {languages.map((l) => {
                const on = langs.includes(l);
                return (
                  <label key={l} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber ${on ? "border-coral bg-coral/10 text-cream" : "border-white/10 text-cream/75"}`}>
                    <input type="checkbox" className="sr-only" checked={on} onChange={() => setLangs(on ? langs.filter((x) => x !== l) : [...langs, l])} />
                    <span lang={/[؀-ۿ]/.test(l) ? "ar" : undefined} className={/[؀-ۿ]/.test(l) ? "ar text-lg leading-none" : ""}>{l}</span>
                    {on && <span aria-hidden="true">✓</span>}
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
        {step === 3 && (
          <fieldset className="portal-enter">
            <legend className="font-display text-4xl text-cream">Choose your starting constellation</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {constellations.map((c, i) => (
                <label key={c.id} className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber ${constellation === c.id ? "bg-white/[0.06]" : "border-white/10 bg-black/20"}`} style={constellation === c.id ? { borderColor: c.color } : undefined}>
                  <input type="radio" name="constellation" className="sr-only" checked={constellation === c.id} onChange={() => setConstellation(c.id)} />
                  <GeoStar n={[8, 10, 12, 8][i]} size={40} color={c.color} />
                  <span>
                    <span className="block font-display text-2xl leading-none text-cream">{c.name}</span>
                    <span lang="ar" className="ar block text-lg leading-tight" style={{ color: c.color }}>{c.arabic}</span>
                    <span className="text-sm text-cream/60">{c.blurb}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {step === 4 && profile && (
          <div className="text-center" data-testid="star-card-reveal">
            <p className="eyebrow justify-center">Welcome to the ranks</p>
            <h2 className="mt-2 text-5xl text-cream">Your Explorer&rsquo;s <em className="text-gold">Star Card</em></h2>
            <div className="mx-auto mt-6 max-w-lg animate-orbit">
              <StarCard ref={cardRef} profile={profile} xp={xp} badges={badgeCount} />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/me" className="btn btn-primary" data-testid="go-profile">Enter my profile</Link>
              <button type="button" className="btn btn-ghost" onClick={download}>Download card</button>
              <Link href="/afterglow/live" className="btn btn-ghost">Try the First-30</Link>
            </div>
            <p className="mt-4 text-xs text-cream/65">Demo profile stored only in this browser. No account, email or OAuth was created.</p>
          </div>
        )}
        {error && <p id="ob-error" role="alert" className="mt-4 text-sm text-coral">{error}</p>}
        {step < 4 && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => { setError(""); setStep((s) => Math.max(0, s - 1)); }} disabled={step === 0}>Back</button>
            <button type="submit" className="btn btn-primary" data-testid="ob-next">{step === 3 ? "Reveal my star card" : "Continue"}</button>
          </div>
        )}
      </form>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BeforeLounge } from "@/components/afterglow/before";
import { NextLiveCard, SampleChallenge } from "@/components/live-bits";
import { Tag } from "@/components/ui";
import { events, nextEvent } from "@/lib/fixtures/events";

export const metadata: Metadata = { title: "Before the live", description: "The anticipation lounge: countdown, reminders, warm-up poll and trivia." };

export default function BeforePage() {
  const next = nextEvent()!;
  return (
    <div data-world="afterglow" className="pb-10">
      <div className="shell pt-8">
        <nav aria-label="Breadcrumb" className="text-sm text-cream/60">
          <Link href="/afterglow" className="hover:text-cream">Afterglow</Link> <span aria-hidden="true">/</span> <span className="text-cream">Before the live</span>
        </nav>
        <p className="eyebrow mt-6">Act I · Before the live</p>
        <h1 className="mt-3 font-display text-4xl text-cream sm:text-5xl">The anticipation lounge</h1>
        <p className="mt-3 max-w-2xl text-cream/70">Warm up, set a reminder, then head to the official channel when it begins.</p>
      </div>

      <div className="shell mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <NextLiveCard event={next} />
        <SampleChallenge />
      </div>

      <div className="shell mt-6">
        <BeforeLounge eventId={next.id} />
      </div>

      <section className="shell mt-10" aria-labelledby="sched">
        <h2 id="sched" className="font-display text-3xl text-cream">Schedule</h2>
        <p className="mt-1 text-sm text-cream/60">A listing is “verified” only when the creator has announced it publicly. Everything here is sample.</p>
        <ul className="mt-5 grid gap-3">
          {events.map((e) => (
            <li key={e.id} className="card flex flex-wrap items-center gap-4 p-5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl font-display text-lg text-cosmic" style={{ background: `linear-gradient(135deg, ${e.palette[0]}, ${e.palette[1]})` }} aria-hidden="true">
                {e.status === "live" ? "●" : e.status === "scheduled" ? "☾" : "✦"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-cream">{e.title}</p>
                <p className="text-sm text-cream/60">{e.status === "scheduled" ? `In ${e.schedule.daysFromNow} days` : e.status === "live" ? "Happening now (simulated)" : `${Math.abs(e.schedule.daysFromNow)} days ago`} · {e.platforms.map((p) => (p === "tiktok" ? "TikTok" : "YouTube")).join(" & ")}</p>
              </div>
              <div className="flex gap-2">
                {e.scheduleVerification === "verified" ? <Tag kind="verified">Announced</Tag> : <Tag kind="sample">Sample listing</Tag>}
                {e.status === "live" && <Tag kind="simulated" />}
              </div>
              <Link className="btn btn-ghost !min-h-10 text-sm" href={e.status === "completed" ? `/afterglow/episodes/${e.id}` : e.status === "live" ? "/afterglow/live" : "/events"}>
                {e.status === "completed" ? "Recap" : e.status === "live" ? "Dock" : "Details"}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

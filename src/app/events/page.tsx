import type { Metadata } from "next";
import Link from "next/link";
import { NextLiveCard } from "@/components/live-bits";
import { ChapterHeader, PlatformIcon, Tag } from "@/components/ui";
import { creator } from "@/lib/config/creator";
import { events, nextEvent } from "@/lib/fixtures/events";

export const metadata: Metadata = { title: "Live Tonight", description: "Where to watch: Itachi's official TikTok and YouTube lives." };

const destinations = [
  { platform: "tiktok" as const, name: "TikTok Live", handle: "@dawahxdialogues", href: creator.links.tiktokLive, note: "Main TikTok. Lives appear on the profile when she is broadcasting." },
  { platform: "tiktok" as const, name: "Backup TikTok", handle: "@dawahxdialogueslive", href: creator.links.tiktokBackup, note: "Listed on the public hub as a backup account." },
  { platform: "youtube" as const, name: "YouTube Live", handle: "@dawahxdialogues", href: creator.links.youtubeLive, note: "Streams and past lives on the channel's Live tab." },
];

export default function EventsPage() {
  const next = nextEvent()!;
  return (
    <div data-world="afterglow" className="pb-10">
      <ChapterHeader eyebrow="Live tonight" title={<>The next live is on <em className="text-coral">TikTok &amp; YouTube.</em></>}>
        Itachi&rsquo;s Corner never hosts or rebroadcasts the live. Here is where to go — and how to make the night last.
      </ChapterHeader>
      <div className="shell grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <NextLiveCard event={next} />
        <section aria-labelledby="dest" className="card p-6">
          <h2 id="dest" className="text-3xl text-cream">Official destinations</h2>
          <p className="mt-1 text-xs text-cream/65">Checked against the public hub on {creator.linksCheckedAt}.</p>
          <ul className="mt-4 space-y-3">
            {destinations.map((d) => (
              <li key={d.name}>
                <a href={d.href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-lg border border-white/10 p-4 hover:border-coral/60">
                  <span className="hex grid h-10 w-10 shrink-0 bg-coral text-[#16070b]"><PlatformIcon platform={d.platform} /></span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl leading-none text-cream">{d.name} ↗</span>
                    <span className="font-mono text-xs text-coral">{d.handle}</span>
                    <span className="mt-1 block text-sm text-cream/65">{d.note}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-cream/65">Twitch: a configurable future connector only. There is no claim that she streams there.</p>
        </section>
      </div>
      <section className="shell mt-12" aria-labelledby="upcoming">
        <h2 id="upcoming" className="text-4xl text-cream">Upcoming &amp; recent</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {events.map((e) => (
            <li key={e.id} className="card p-5" style={{ borderTop: `3px solid ${e.palette[0]}` }}>
              <div className="flex flex-wrap gap-2"><Tag kind={e.status === "live" ? "simulated" : "sample"}>{e.kicker}</Tag></div>
              <h3 className="mt-2 text-3xl text-cream">{e.title}</h3>
              <p className="mt-1 text-sm text-cream/65">{e.description}</p>
              <Link className="btn btn-ghost mt-4 !min-h-10" href={e.status === "completed" ? `/afterglow/episodes/${e.id}` : e.status === "live" ? "/afterglow/live" : "/afterglow/before"}>
                {e.status === "completed" ? "Open the Afterglow" : e.status === "live" ? "Open the companion dock" : "Visit the lounge"}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

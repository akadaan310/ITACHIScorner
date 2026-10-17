import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHeader, Tag } from "@/components/ui";
import { events } from "@/lib/fixtures/events";

export const metadata: Metadata = { title: "Afterglow vault", description: "Weekly calendar and archive of Afterglow recaps." };

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function VaultPage() {
  // A relative 3-week grid (fixtures use days-from-today, so the vault never goes stale).
  const weeks = [-2, -1, 0].map((w) =>
    days.map((d, i) => {
      const offset = w * 7 + i - 3;
      const ev = events.find((e) => e.schedule.daysFromNow === offset || (e.status === "live" && offset === 0));
      return { d, offset, ev };
    }),
  );
  return (
    <div data-world="afterglow" className="pb-10">
      <ChapterHeader eyebrow="Afterglow vault" title={<>Every night, <em className="text-coral">kept.</em></>}>
        A weekly calendar of lives and their Afterglows. Sample data, arranged around today.
      </ChapterHeader>
      <section className="shell" aria-labelledby="cal">
        <div className="flex items-center justify-between gap-2">
          <h2 id="cal" className="text-3xl text-cream">Weekly calendar</h2>
          <Tag kind="sample">Sample calendar</Tag>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-1.5 text-sm">
            <thead>
              <tr>
                <th scope="col" className="sr-only">Week</th>
                {days.map((d) => (
                  <th key={d} scope="col" className="pb-1 text-left font-mono text-[0.65rem] uppercase tracking-widest text-cream/65">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, wi) => (
                <tr key={wi}>
                  <th scope="row" className="sr-only">{["Two weeks ago", "Last week", "This week"][wi]}</th>
                  {week.map((c) => (
                    <td key={c.offset} className={`h-24 rounded-lg border align-top ${c.offset === 0 ? "border-coral/60 bg-coral/5" : "border-white/[0.07] bg-white/[0.02]"}`}>
                      <div className="p-2">
                        <span className={`font-mono text-[0.65rem] ${c.offset === 0 ? "text-coral" : "text-cream/60"}`}>{c.offset === 0 ? "TODAY" : c.offset > 0 ? `+${c.offset}d` : `${c.offset}d`}</span>
                        {c.ev && (
                          <Link
                            href={c.ev.status === "completed" ? `/afterglow/episodes/${c.ev.id}` : c.ev.status === "live" ? "/afterglow/live" : "/afterglow/before"}
                            className="mt-1 block rounded-md px-2 py-1.5 text-xs font-semibold leading-tight text-[#16070b]"
                            style={{ background: `linear-gradient(135deg, ${c.ev.palette[0]}, ${c.ev.palette[1]})` }}
                          >
                            {c.ev.title}
                          </Link>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="shell mt-12" aria-labelledby="archive">
        <h2 id="archive" className="text-3xl text-cream">Archive</h2>
        <ul className="mt-4 grid gap-3">
          {events.map((e) => (
            <li key={e.id}>
              <Link href={e.status === "completed" ? `/afterglow/episodes/${e.id}` : e.status === "live" ? "/afterglow/live" : "/afterglow/before"} className="card card-hover flex flex-wrap items-center gap-4 p-5">
                <span className="hex h-12 w-12 font-display text-lg text-[#16070b]" style={{ background: e.palette[0] }}>{e.status === "completed" ? "✦" : e.status === "live" ? "●" : "☾"}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-2xl leading-none text-cream">{e.title}</span>
                  <span className="text-sm text-cream/60">{e.kicker} · {e.topics.join(", ")}</span>
                </span>
                <Tag kind={e.status === "live" ? "simulated" : "sample"} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

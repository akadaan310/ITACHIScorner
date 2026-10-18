import type { Metadata } from "next";
import Link from "next/link";
import { CreatorPortrait } from "@/components/creator-portrait";
import { AccountFrame } from "@/components/account/frame";
import { getAccountContext } from "@/lib/auth/session";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Creator workspace", robots: { index: false } };
export const dynamic = "force-dynamic";
interface QueueItem { kind: string; id: string; title: string; status: string; video_id: string | null; created_at: string }

export default async function CreatorWorkspace() {
  const context = await getAccountContext();
  const identity = <div className="studio-identity"><CreatorPortrait variant="avatar" caption={false} /><div><p className="public-eyebrow">Itachi’s Corner</p><p>Read-only editorial workspace · concept</p></div></div>;
  if (context.status === "unconfigured" || context.status === "unavailable") return <AccountFrame title="Creator workspace">{identity}<section className="card p-6"><h2 className="text-3xl text-cream">Creator access is unavailable.</h2><p className="mt-3 text-cream/75">The private workspace needs an authorized creator project and a trusted staff account. No research or creator records are available here.</p></section></AccountFrame>;
  if (context.status !== "authenticated" || context.staffRoles.length === 0) return <AccountFrame title="Creator workspace">{identity}<section className="card p-6"><h2 className="text-3xl text-cream">Staff access required.</h2><p className="mt-3 text-cream/75">Only staff provisioned by a trusted administrator can use this workspace.</p><Link className="btn btn-ghost mt-5" href={context.status === "signed-out" ? "/join?next=/studio/creator" : "/me"}>{context.status === "signed-out" ? "Sign in" : "My Corner"}</Link></section></AccountFrame>;
  const client = (await createServerSupabase())!;
  const { data, error } = await client.rpc("get_editorial_queue");
  const queue = (Array.isArray(data) ? data : []).filter((row): row is QueueItem => typeof row?.id === "string" && typeof row.title === "string" && typeof row.kind === "string" && typeof row.status === "string");
  const unavailable = Boolean(error) || !Array.isArray(data) || queue.length !== data.length;
  return <AccountFrame title="Creator workspace">{identity}<p className="text-cream/75">Signed in with trusted {context.staffRoles.join(", ")} access. Source gaps and editorial decisions below come from the private archive. This page does not publish or approve content.</p><section className="card p-6"><h2 className="text-3xl text-cream">Source gaps &amp; review queue</h2>{unavailable ? <p className="mt-4 text-cream/75" role="alert">The private queue could not be loaded. Check the project schema and staff permissions.</p> : queue.length === 0 ? <p className="mt-4 text-cream/75">No source gaps or pending reviews are recorded. A complete video inventory has not been established by this screen.</p> : <ul className="mt-5 divide-y divide-white/10">{queue.map((item) => <li className="py-4" key={`${item.kind}:${item.id}`}><p className="font-semibold text-cream">{item.title}</p><p className="mt-1 text-sm text-cream/65">{item.kind} · {item.status}{item.video_id ? ` · ${item.video_id}` : ""}</p></li>)}</ul>}</section><p className="text-sm text-cream/65">Creator permission, editorial review and scholarly review are separate gates. Raw transcripts remain private. Paid inference and publication require their own approvals.</p><Link href="/me" className="btn btn-ghost">My Corner</Link></AccountFrame>;
}

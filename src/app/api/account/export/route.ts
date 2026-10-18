import { NextResponse } from "next/server";
import { authenticatedRequest, PRIVATE_HEADERS } from "@/lib/auth/http";

const OWNER_TABLES = ["profiles", "member_preferences", "consents", "account_links", "privacy_requests", "saved_questions", "learning_notes", "learning_progress", "practice_attempts", "community_questions", "participation_events", "quest_ledger", "wallet_ledger"] as const;

export async function GET(request: Request) {
  const session = await authenticatedRequest(request);
  if (session.error) return session.error;
  try {
    const records: Record<string, unknown[]> = {};
    for (const table of OWNER_TABLES) {
      const rows: unknown[] = [];
      for (let page = 0; page < 100; page++) {
        const key = table === "profiles" ? "id" : "user_id";
        const order = table === "member_preferences" ? "user_id" : "id";
        const { data, error } = await session.client.from(table).select("*").eq(key, session.user.id).order(order).range(page * 500, page * 500 + 499);
        if (error || !data) throw new Error("Export query failed");
        rows.push(...data);
        if (data.length < 500) break;
        if (page === 99) throw new Error("Export too large for synchronous download");
      }
      records[table] = rows;
    }
    return NextResponse.json({ format: "itachis-corner-account-v1", exportedAt: new Date().toISOString(), account: { id: session.user.id, email: session.user.email ?? null, createdAt: session.user.created_at }, records }, { headers: { ...PRIVATE_HEADERS, "Content-Disposition": 'attachment; filename="itachis-corner-account.json"' } });
  } catch { return NextResponse.json({ error: "Your complete export could not be prepared. No partial export was returned. Try again later." }, { status: 503, headers: PRIVATE_HEADERS }); }
}

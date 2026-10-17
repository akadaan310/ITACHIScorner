# Live integrations

**Status: none connected.** The demo runs entirely on fixtures plus in-app actions. Lives are never hosted, embedded or rebroadcast. Every watch button opens Itachi's official TikTok or YouTube in a new tab.

## Schema (src/lib/types.ts)

Every live-adjacent record carries a `Provenance`:

```ts
{ source: "Demo" | "YouTubeLiveChat" | "TikTokOfficialIfAuthorized" | "ManualCreatorExport" | "AppCheckIn",
  verificationStatus: "verified" | "sample" | "simulated" | "self-entered" | "connected-via-provider" | "verified-event" | "pending-review" | "unavailable",
  consent?: { granted, scope[], grantedAt? }, capturedAt: string, eventId?: string }
```

## Adapters (src/lib/adapters/index.ts)

| Adapter | Available | Strongest possible status | Notes |
| --- | --- | --- | --- |
| `DemoAdapter` | ✅ | `simulated` | Bundled fictional events, labelled in the UI |
| `AppCheckInAdapter` | ✅ | `verified` (for its own button only) | "I'm here" pressed in the app during a live. Powers the Corner streak |
| `YouTubeLiveChatAdapter` | ❌ | `verified-event` | Would need creator-authorised API access for her broadcasts **and** a member's consented Google sign-in binding before any chat author could be matched to a member. YouTube exposes live-chat messages for accessible broadcasts, with quota and retention limits |
| `TikTokOfficialAdapter` | ❌ | `connected-via-provider` | TikTok Login Kit's documented user scopes do not grant LIVE comments, viewer lists or attendance. Login could at most bind an account to a member |
| `ManualCreatorExportAdapter` | ❌ | `verified-event` | Only with the creator's own lawful export plus member consent |

Every unavailable adapter returns an empty list, so the UI falls back to demo data and self check-in. Unit tests enforce this (`tests/content.test.ts`).

## Identity rules

- A typed TikTok or YouTube handle is stored as `self-entered`. It proves nothing about ownership and is never used to read comments, infer attendance or build streaks. Members can unbind it at any time.
- `connected-via-provider` requires an official OAuth binding with consent (not implemented).
- `verified-event` requires an authorised integration for that specific event (not implemented).

## Streak definitions

| Streak | Evidence | Shown as |
| --- | --- | --- |
| Corner streak | Consecutive lives with an in-app check-in | `In-app` (teal) |
| Self-reported | "I watched on TikTok/YouTube" | `Self-entered` (sand). Never upgraded |
| Platform-verified | Authorised integration only | `Not connected`, always 0 today |

An "I'll be there" intention never counts as attendance.

## Prohibited

Scraping behind login, evading platform protections, stealth monitoring, storing live comments without consent and lawful basis, ranking spiritual merit, or rewarding conversion.

# Product flows

State lives in a persisted Zustand store (`src/lib/store.ts`, key `itachis-corner-demo-v1`). Every flow below is covered by Playwright (`e2e/flows.spec.ts`).

## First-time visitor (≤3 taps to something playable)

Home hero → **Enter the Corner** (`/discover`) or the 30-second challenge on Home (no sign-up) → pick a star path → **Join the Ranks** to keep progress.

## Join the Ranks (`/join` → `/onboarding`)

1. Nickname (2–20 chars, validated) + optional invite code (cosmetic flair only).
2. Intention: Curious · Student · Dialogue Explorer · New Muslim · Returning Learner · Something else (private).
3. Languages (multi-select).
4. Starting constellation: The Lantern · The Compass · The Nile Arc · The Dawn Gate.
5. **Explorer's Star Card** reveal (seeded constellation, downloadable SVG). +20 credits. Role becomes `new-member`.

No account, email or OAuth is created. A "Load demo profile" option exists for signed-out reviewers.

## Afterglow

```
Before (/afterglow/before)          During (/afterglow/live)                    After (/afterglow/episodes/:id)
sample schedule + countdown   →     demo clock (minute 0–75)              →     episode constellation
reminder toggle                     in-app check-in (+15, verified)             moments (save ★ +3 each)
"I'll be there" (intent only)       self-report (+5, self-entered)              references (Qur'an)
prompt poll                         First-30 trivia                             recap card (download/share)
anticipation constellation          question queue · discussion · bookmarks     journal prompts (+10)
                                    opt-in ranks board                          unlocked challenges · participation compare
```

### First-30 trivia state machine

`intro` → (window open && Begin) → `question[i]` → (lock answer | timer hits 0 → void) → `reveal[i]` → … → `results`

- 6 questions, 20 s each, one answer per question; a late answer is never correct.
- Window: minutes 0–29 on the demo clock. Afterwards only **Practice mode** is offered.
- Official attempt: +10 per correct answer, +10 for completion. Credits are idempotent by key, so resetting and replaying can't farm them.
- Practice attempts: never award credits.
- "Reset demo attempt" clears the attempt for repeat testing.
- Keyboard: arrow keys within the radio group, Enter submits/advances.

## Dawah Simulator path (`/dojo/path`)

Setup → choose the next question (+ optional private reasoning) → spot the hidden assumption → match evidence to claim → reply with care → reflection checkpoint (saved to the journal, +50, Careful Listener badge) → `/dojo/result`. Each step gives feedback on clarity, fair representation, evidence and careful listening, with an illustrated path of reasoning. `?step=n` deep-links drills.

## Night Atlas

Select a star (click, tap, Tab + Enter, mobile card) → station card (question, summary, path, "you already…", connected stars, passage, **Enter this star**). Visiting 5 stars earns Star Cartographer. Reset restores the full view; `?star=id` deep-links.

## Member states (Settings → Demo states, or `/studio`)

`signed-out` · `new-member` · `return-member` (seeded history, return ritual) · `free-member` · `patron-preview` (cosmetic flair) · `moderator` (creator console unlocked).

## Privacy

Settings → visibility (private default), opt-in board, mute rankings/achievements, reduce motion, self-entered handles with unbind, consent toggle (inert), adapter status, **Export JSON**, **Delete everything**.

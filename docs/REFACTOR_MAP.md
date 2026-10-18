# Route refactor map

Base: `b987ebb58c649f0c724cc5ace545ea2e8f7ed1d3`. Legacy URLs are aliases, not alternative demo experiences. Screenshot evidence lives in `docs/screenshots/evidence-first/`; `before/rendered-audit.json` and the after capture records preserve exact folds at 360/390/768/1280/1440. Final alias expectations are executable in `e2e/`.

| Old route / surface | Canonical destination and label | Purpose | Primary action | Screenshot evidence |
| --- | --- | --- | --- | --- |
| `/` portrait orbit, live bar, arsenal and repeated CTA sections | `/` Home | Meet the independent creator concept; concise question-to-progress narrative | Explore questions | before/home-*, after/home-* |
| `/discover` | `/explore` Explore | Find reviewed questions and sources | Search questions | before/arsenal-*, after/explore-* |
| `/watch` | `/explore` Explore | Replace fictional catalogue with approved read model | Search questions | before/arsenal-*, after/explore-* |
| `/atlas` | `/explore` Explore | Related questions eventually come from real reviewed sources | Search questions | before/atlas-*, after/explore-* |
| New canonical page | `/learn` Learn | Evidence/review waiting state, no preview curriculum | Explore questions | after/learn-* |
| `/dojo`, `/dojo/path`, `/dojo/result` | `/practice` Practice | Review-gated dialogue practice, no fictional persona/scoring | Explore questions | before/dojo-*, after/practice-* |
| `/afterglow`, `/afterglow/before`, `/afterglow/live`, `/afterglow/vault`, `/afterglow/gallery`, `/afterglow/episodes/[id]` | `/session-notes` Session Notes | Real reviewed conversation notes when available; no event simulation | Explore questions | before/afterglow-*, after/session-notes-* |
| `/events` | `/about#channels` About | External channel information; no hosted stream/schedule | Creator public hub | before/events-*, after/about-* |
| `/reverts` | `/learn#new-muslims` Learn | Welcoming context without invented journeys or religious answers | Explore questions | before/sanctuary-*, after/learn-* |
| `/reverts/ask/[id]` | `/community` Community | Moderation readiness without fake answers | Read community principles | after/community-* |
| `/stories` | `/community` Community | Consent-first, no fabricated outcomes/stories | Read community principles | after/community-* |
| `/library`, `/library/preview` | `/library` Library | Honest source-review waiting state; no Method book text | Explore questions | before/book-preview-*, after/library-* |
| `/membership` | `/support` Support | Inactive optional support; no public prices or checkout | About the Corner | before/membership-*, after/support-* |
| `/join`, `/onboarding` | `/join` Sign in | Real configurable email Auth; no browser demo enrolment | Request sign-in / verify code when configured | before/onboarding-*, after/join-* |
| `/me` | `/me` My Corner | Real owned account state, no seeded member | Sign in when available | before/member-profile-*, after/account-* |
| `/me/constellation`, `/me/quests`, `/me/afterglow` | Account aliases | Remove synthetic achievements and attendance | My Corner | after/account-* |
| `/me/settings`, `/me/journal` | Private account surfaces | Owned settings/data; no private shared cache | Save / manage own data when configured | after/account-* |
| `/studio`, `/studio/creator` | Protected Creator workspace | Trusted staff-only private evidence/review status | Staff sign in when configured | after/creator-access-* |
| `/about`, `/faq`, `/privacy`, `/terms` | About and trust | Accurate independent status, privacy and operational limits | Contextual navigation | after/about-*, after/privacy-* |

The exact visible CTA can vary with real session/configuration state. An unconfigured page must not offer an apparently working submit or export/delete flow. The implementation and browser records are authoritative for final response codes and redirect destinations.

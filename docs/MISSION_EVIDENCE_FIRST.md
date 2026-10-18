# ITACHI'S CORNER — EVIDENCE-FIRST CODEX MISSION CONTROL

**Priority: controlling amendment to all earlier Itachi website, corpus, learning, and book prompts.**
**Recipient:** Codex Cloud, operating in the user's connected GitHub environment.
**Project:** `akadaan310/ITACHIScorner` (exact GitHub repository identifier; do not assume the display name is the slug).
**Observed default branch during preparation:** `ccr-cea0c280-gyikbx` — *re-check live branch and HEAD at execution time*.
**Primary technology:** Next.js / React / TypeScript / Tailwind; Supabase Auth, Postgres, RLS, Storage; private ingestion and evidence pipeline.
**Execution boundary:** Commit and push a feature branch, run verification; do not deploy, charge cards, spend Modal funds, publish transcripts, or represent the site as officially endorsed.

## CRITICAL COURSE CORRECTION — READ FIRST

You are not authorized to write, generate, fabricate, fill in, or publish a complete learning curriculum, a purported “Itachi Method,” debate technique taxonomy attributed to Itachi, or the 300–400-page book **before the actual video corpus has been gathered and analyzed**.

**The curriculum is an OUTPUT of corpus research, not an INPUT to the website.** The corpus must precede substrate discovery; validated substrate discovery must precede pedagogical synthesis; reviewer approval must precede attribution/publication. You may build the architecture, shell, systems, data schemas, research harness, reading experience and editorial tooling now. You may write *verified, properly sourced factual interface descriptions* but never manufacture Itachi lessons or quote purported debate moments that have not been retrieved.

The user has explicitly rejected dummy/demo/fake material on the product. If real data is unavailable, show purposeful, honest empty states, requests for authorized access, a preview of actual capabilities without fabricated numbers, or hide unfinished sections altogether. Do not claim a working course, creator support, login, live integration, or data coverage where these do not exist.

Before any proposed curriculum chapter or learning objective can be called *derived from Itachi*, require an evidence pack: original source URL/video ID, speaker, exact transcript span, interval `[start_ms, end_ms)`, extraction version, evidence confidence, cross-video corroboration, reviewer decision and date. A beautiful page without this cannot bypass the evidence gate.

## MISSION END STATE

Deliver a coherent, creator-first Itachi's Corner application where the website's outward personality is delightful, confident, sophisticated, gamer/anime-aware, Egyptian-influenced and fundamentally about **da'wah, learning and dialogue**. Underneath that surface, establish a private, reproducible research system that can eventually derive an original evidence-based learning curriculum and editorial book from the creator's recorded conversations. The site never exposes internal vocabulary like “substrates,” “protocols,” “continuity,” “causation graph,” “ISNAAD detector,” “computational grammar,” or “PURL” to ordinary visitors.

Build responsibly toward actual creator authorization, real account functionality, paid optional memberships, a private creator console, and a source-based searchable debate library. Reserve public course instruction until substrate findings are established and approved.

## NONNEGOTIABLE RULES

1. Follow current repository `AGENTS.md`, README, existing tests, and architecture. Inspect before editing. Reuse working systems, refactor rather than indiscriminately rewriting.
2. Resolve repo, branch and remote explicitly. Do not assume `main`, do not create a duplicate `Itachi's Corner` repo, and do not overwrite unrelated work. Work on a purpose-named feature branch. Record base SHA.
3. First audit all existing routes and visual assets, including screenshots under `docs/screenshots/`, and run a working-site Playwright capture. Make fold-level desktop and phone screen maps, nav-action inventory, CTA repetition audit, broken journeys, and a content truthfulness audit.
4. Treat prior screenshot boards as references, not a license to add more ornament. Preserve Itachi's recognizable masked identity; do not create a synthetic uncovered face or use unauthorized Naruto insignia. Do not present altered images as documentary photos or official endorsements. Obtain creator approval before public use of likeness, signature, logo and content. Use clean portraits sparingly rather than repeated identical model-in-center hero compositions.
5. Keep the public UX legible: quiet obsidian, controlled ruby/coral crimson, restrained cinematic movement, realistic photography, excellent Arabic and Latin typography, visually purposeful Egyptian architecture and restrained celestial motifs. Eliminate gold-souk maximalism, clutter, repeated CTAs, flashing or irrelevant motion. Sacred text is precise and never distorted.
6. Remove `Afterglow`, `Constellation`, `Night Atlas` and `Live Tonight` from public nav and explanatory labels. Retain internal paths temporarily as redirects if needed for bookmarks. The experience does not host her livestream or encourage leaving the site through giant “WATCH LIVE” calls to action. Her external social platforms own livestream discovery and viewing.
7. No fabricated followers, counts, dates, debate episodes, instructor statements, shahadah stories, outcomes, video screenshots, certifications or endorsements. All public content is real/sourced or explicitly pending; prefer hiding unready sections.
8. Never assign religious truth, piety, divine approval, conversion success or someone's debate 'victory' from statistical analysis. Preserve doctrinal positions as attributed claims and theological interpretations, not machine-proven facts. Scoring measures reasoned dialogue skills, evidentiary fidelity and pedagogical progress only.
9. Private transcripts remain private. Do not bypass authentication or platform access controls, mass-publish others' copyrighted transcripts, silently scrape logged-in viewers, or infer attendees from typed handles. Operate only on data acquired through permitted means, creator-provided exports or appropriately licensed sources.
10. No paid cloud/GPU runs without user approval after an explicit cost plan. The user's reported Modal balance (~$30) is a budget ceiling to plan around, **not authorization to spend it**. No deployment or payment activation.

# GATE 0 — AUDIT AND PRODUCT CONSTITUTION

**Read:** `README.md`, `docs/DESIGN_SYSTEM.md`, `docs/PRODUCT_FLOWS.md`, `docs/LIVE_INTEGRATIONS.md`, `docs/RELEASE_GATES.md`, `src/components/shell.tsx`, `src/components/hero.tsx`, `src/components/atlas.tsx`, `src/lib/config/creator.ts`, existing route tree and screenshot suite.

Document before/after fold structure for core pages and 360, 390, 768, 1280, 1440 widths. Count distinct and repetitive CTAs. The current homepage presents several largely overlapping entrances (portrait orbit, red live bar, three feature cards, live acts, sample content, challenge, reverts, simulator, membership). Consolidate them around a single discoverable sequence:

**Meet Itachi → Explore a real question → Learn from sourced material → Practice thoughtfully → Keep your progress.**

Write `docs/PRODUCT_CONSTITUTION.md` covering:
- Creator-first identity; respectful, curious, playful but not sensationalist voice.
- The product is NOT a broadcaster or livestream host. Avoid prominent live nav/bar and don't confuse sample event times with real times.
- Four or five primary destinations maximum; optional account/creator areas secondary.
- Every page has one obvious primary CTA, with relevant secondary actions only.
- The user can understand a screen in under ~5 seconds. Each fold earns its place in the narrative.
- Motion follows interaction (question unfolds, answer reveals, progress advances, paths illuminate). No gratuitous star fireworks. Support reduced motion and keyboard/touch.
- Itachi appears intentionally: real portrait on home, contextual editorial portrait on About, a cropped avatar in relevant teaching headers only when appropriate. Not every page and not centered as a static icon in every hero.
- Arabic rendering and Qur'an references use verified text, correct directionality and rigorous editorial review.
- Public wording never exposes technical mechanisms.

**Proposed public navigation, subject to audit:** `Home · Explore · Learn · Practice · Community` and user-profile button `My Corner`. Secondary areas: `Questions`, `Library`, `About`, `Support`. The research graph can appear as a human-friendly “Explore related questions” interaction without calling it a constellation.

Canonical public renames to evaluate:
- “Afterglow” → `Session Notes` or `The Conversation` (never treated as a live-stream destination)
- “Atlas / Constellation” → `Explore Topics`, `Connections`, or `My Learning Path`
- “Dawah Simulator / Dojo” → `Practice` / `Dialogue Practice`
- “Arsenal” → `Explore` / `Questions & Answers`
- “Reverts HQ” → `New Muslims` / `Start Here`
- “Membership ranks” → `Membership` with optional playful level names nested inside the account, not as the brand definition.

Add redirects/aliases rather than breaking deep links. Keep development feature IDs stable if it reduces migration risk.

# GATE 1 — REAL FOUNDATION (MAY PROCEED BEFORE CORPUS COMPLETION)

## Supabase

Use a separate project for this creator gift unless the user selects an existing appropriately scoped project. Check current Supabase guidance and changelog before implementation. With granted access, create schema migrations, row-level-security policies, optional local seed **for TESTS ONLY** and verification. Where approval or credentials are needed, provide a zero-secret ready-to-run checklist and stop only that dependent external action—not all development.

Required design areas:
- `profiles`, `roles` / `creator_staff` with trusted admin provisioning; no mutable `user_metadata` authorization;
- `consents`, `account_links` (self-entered handles distinct from OAuth verified identities), `privacy_requests`, `member_preferences`;
- `videos`, `video_sources`, `video_caption_tracks`, `transcript_versions`, `transcript_segments`, `speaker_turns`, `extraction_jobs`, `coverage_audits`, `source_checksums`;
- `debate_episodes`, `claims`, `questions`, `argument_steps`, `evidence_items`, `citation_links`, `video_intervals`, `hypotheses`, `discovery_runs`, `review_decisions`, `graph_nodes`, `graph_edges`, `graph_versions`;
- `learning_objectives`, `draft_curriculum_units`, `approved_curriculum_units`, `source_unit_links`, `editorial_reviews`, `practice_attempts`, `learning_progress`;
- `community_questions`, `moderation_actions`, `events`, `session_notes`, `participation_events`, `quest_ledger`, `wallet_ledger` and `creator_settings` where needed.

Prefer schemas separating private research from published read models. Do not dump full texts into user-readable `public` tables. Supabase Storage buckets should be private by default for acquired transcripts/research. Use signed, short-lived URLs where appropriate. RLS must be checked using distinct identities: anonymous visitor, member, reviewer, creator, admin. Views should respect RLS; service-role keys never enter client code. Content/scholar review and creator authorization are distinct controls.

Implement actual Auth flows (email OTP and/or supported OAuth), meaningful account export/delete, and resilient loading/errors. No misleading mock sign-in or fake payment screens.

## Visual shell

Evolve existing Next.js application. Build responsive navigation, consolidated home storytelling, Explore/Questions, Learn waiting-for-evidence state, Practice waiting-for-approval state, Community/moderation scaffold, My Corner account and creator-only editorial console. Use live Supabase data wherever it exists; show truthful empty states otherwise. Preserve existing assets under a verified provenance registry; avoid publishing newly generated unapproved faces, quotes, logos or other marks.

## Monetization architecture — no transactions yet

Separate `XP` (non-purchasable participation measure) from `Credits` (a transparently priced consumable, if approved). Define eligibility and anti-abuse policies; never sell spiritual ranking, conversion outcomes, or basic religious guidance. The foundation should remain free. Creator may later approve Supporter and Patron tiers, and optional premium experiences, provided that paywalls only surround genuinely original optional services, not access to YouTube playback. Architect Stripe/webhooks only behind a feature flag; no live checkout without approval. Publish a `pricing-proposal.md` in private docs, not unapproved prices on the public site.

# GATE 2 — COMPLETE VIDEO INVENTORY / TRANSCRIPT HANDOFF (CORPUS MISSION MAY RUN SEPARATELY)

Respect the user's existing Dot/Codex corpus-gathering mission. **Do not launch a second incompatible ingestion project.** Locate its repository, manifest, Supabase project, archive and artifact versions; if not ready, create compatible importer and dry-run acceptance tests. The source of truth is the corpus manifest, not promises about “all videos.”

For all discoverable videos across the canonical YouTube channel, relevant playlists, livestream archives and shorts: maintain an explicit record keyed by stable platform/video ID, including `discovered_at`, content type, canonical URL, title, publish timestamp, duration, status (`transcribed`, `caption_unavailable`, `rights_pending`, `private`, `deleted`, `retryable_error`, etc.), provenance and checksums. Distinguish inventory completeness from transcript completeness. Never silently omit inaccessible items or mark them as completed. Respect permission and platform constraints.

Keep raw transcript with original timestamps, normalized text, speaker turns, transcript version, language/code switching, turn/segment boundary, correction lineage and source format. Store precise non-negative half-open intervals `[start_ms, end_ms)`; use at least 1ms representable precision, allow physically short turns rather than invent a 1-second minimum. For a single detected instant, represent a 1ms point interval, flagged `instantaneous`. Use video timestamp deep links when supported, plus exact interval metadata.

Private canonical archive format:
- `manifest.ndjson` / manifest CSV (safe metadata)
- `videos/{video_id}/tracks/{track_id}/{version}.jsonl` with segment IDs, speaker, `[start_ms,end_ms)`, text and provenance
- `runs/{run_id}/run_manifest.json` for code/version/parameters/checksum/output
- `coverage/coverage_report.json` and human-readable report
- `evidence/` machine-readable extracted entities/relations
- public GitHub repo: CODE + SCHEMAS + SAFE MANIFEST ONLY; never personal/rights-restricted transcripts in public git.

**Acceptance:** verified video inventory; deterministic re-import of source versions; spot-check timestamp deep links and transcript overlaps; complete and honestly categorized coverage report; save private archive pointer and checksum. Gaps are reported, not concealed.

# GATE 3 — SUBSTRATE DISCOVERY SCIENCE (NO CURRICULUM GENERATION YET)

This is the intellectual foundation and must be reproducible, auditable and distinguish observation from interpretation. Do not define substrates as topics/keyword clusters. Operationally define a substrate candidate as a **recurrent, discriminative discourse constraint or transition-generating pattern** detectable across multiple independently sourced conversation intervals, robust against transcription noise, with falsifiable counterexamples.

## Data normalization (non-LLM first)

- Detect language and code-switching per span; tokenize/lemmatize as appropriate for English and Arabic; preserve original orthography and offsets.
- Speaker diarization and role assignment (`creator`, `guest`, `moderator`, `unknown`) with confidence and manual correction. Don't infer personal identity from the voice automatically.
- Structural speech acts: question, clarification, claim, evidence request, challenge, rebuttal, concession, return-to-claim, summary, citation, uncertainty and refusal. Rule-based heuristics and supervised classical NLP may propose, not certify, classes.
- Source detection for Qur'an (surah/ayah with edition and exact normalized match), other source types, quoted claims versus assertions, discourse markers and speaker attribution. Connect Qur'an analysis to the ISNAAD repo (`akadaan310/isnaad`) only through a versioned adapter; its Qur'anic grammatical attribution detectors are not automatically valid models of ordinary conversational debates.
- Model intervals, turn adjacency, interruptions, overlap, response latency, topic/premise return, argument references and evidence spans.

## Multi-graph construction

Maintain **multiple distinct, linked graphs**, not one opaque tangle:
1. Source/provenance graph: videos → tracks → segments → turns → annotations → edits; immutable attribution and hashes.
2. Dialogue/temporal graph: speaker turns, reply-to, overlaps, transitions and time intervals.
3. Argument graph: claims, premises, objections, rebuttals, support, contradiction, scope changes and unanswered questions.
4. Evidence/quotation graph: primary sources, Qur'anic loci, paraphrases, verification status and interpretations.
5. Technique/motif graph: structural sequences across separate episodes, candidate mechanism, counterexamples, change over time.
6. Learning-dependency graph (only after validated techniques): prerequisites → objectives → practice → assessment.
7. Optional causal-hypothesis graph: candidate interventions, confounders, temporal evidence, counterfactual experiments; clearly labelled **hypotheses, not causal proof**.

Graph edges require provenance and typed semantics. Example: `episode:youtube_id` —`CONTAINS [124000,127340)`→ `turn:...` —`ASSERTS`→ `claim:...` —`SUPPORTED_BY`→ `ayah:...` with annotation/reviewer status. An edge without source is a hypothesis or curated connection, never “verified.”

## Pattern discovery, mathematically explicit

Implement and compare baseline methods before invoking expensive LLMs:
- finite-state/labeled-transition-system representation;
- sequential pattern mining (e.g. PrefixSpan/SPADE), frequent transition motifs, bounded-order Markov/sequence likelihoods;
- grammar induction and suffix automaton motifs where suitable;
- discourse segmentation/change-point detection, argument-role graph motifs and temporal neighborhood statistics;
- graph community detection and typed path counts;
- embeddings/approximate-nearest-neighbor clustering *as candidate retrieval only*, not evidence of validity;
- contrast against matched baseline dialogues where licensing/permission allows, controlling for topic, guest type, video length and moderator context;
- controlled perturbation: shuffle turns, remove citations, swap roles, introduce ASR noise; reject patterns that survive trivially in random controls;
- split by video and time period, bootstrap stability, error bars, class imbalance checks, null baselines, and cross-video replication.

Formal record per candidate substrate:
```
substrate_id, label_internal, definition, observation_schema, extraction_algorithm,
code_commit, config_hash, data_manifest_hash, corpus_snapshot, run_id,
supporting_intervals[], counterexample_intervals[], cross_episode_count,
contrast_set, estimated_stability, uncertainty, confounders,
hypothesis, alternative_explanations, reviewer_status, reviewed_by, decision_at,
derived_substrate_ids[], pedagogy_eligible (boolean)
```

Make discovery **self-tracing**. Every derived substrate retains a lineage DAG: source corpus hashes → tokenizer/diarizer versions → features → candidate patterns → hypothesis tests → editorial review → downstream learning unit links. If any source transcript is corrected, identify dependent findings as stale and schedule revalidation. This is the auditability the user means by “how a substrate was found, and how it informed other substrates.”

No machine process may declare “Itachi always wins,” infer divine endorsement, prove a scripture through dialogue statistics, or treat observed shahadah reports as causal conversion evidence. The tool may examine fairness, efficiency, clarity, source-backed responses, consistency and evolving dialogue structure.

## Optional LLM proposals — STRICTLY SECONDARY

After deterministic extraction, plan (don't spend) for optional batch LLM labeling, multilingual correction, candidate summaries or instructor-facing phrasing. Produce pilot token counts from the actual corpus with low/medium/high scenarios, model pricing references current at execution, latency/accuracy comparison, privacy constraints and Modal GPU cost estimate with total ceiling $30. Require explicit user approval before any paid inference. Never use an LLM-generated paraphrase as the only evidence for a substrate.

## Outputs

`research/methodology.md`, `research/discovery_registry.jsonl`, `research/graph_schema.md`, versioned scripts/tests, `research/limitations.md`, `research/coverage_report.md`, and an optional private creator-review dashboard. Public site does not say “substrate” or “causation graph.”

# GATE 4 — PEDAGOGICAL SYNTHESIS (BLOCKED UNTIL GATE 3 PASSES)

**DO NOT START SUBSTANTIVE CURRICULUM WRITING WHILE CORPUS GATHERING OR DISCOVERY IS STILL RUNNING.** Prerequisites:
1. Provenance-backed transcript coverage adequate for the claims and an explicit gaps report.
2. A reviewable, reproducible motif/substrate registry with counterexamples and uncertainty.
3. Candidate teaching techniques supported by multiple real source intervals, not impressions from one viral clip.
4. Editorial assessment of what is genuinely Itachi's demonstrated approach versus general da'wah methods, and qualified scholarly review for theological assertions.
5. Creator permission to use her name, original excerpts and likeness, plus approval to label any course as her method.

Only then derive a curriculum: infer prerequisite relationships from actual recurring method components; cluster into coherent learning objectives; create sequences of learning stages; map concepts to sourced transcript moments and exact Qur'an references; write lesson outlines, activities, exercises, quizzes and rubric; validate against unseen episodes and human reviewers. **The proposed 3–5 months is a target experience duration, not a predetermined lesson outline.** Scope length to available validated material. Fill gaps with *explicitly labelled independently sourced* general fundamentals, never disguised as observations of Itachi.

Curriculum acceptance per unit:
- instructional claim and learning objective;
- at least one and preferably multiple source-supported real examples;
- source/video/time interval and evidence status;
- alternate/counterexample or uncertainty statement;
- learner exercise that respects competing viewpoints and consent;
- demonstrable assessment rubric for clarity, source fidelity and fair representation;
- human/editor review before release.

Build the curriculum tooling now, but render `Learning journeys are being prepared from verified conversations` or show only separately verified introductory resources pending approval. Nothing fake. Allow private reviewer-only drafts. The 300–400-page illustrated **book** is another gated downstream artifact, not to be auto-written during this mission; authoring design/layout templates and a future Codex handoff are allowed.

# GATE 5 — HUMAN-FACING EXPERIENCES BUILT ON REAL EVIDENCE

## Explore

Search sourced questions, real video moments, topics and references. One result has a short honest excerpt/summary, original video destination, exact source interval, source labels, confidence and nearby relevant questions. Where no real content exists, show no fabricated result.

## Learn

A gentle structured entrance that eventually hosts the long-form Itachi-derived learning program only after Gate 4 approval. Its content must not be a fake preview course. It can host verifiable Qur'anic references and publicly available, accurately attributed general resources if editorially reviewed. Avoid implying Itachi endorsed work she has not approved.

## Practice

Practical simulations based on real archived moments only after review; hypothetical branches labelled as constructed. Score listening, fair representation, reasoning and evidence, not someone's faith or whether they convert. Animated microinteraction follows performance, never shames learners. Until evidence exists, create feature shell behind staff-only review flag and do not publish dummy scenarios.

## Community

Private member questions, opt-in discussions, moderation, respectful disagreement; safe defaults, abuse reporting, content retention policy and deletion. Mentorship only if genuine mentors consent and are available. Do not invent a chatroom full of users.

## My Corner

Real auth, consented settings, learning notes, saved questions, activity ledger, earned XP, optional credits, clear account data export/delete. XP must not be construed as spiritual worth. Make monetary credits separate and optional.

## Creator's private space

Role-checked console for editorial review, corpus gap reports, proposed motifs with click-to-source, program creation, question queue, quizzes, points policies, manual session check-ins and content publication. NO streaming host, no stealth monitoring, no fabricated verification of TikTok usernames/comments. Itachi can run verified in-app trivia during off-platform events with server-authoritative start times without claiming TikTok automatically verified who was there. Costs and integration status visible only to staff.

# GATE 6 — SECURITY, PERFORMANCE AND COST

- Next.js server/client boundaries correct; cache public safe reads, never private ones in shared cache.
- Supabase schema/migrations/RLS, SQL indexes for interval overlap `(video_id, start_ms, end_ms)`, full-text/pgvector where useful; private storage.
- Graceful non-LLM deterministic baseline. Optional AI execution must be isolated behind adapters, feature flags, budgets and rate limits; never block basic navigation on generation.
- Strict accessible navigation, keyboard/pointer/touch, reduced motion, page load/perf budgets and no mandatory WebGL.
- Observability for ingestion failures, cost ledger, retries and private privacy-preserving audit logs; idempotent ingest by content checksum and source ID.
- Don’t access or modify other projects or repos without reason and consent.
- Don't spend Modal credit, create Stripe products, send marketing messages, or deploy without authorization.

# GATE 7 — PARALLEL CODEX WORKSTREAMS

If Codex can spin up sub-agents, use isolated, coordinated branches/worktrees with one integrator and no racing edits on the same files:
- A: UX/content truthfulness audit, nav and CTA rewrite, screenshots; owner of shell/hero/style.
- B: Supabase schema, RLS, Auth and persistence; owner of DB/migrations/data adapter.
- C: Corpus importer, provenance and deterministic extraction harness; owner of research pipeline.
- D: Test/perf/accessibility, release gates, screenshot diffs; owner of tests/docs.
- E (blocked until corpus evidence): curriculum derivation and editorial review pipeline; NO draft Itachi curriculum text before Gates 2–4.

Coordinate data contracts first. Merge only after integration tests. Keep the original corpus mission’s ownership and data destination; contribute compatible import/analysis layers rather than duplicating harvesting work.

# GATE 8 — EXPLICIT REVIEW AND ACCEPTANCE TESTS

**Now (even if corpus incomplete):**
- Repo/branch resolution and base SHA documented.
- Source audit covering existing screenshots and current rendered folds, including CTA duplication analysis.
- Public nav clear, no Afterglow/Constellation/Live Tonight nomenclature, no persistent WATCH LIVE banner, and an uncluttered creator-first visual.
- No fabricated content, no unauthorized public identity claims.
- Real authentication, privacy-safe schema, RLS tests with role separation where configured.
- All source/gap/provenance schema types and deterministic importer with synthetic **test fixtures kept out of production UX**.
- Substrate discovery specification, baseline detector implementations, falsification checks, run logs and lineage DAG demonstrating operation on controlled test corpus (labelled internal test data only).
- Curriculum/private book editorial scaffolding exists; public Itachi-derived lessons DO NOT exist without source/review evidence.
- Build, lint, typecheck, Vitest, Playwright user journeys, axe accessibility, screenshots and performance report.

**Later, only when evidence arrives:**
- Video manifest exhaustive against known canonical channel listing, gaps explicitly categorized.
- All eligible source intervals deep-linked and validated.
- Replicated patterns with counterexamples, uncertainty and reviewer record.
- Pedagogical units begin only after Gate 4 approval.

# GATE 9 — DELIVERY CONTRACT

1. Implement in the actual repo: `akadaan310/ITACHIScorner`. Work on a feature branch; **commit and push** changes if write access succeeds; do not deploy.
2. Produce `docs/REFACTOR_MAP.md`: old route → new public label → purpose → CTA → screenshot evidence.
3. Produce `docs/EVIDENCE_FIRST_ARCHITECTURE.md`, graph schema, `research/` pipeline docs, actual RLS migrations/tests, coverage/import specs.
4. Produce a `STATUS.md` with `DONE`, `BLOCKED ON CREATOR APPROVAL`, `BLOCKED ON CORPUS`, `BLOCKED ON CREDENTIALS`, `FUTURE`; include accurate count of verified videos/transcripts (do not invent).
5. Provide final verified repo/branch/commit, exact tests run and outcomes, screenshot paths, schema changes, what still needs creator consent, and a clear Modal inference budget awaiting explicit approval.
6. Never claim the book, curriculum, corpus completion, integrations, final artistic likeness or deployment succeeded unless independently verified.

**North star:** The public experience feels like Itachi: welcoming, intelligent, playful, rooted in da'wah; the private research process is sophisticated enough that *every lesson can be traced backwards through a tested discovery to an exact real moment in her recorded voice*. **Evidence first. Discovery second. Curriculum third. Publication last.**

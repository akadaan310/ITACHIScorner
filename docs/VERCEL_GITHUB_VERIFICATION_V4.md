# GitHub / Vercel verification — V4

Read-only verification at **2026-10-18 04:03 UTC** for the exact repository [`akadaan310/ITACHIScorner`](https://github.com/akadaan310/ITACHIScorner). This is an integration audit, not a deployment receipt for V4.

## Verified GitHub refs

Authenticated GitHub repository/branch API reads and `git ls-remote --symref origin HEAD` agree:

| Ref | Remote SHA |
| --- | --- |
| Default: `ccr-cea0c280-gyikbx` | `b987ebb58c649f0c724cc5ace545ea2e8f7ed1d3` |
| `feat/evidence-first-foundation` | `674668b54f749ea2c7b9edce50fcc9dad61be888` |
| `feat/restore-corner-and-corpus-handoff` | `7a8ce5efda461ebab717a03ed1d9c73528f92c9d` |

`feat/v4-creator-first` exists locally but was absent remotely at this audit. The working source and delivery agent may advance it after this timestamp; this document does not claim a final V4 push, PR, merge or deployment.

## Existing Vercel evidence

GitHub metadata returns homepage **https://itachi-scorner.vercel.app**. This URL was discovered in authorized repository metadata, not constructed from the repository name. Its GET returned **200** and title “Itachi's Corner — Where Truth Meets Dialogue”. The rendered HTML contains the original “Arsenal”, “Afterglow”, “Simulator”, “Reverts HQ” and “Live tonight” navigation/content. It is suitable as an existing live comparison only. No deployment SHA was exposed in that response.

The commit status API confirms Vercel reported successful deployments of these historical commits:

| Commit | Vercel status time (UTC) | Actual status target |
| --- | --- | --- |
| `b987ebb58c649f0c724cc5ace545ea2e8f7ed1d3` | 2026-10-17 21:50:51 | [Deployment HLEHKJnvVr2LKD1yJPFZcAwxdmUn](https://vercel.com/akadaan310s-projects/itachi-scorner/HLEHKJnvVr2LKD1yJPFZcAwxdmUn) |
| `674668b54f749ea2c7b9edce50fcc9dad61be888` | 2026-10-18 01:49:12 | [Deployment GiKxJX7n3gZGkCfcWmFt7vXdNhQp](https://vercel.com/akadaan310s-projects/itachi-scorner/GiKxJX7n3gZGkCfcWmFt7vXdNhQp) |
| `7a8ce5efda461ebab717a03ed1d9c73528f92c9d` | 2026-10-18 03:43:33 | [Deployment FT8NPHGgCHSKG3nVLQtovDGf3vJn](https://vercel.com/akadaan310s-projects/itachi-scorner/FT8NPHGgCHSKG3nVLQtovDGf3vJn) |

Each has status context `Vercel`, state `success`, description `Deployment has completed`. The two feature SHAs also have a completed/successful `Vercel Preview Comments` check from GitHub App **Vercel**, slug `vercel`, app ID `8329`. This establishes the observed team/project URL path `akadaan310s-projects/itachi-scorner`; it does not expose the Vercel project ID or Git settings.

Recovery check `117578384518`, bound to head SHA `7a8ce5efda461ebab717a03ed1d9c73528f92c9d`, links the exact preview hostname:

https://itachi-scorner-git-feat-restore-cor-7fc8af-akadaan310s-projects.vercel.app

Opening that URL redirected to Vercel login. No preview content or new-branch rendering was verified, and access protection was not bypassed.

**Vercel's configured production branch and latest production deployment SHA remain unverified.** A successful status on GitHub's default commit, an older-looking live page, and a successful preview do not establish which Git branch the production alias currently tracks. The latest observed successful status above is a feature deployment, not a verified latest production deployment.

## Endpoint results and access limits

The following are authenticated GitHub GET responses under `https://api.github.com/repos/akadaan310/ITACHIScorner`:

| Endpoint | HTTP | Relevant response |
| --- | --- | --- |
| Repository root | 200 | Exact repository ID `1423723560`, public, default `ccr-cea0c280-gyikbx`, homepage above |
| `/branches?per_page=100` | 200 | Exactly the three remote branches listed above; all return `protected: false` |
| `/deployments?per_page=100` | 200 | `[]`; GitHub Deployments provides no production mapping |
| `/actions/runs?per_page=100` | 200 | `total_count: 0`, `workflow_runs: []` |
| `/pulls?state=all&per_page=100` | 200 | `[]` at audit time |
| `/rulesets` | 200 | `[]` |
| `/branches/ccr-cea0c280-gyikbx/protection` | 403 | `Resource not accessible by integration`; no full protection read was possible |
| `/installation` | 401 | `A JSON web token could not be decoded`; this endpoint did not reveal installation configuration |
| `/commits/<each listed SHA>/status` | 200 | One Vercel success status per SHA, targets/times above |
| `/commits/<each listed SHA>/check-runs` | 200 | Default SHA: zero; each feature SHA: one Vercel Preview Comments success |

Repository metadata reports push/maintain/admin permissions, but the protection endpoint's actual 403 remains controlling evidence for that read. GitHub permission metadata is not a Vercel credential or release approval.

Vercel GETs to `https://api.vercel.com/v9/projects/itachi-scorner` and `/v13/deployments/HLEHKJnvVr2LKD1yJPFZcAwxdmUn` and `/v13/deployments/FT8NPHGgCHSKG3nVLQtovDGf3vJn` all returned **403** with the same body:

```json
{"error":{"code":"forbidden","message":"The request is missing an authentication token","missingToken":true}}
```

The status-linked Vercel dashboard returned a login shell, not authenticated project/deployment settings. No Vercel MCP tool is available. The checkout has no `.vercel/project.json` or `vercel.json`; Vercel CLI is unavailable. Existence-only checks found no `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`, or standard Vercel CLI auth file. The available GitHub credential was used normally; no secret value or token-file contents were read or printed.

Current managed-environment readiness reports `observations_current: true`, connected/running, enforced unrestricted HTTP policy, and empty configured capabilities/secrets/runtime variables/outbound identities. Local network-policy version 1 also reports unrestricted HTTP and `vpn_configured: false`. Neither observation grants Vercel authentication.

## Integration and release ruling

1. The safe known review base is the actual default branch **`ccr-cea0c280-gyikbx`**. A reviewable/draft PR from the final verified `feat/v4-creator-first` source may target that branch, explicitly noting that Vercel's production branch remains unverified. Do not create a guessed `main` branch.
2. **Do not merge or initiate deployment in this delivery.** [Release gates](RELEASE_GATES.md) still require creator name/likeness/signature/public-concept approval and separate deployment authorization. The V4 conditional merge path requires the actual production branch and satisfied rights/approval gates; those conditions have not been established. V4 explicitly permits a reviewable PR when they are unmet.
3. The single remaining integration action for an authorized project owner is to inspect this existing Vercel project's Git production-branch setting and latest Production deployment's Git SHA, then review the PR against that verified branch and resolve release approvals before merging. Retarget the existing PR if necessary; do not change hosting settings speculatively.
4. Historical feature statuses demonstrate that a push can trigger an existing Vercel preview integration. No manual deployment, new project, interactive login, production alias change, integration-setting change, paid operation or GitHub mutation was performed by this audit.

Raw read-only GitHub/Vercel response receipts are retained outside public Git in the private delivery workspace. A final push/PR and any subsequent GitHub statuses must be verified separately after the source is finalized. Do not describe this audit as proof that V4 is live.

## V4 Git integration

The verified implementation is committed as **`783a0180adb59f47b0393d154bbeb9223c086685`** on `feat/v4-creator-first`; its remote ref matched local after push. The code and all 131 rendered source/brand/tool hashes match the actual captured tree: [committed-source receipt](screenshots/v4/committed-source-receipt.json).

Created [draft PR #1](https://github.com/akadaan310/ITACHIScorner/pull/1) to `ccr-cea0c280-gyikbx`, the verified GitHub default/review base. It is **unmerged**. No production branch, protection, environment, hosting or alias setting was changed. Delivery documentation/screenshots may advance the PR head without changing the tested implementation; the final response and live PR head identify that delivered commit.

The existing Vercel Git integration automatically reported a **pending** deployment for the implementation push, target [GUApVfrHZYF1MU4CKiJDMvGv4Fqa](https://vercel.com/akadaan310s-projects/itachi-scorner/GUApVfrHZYF1MU4CKiJDMvGv4Fqa). This is an observed build status, not proof of a production release or rendered preview. Final observed statuses are checked separately after the delivery push. Codex did not invoke a deployment tool, merge the PR or change production settings.

The implementation's Vercel status subsequently became **success / Deployment has completed**. Exact check head SHA: `783a0180adb59f47b0393d154bbeb9223c086685`; check name: `Vercel Preview Comments`, completed/success. The actual PR bot links the [V4 preview](https://itachi-scorner-git-feat-v4-creator-first-akadaan310s-projects.vercel.app), the same deployment target above, and identifies project `prj_UjIMzNidTvtDjsmCQZchqoWIItbN` under team `team_zhoqbo8of1Acf44s8EOKF5bs`. These are public integration identifiers, not authentication credentials or production settings.

The direct V4 preview read redirects to Vercel login; [read-only receipt](screenshots/v4/preview-verification.json). Its application rendering remains unverified. The exact implementation build status is therefore known separately from the still-unknown production branch and production SHA. No login/access protection was bypassed.

# Static boundaries

Scope: **static applications** — HTML/JS/assets on a CDN, build pipeline, git as source of truth, CI deploy. Patterns implemented in **your repo, browser, and workflows**. **SaaS products are out of scope** (hosted CMS platforms, analytics dashboards, payment services, booking widgets, etc.); this doc does not survey vendors or recommend subscriptions.

The central constraint: the app must be hostable on a CDN with a build pipeline, for free. Everything else follows from that. This ideas doc maps where the real boundary between static and dynamic lies, which escape hatches apply, and how far each can stretch. Options here are not commitments — actionable work goes to `.cursor/plans/`.

## The constraint, precisely

"Static" does not mean "frozen". It means:

- **No per-request compute.** Every response is a file that existed before the request.
- **No per-request secrets.** Anything the browser receives is public; anything committed is public.
- **No server-side writes.** The origin cannot accept data, only serve it.

Everything a static app "cannot do" traces back to one of these three. Everything else is negotiable.

## The four escape hatches

Every dynamic-feeling feature on a static app uses one of these.

### 1. Time-shifted compute (the snapshot pattern)

Run the dynamic part on a schedule, commit the result, redeploy. The CDN serves a stale-but-fresh-enough view.

Example: a workflow pulls an external calendar API, sanitizes to public JSON, commits, deploys.

The generalized rule: **any read-only view of a slow-moving external system can be made static** if (a) it changes slower than your rebuild cadence, and (b) it is public-safe after sanitization. The sync script is the security perimeter — sanitize at write time, not render time.

Freshness is measurable. CI cron on a public repo floors at ~5–15 minutes with jitter; deploy adds ~1 minute. Static can approximate **ten-minute freshness at zero hosting cost**. Twice-daily sync is a choice, not a limit.

### 2. Client-side compute

The browser is a full runtime that arrives free with every visitor. Anything computable from shipped data plus local state is fair game.

Examples: calendar logic over committed JSON; connection-quality probing to pick asset tier; client-side search over a committed index (Pagefind-style); date-aware rendering (prerender many days, JS picks "today"); `localStorage` preferences; a service worker for offline use.

### 3. Delegation to the user's own agents

The user already owns writable channels: mail client, phone, calendar, messaging apps. The app composes an *intent* and hands it over; the user's agent does the write.

Examples: **mailto** forms; `tel:` links; messaging deep links with prefilled body; client-generated `.ics` ("hold these dates") as a data-URL download; `geo:` / maps deep links; Web Share API.

### 4. Runtime HTTP from the browser

The browser can `fetch` a public endpoint at view time. The app stays static; live data comes from elsewhere. Each call needs CSP allowance and a privacy review (IPs exposed to the remote host).

Examples: map tile servers; a public weather API for a one-shot current-conditions read. Not a substitute for secrets, inventory locks, or sub-minute truth on your origin.

## Where the boundary actually is

Four tests. A feature that fails one of these genuinely needs a server you operate; anything that passes all four can stay static.

| Test | Why it forces dynamic |
|---|---|
| Per-request secrets | A committed secret is a leaked secret. API keys live in CI secrets, never in the shipped bundle. |
| Per-user server state | Sessions, accounts, carts. The CDN serves everyone the same bytes. Per-user state must live in the browser or off-origin. |
| Transactional writes | Two users, one scarce resource, same moment. Needs an inventory lock the snapshot pattern cannot referee. |
| Freshness below rebuild cadence | Sub-ten-minute truth on your origin cannot come from last deploy alone. Runtime fetch to a public API, or accept staleness. |

Notably absent from the list: forms, search, i18n, personalization, maps, calendars, read-only availability display. All commonly cited as "you need a backend for that". None fail the tests by themselves.

### The booking line (illustrative)

- **Showing availability**: static (snapshot).
- **Requesting a stay**: static (delegated write via mailto).
- **Confirming with payment against live inventory**: needs a system with a write lock — hand off via link, do not reimplement on the origin.

## Authoring and content (static-app write paths)

All of these keep git as source of truth and the CDN read-only. None require a CMS SaaS.

**GitHub web UI.** Author edits committed `.md` (or JSON) in the browser. Repo access is the login. Validation: CI green, then inspect the live deploy. Usability is poor — raw editor, YAML frontmatter, merge conflicts — but the architecture is pure static.

**Git-backed admin (still part of the app).** A static `/admin` page shipped with the site uses GitHub OAuth (or a token) to commit markdown and assets via the GitHub API — often to a PR branch with an editorial workflow. Write path: author → admin UI → git commit → CI build → CDN. Still passes the three-part constraint.

For **SvelteKit blogs** (and this org’s default stack), **Sveltia CMS** is the obvious fit: open-source, Svelte-built successor to Decap/Netlify CMS, framework-agnostic but aligned with our tooling. Serve the CMS bundle from `static/admin/` (SvelteKit’s static folder); configure the GitHub backend (`repo`, OAuth app); point collections at committed paths (e.g. `content/posts/*.md`, uploads under `static/`). Saves go through the GitHub GraphQL API as file commits; push to `main` (or merge a PR) triggers the same Actions → Pages deploy as today. No CMS server — only the static admin SPA, git, and CI. What you still owe: OAuth app registration, `config.yml` (or YAML/JS config) in-repo, merge semantics, build latency before live. Validation: frontmatter/schema lint in CI, optional preview deploy on PR; **ship truth remains "green workflow + look at the result."** Roll your own admin only if Sveltia’s collections model doesn’t fit.

**Git as structured write API.** Issue forms + an Action that validates, extracts, commits, redeploys. Anonymous or semi-public writes without an origin POST handler.

**`repository_dispatch`.** Inbound trigger with a token → workflow runs → commit/deploy. Minutes of latency; fine when rebuild cadence is the SLA.

## Wild ideas (static-app only)

**Freshness stamp.** Show `generatedAt` on snapshot-derived UI ("as of this morning").

**Snapshot-derived UI.** Compute badges or summaries client-side from JSON already shipped.

**Messaging enquiry twin.** Same form body via a messaging deep link — pure delegation.

**"Hold these dates" .ics.** Client-generated calendar file after form compose.

**Second snapshot source.** Same sync pattern, different upstream (reviews, events).

**Seasonal build.** Scheduled rebuild swaps committed assets or highlights by calendar date.

**Offline PWA.** Service worker caches shell + key assets; invalidation vs deploy cadence is the real cost.

**Sub-hour sync.** Same workflow, higher cron frequency — limit is upstream courtesy and deploy noise, not hosting cost.

## Boundary stretchers

How far can the constraint be pushed before it breaks? Proof of concept exists for each. None violate: files on a CDN, compute in build or browser, no origin writes.

### The database lives on the CDN

**SQLite over HTTP range requests.** Commit a SQLite file; WASM in the browser reads via `Range` requests (~4KB pages). Pair with scheduled ingest → commit: **cron is the write path, WASM is the query engine, git is the WAL.**

**DuckDB-WASM over Parquet.** Columnar analytics entirely client-side.

**Prebuilt search indexes.** Pagefind/Lunr at build time; extension: embeddings committed at build, similarity search in the browser.

### The browser is the server

**Service worker as origin.** After first visit, the SW serves from local logic; CDN distributes updates.

**WASM as runtime.** ffmpeg.wasm, codecs, Pyodide, ONNX/transformers.js — per-visitor CPU, no origin compute.

**Combinatorial prerendering.** Enumerable input space → render every variant at build time; runtime is O(1) file lookup.

### State without a server

**The URL is a database.** State in the fragment (never hits the CDN).

**Local-first + CRDTs.** IndexedDB + merge; sync via file exchange or QR.

**WebRTC peer-to-peer.** Signaling via pasted blob or QR; CDN shipped the program.

### Build-time feedback loops

**Build-time A/B.** Committed metrics → build step picks variant → ship winner. Feedback closes through the repo.

### The honest limits

Pushed far enough, you still hit: transactional writes right now, per-request secrets, or truth fresher than rebuild. Then *some* server exists — hopefully not yours. Stretching reveals how much territory was on the static side all along.

## What this document is for

When someone proposes a feature for a static app, run the four tests. If it passes, pick the cheapest escape hatch (snapshot → client compute → delegation → runtime fetch, in that order — earlier hatches add fewer runtime dependencies). If it fails, hand off to an external system allowed to be dynamic — not a origin backend. Do not solve author UX or ops by bolting on SaaS; stay within repo + CI + CDN + browser unless the constraint itself changes.

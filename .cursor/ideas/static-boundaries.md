# Static boundaries

The central constraint: this site must be hostable on a CDN with a build pipeline, for free. Everything else follows from that. This ideas doc maps where the real boundary between static and dynamic lies, which escape hatches this project already uses, and which ones are still on the table. Options here are not commitments — actionable work goes to `.cursor/plans/`.

## The constraint, precisely

"Static" does not mean "frozen". It means:

- **No per-request compute.** Every response is a file that existed before the request.
- **No per-request secrets.** Anything the browser receives is public; anything committed is public.
- **No server-side writes.** The origin cannot accept data, only serve it.

Everything a static site "cannot do" traces back to one of these three. Everything else is negotiable.

## The four escape hatches

Every dynamic-feeling feature on a static site uses one of these. This project already uses all four.

### 1. Time-shifted compute (the snapshot pattern)

Run the dynamic part on a schedule, commit the result, redeploy. The CDN serves a stale-but-fresh-enough view.

In use: **occupancy** ([docs/occupancy.md](../../docs/occupancy.md)). A twice-daily Action pulls Lodgify, sanitizes, commits, deploys.

The generalized rule: **any read-only view of a slow-moving external system can be made static** if (a) it changes slower than your rebuild cadence, and (b) it is public-safe after sanitization. The sync script is the security perimeter — sanitize at write time, not render time.

The freshness dial is real and measurable. GitHub Actions cron on a public repo is free and floors at ~5 minutes (with scheduling jitter, realistically 10–15). Pages deploys take ~1 minute. So "static" can approximate **ten-minute freshness at zero cost**. Twice daily for occupancy is a choice, not a limit.

### 2. Client-side compute

The browser is a full runtime that arrives free with every visitor. Anything computable from shipped data plus local state is fair game.

In use: calendar disable logic (all occupancy math runs client-side on the shipped JSON), **network tier proving** ([docs/network-tier.md](../../docs/network-tier.md)) — the client measures its own connection and picks an asset family, which is per-user adaptivity with zero server involvement.

Untapped: client-side search over a committed index (Pagefind-style), date-aware rendering (the client knows what day it is — prerender 18 months of calendar and let JS pick "today"), personalization in `localStorage` (remembered house preference, language), a service worker for offline reading on the flight to Palermo.

### 3. Delegation to the user's own agents

The guest already owns writable channels: a mail client, a phone, a calendar, WhatsApp. The site composes an *intent* and hands it over; the user's agent does the write.

In use: **mailto** ([docs/email.md](../../docs/email.md)). The form is a mailto composer; the guest's mail client is the transport; the owner's inbox is the database.

Untapped: `tel:` links, a WhatsApp deep link carrying the same prefilled enquiry body, a client-generated `.ics` file ("hold these dates" — a data-URL download, no server), `geo:`/Maps deep links for directions (partially in use), the Web Share API.

### 4. Client-direct third parties

The browser can call someone else's server. The site stays static; the third party carries the dynamic load. Each addition costs a CSP entry and a privacy review.

In use: Simple Analytics (cookieless page views), OSM tile servers (full-tier map), Open-Meteo current conditions on Come arrivare ([docs/weather.md](../../docs/weather.md)).

Untapped, in roughly ascending order of paradigm strain: giscus-style comments backed by GitHub issues (wrong audience here), Stripe Payment Links for deposits (real money movement with zero backend — the link is static, Stripe is the dynamic part), a hosted booking widget.

## Where the boundary actually is

Four tests. A feature that fails one of these genuinely needs a server; anything that passes all four can be static.

| Test | Why it forces dynamic |
|---|---|
| Per-request secrets | A committed secret is a leaked secret. API keys can only live in the build (Actions secrets), never in the response. |
| Per-user server state | Sessions, accounts, carts. The CDN serves everyone the same bytes. Per-user state must live in the browser or with a third party. |
| Transactional writes | Two guests, one house, same night. Booking needs an inventory lock — a race the snapshot pattern cannot referee. This is *the* hard boundary for this site. |
| Freshness below rebuild cadence | Sub-ten-minute truth (live chat, live pricing) cannot come from the origin. Client-direct third party or nothing. |

Notably absent from the list: forms, search, i18n, personalization, maps, analytics, payments-as-links, calendars, availability display. All commonly cited as "you need a backend for that". None of them fail the tests.

### The booking line, drawn exactly

- **Showing availability**: static (snapshot). Shipped.
- **Requesting a stay**: static (delegated write via mailto). Shipped.
- **Confirming a booking with payment against live inventory**: dynamic. Not this site's job — that is what Lodgify's own hosted pages are for. The correct static move is a *handoff link*, never a reimplementation.

The current design sits exactly on this line, deliberately: the snapshot makes requests *well-informed* (guests rarely ask for occupied nights), and the owner confirms by reply — the human is the transaction lock.

## Wild ideas

Ordered roughly by feats-per-effort. None are commitments.

**Freshness stamp.** Show `generatedAt` ("availability as of this morning") on the contact page. Honesty about the snapshot's age costs nothing and makes stale data a feature instead of a bug.

**Occupancy-derived badges.** "3 of 4 houses free this week" on the homepage, computed client-side from the JSON already shipped. Same data, new surface.

**WhatsApp enquiry twin.** Same gated form, second button, same body via `wa.me` deep link. For much of the guest demographic, WhatsApp is more natural than email. Pure delegation, zero new infrastructure.

**"Hold these dates" .ics.** After composing an enquiry, offer a client-generated calendar file for the requested stay. Data URL, no server, small delight.

**Reviews snapshot.** The occupancy pattern pointed at a second source: a scheduled Action pulls review quotes (Lodgify, or curated by the owner in a committed file), sanitizes, commits. Same fail-closed rules.

**Seasonal build.** The build knows the date. A monthly scheduled rebuild could swap hero imagery or highlight seasonal imperdibili (Zingaro in swimming season, Erice in autumn light) with zero runtime cost. Time-shifted compute where the "external system" is the calendar itself.

**Weather touch.** Shipped — see [docs/weather.md](../../docs/weather.md). Client-direct Open-Meteo on Come arrivare, full tier only.

**Offline PWA.** Service worker, cache the site shell and one house gallery. A rental site that works in airplane mode is a nice trick; the audit cost (cache invalidation vs. twice-daily occupancy deploys) is the real price, not the code.

**Deposit links.** If the owners ever want deposits without a booking engine: Stripe Payment Links pasted into the owner's reply email — not into the site. The static site's job ends at the enquiry; money can stay in the reply thread.

**Sub-hour occupancy.** If twice daily ever feels stale, the same workflow runs hourly for free. The limit is Lodgify API courtesy and deploy-churn noise, not cost.

## Boundary stretchers (domain-independent)

How far can the constraint be pushed before it breaks? These are the known extremes of each escape hatch, independent of this site's domain. Proof of concept exists for every one of them somewhere in the wild. None fail the three-part constraint: files on a CDN, compute in the build or the browser, zero hosting cost.

### The database lives on the CDN

**SQLite over HTTP range requests.** Commit a full SQLite file; the browser runs SQLite compiled to WASM and reads it through HTTP `Range` requests, fetching only the ~4KB pages a query touches (the sql.js-httpvfs trick). A gigabyte-scale relational database, indexed and queryable with real SQL, served as one static file — the CDN never knows it is a database. Pair it with a scheduled Action that re-ingests external APIs and commits the new file, and you have the full museum-collections architecture: **cron is the write path, WASM is the query engine, git is the WAL.** GitHub's 100MB file limit is the practical ceiling per file; sharding or LFS-with-a-different-CDN stretches it.

**Analytics warehouse in a tab.** Same move, bigger engine: DuckDB-WASM over committed Parquet files. Columnar scans, joins, aggregations over millions of rows, entirely client-side. A "dashboard site" where the build exports data and the browser is the OLAP server.

**Prebuilt search indexes.** Full-text search (Pagefind, Lunr) is the entry level. The extension is semantic: compute embeddings at build time, commit the vector index, run similarity search in the browser. "Ask the site a question" without a single inference server.

### The browser is the server

**Service worker as origin.** After first visit, a service worker can intercept every fetch and answer from local logic — the site becomes an installer for an app that then serves *itself*. The CDN's job shrinks to distribution and updates. Offline is not a degraded mode; it is the architecture.

**WASM as the universal runtime.** Anything with a C/Rust core runs where the visitor is: ffmpeg.wasm (video transcoding), image codecs, Pyodide (scientific Python), ONNX/transformers.js (ML inference). The pattern: **any compute that a server would do per-request can instead ship as code and run per-visitor.** The visitor pays the CPU; you pay nothing.

**Combinatorial prerendering.** When inputs are enumerable, don't compute — enumerate. Every date pair, every filter combination, every locale variant, rendered at build time. "Dynamic" pages are often just a small input space nobody bothered to enumerate. The build farm (free Actions minutes) absorbs exponential cost so the runtime is O(1) file lookup.

### State without a server

**The URL is a database.** Full application state compressed into the URL fragment — which never even reaches the CDN (fragments are not sent in requests). Every share, bookmark, and back-button press is a database operation. Serverless persistence with built-in distribution: the state travels *inside the link*.

**Local-first + CRDTs.** State lives in each visitor's browser (IndexedDB); conflict-free replicated data types make merging automatic. Sync needs only a dumb channel — a file exchange, a paste, a QR code. The static site ships the algebra; the users carry the data.

**Peer-to-peer over WebRTC.** Two browsers can talk directly; the only server-shaped need is signaling, and that fits in a copy-pasted blob or QR code. A static page that becomes a multiplayer app the moment two visitors exchange a link — the CDN distributed the program, then got out of the way.

### Writes without owning a server

**Git as the write API.** GitHub issue forms are structured, authenticated, spam-filtered, audit-logged write endpoints — for free. An Action triages new issues, validates, commits the extracted data, redeploys. Users "post to the database" by opening an issue; the giscus comment pattern is one instance of a general shape.

**`repository_dispatch` as a webhook.** Any system holding a token can POST to the GitHub API and trigger a rebuild with a payload. That is an authenticated inbound API endpoint whose handler is a workflow. Latency is measured in minutes, not milliseconds — but the four tests never promised milliseconds, only truth at rebuild cadence.

**Build-time A/B.** Commit exported analytics, let the build pick variants (a bandit algorithm run as a build step), ship the winner. Personalization logic without a personalization server — the feedback loop closes through the repo instead of through a request.

### The honest limits of stretching

Every idea above still fails the same four tests when pushed to its end state: the moment two strangers must contend for one resource *right now* (transactional writes), the moment a secret must be evaluated per-request, or the moment truth must be fresher than a rebuild — a server exists, just hopefully someone else's. Stretching does not move the boundary; it reveals how much territory was on the static side all along.

## What this document is for

When someone proposes a feature, run the four tests. If it passes, pick the cheapest escape hatch (snapshot → client compute → delegation → third party, in that order of preference — earlier hatches add no runtime dependencies). If it fails, the answer is a handoff link to a system that is allowed to be dynamic, not a backend.

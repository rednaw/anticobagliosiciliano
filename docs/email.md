# Email (mailto contact)

Enquiries stay on the guest’s own mail client. The site never posts form data to a server; it only builds a `mailto:` link.

## Design

- **Static, mailto-only.** No contact API, no form backend, no transactional email provider. GitHub Pages cannot run one; this is intentional, not a temporary gap.
- **Owner inbox is `site.email`.** Single address in `src/lib/data/content.ts` (`info@anticobagliosiciliano.it`). Footer, privacy, JSON-LD, and the contact form all use it.
- **Client opens the message.** Submit is an `<a href="mailto:…">` (new target). The browser / OS mail app drafts the message; the guest still presses send. We only receive what they send.
- **Validate before open.** Native constraint validation plus custom checks (dates, occupancy, message length / unsafe markup). Invalid clicks are cancelled; no empty or hostile body is launched.
- **Occupancy shapes the form, not the mail.** Disabled nights and free-house hints stay in the UI. The mailto body does not include an occupancy line (see [occupancy.md](./occupancy.md)).

## Mailto shape

```text
mailto:{site.email}?subject={…}&body={…}
```

- Subject: availability request heading, optional house name, guest name.
- Body (CRLF for iOS): name, email, house (or “no preference”), check-in / check-out, adults, children, message.
- Prefill house from `?casa=` on `/contatti/` when the guest came from a house page (`CONTACT_HOUSE_PARAM`).

## Surfaces

| Surface | Behaviour |
|---|---|
| `/contatti/` (and `/en/contatti/`) | Form → gated mailto |
| Footer | Plain `mailto:{site.email}` |
| Privacy | Address link + copy that the form is mailto-only |
| JSON-LD | `email: site.email` on the lodging business |

## Code map

| Concern | Where |
|---|---|
| Inbox address | `src/lib/data/content.ts` (`site.email`) |
| Href builder, gate, message rules | `src/lib/standard/contact-mail.ts` |
| Form UI | `src/routes/(site)/contatti/+page.svelte` |
| Footer / privacy links | `Footer.svelte`, `privacy/+page.svelte` |
| House query param | `CONTACT_HOUSE_PARAM` in `i18n.ts` |

Agent edit constraints: `.cursor/rules/email.mdc`.

## Operator note

Change the public inbox only in `site.email` (`README.md` → Contact email). Copy CSV export skips that field on purpose.

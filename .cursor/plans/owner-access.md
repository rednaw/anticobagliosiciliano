---
name: Owner access (one conversation)
status: pending
saved: 2026-09-11
overview: Remote (two countries). One ask — they grant Register.it, WordPress, Lodgify, and Google Business Profile; you grant GitHub Write on this repo for /admin/. You do every technical step. Cutover how-to is the SEO runbook.
todos:
  - id: conversation
    content: One ask — Register.it TA, WordPress Administrator, Lodgify owner login, GBP manager; invite owners Write on this repo for CMS
    status: pending
---

# Owner access — one conversation

You and the owners are in different countries. There is no shared keyboard and no “they click while you watch.”

**Shape:** (1) one ask, two directions — they grant you their four systems, you grant them GitHub Write here; (2) you do every technical step. Occupancy API (`LODGIFY_API_KEY`) already works and is not this conversation. Live `/admin/` GitHub OAuth already works on github.io. iac `.it` origin is the SEO cutover, not this ask.

What to type in DNS, which URLs 301, and when to flip `SITE_*` live in `.cursor/plans/domain-cutover-seo.md`. Do not grow this file into that checklist. `/admin/` collections and YAML live in the Sveltia plan and `.cursor/rules/sveltia-cms.mdc`.

## Register.it

Technical Administrator. You create your **own** Register.it account; they paste your code under **I miei amministratori tecnici**. You open their DNS from **I miei clienti**. They can revoke you. No shared password, no TransIP transfer. Guide: [Technical Administrator](https://www.register.it/help/technical-administrator-come-crearlo-invitarlo/).

- [ ] Your Register.it account exists; Technical Administrator code is ready
- [ ] They add you as Technical Administrator
- [ ] You can open their DNS panel

## WordPress

They invite you as **Administrator** on WordPress.com. Your own login; they never share theirs; they can remove you. Editor is not enough. Guide: [Invita gli utenti](https://wordpress.com/it/support/invite-people/) (role **Amministratore**).

There is no self-hosted WordPress. Both public sites are WordPress.com: first `anticobagliosiciliano.wordpress.com`, later the custom domain `.it` (still the live site). Maps still cites wordpress.com.

- [ ] Administrator on the `.it` site
- [ ] If the old wordpress.com site is still in their account: Administrator there too (same invite)

## Lodgify

Professional account exists. Associate IAM is too thin: after login you see almost none of the admin. Website, custom domain, and redirects are owner-only. Calendar/API is a different permission and already works.

The owners already offered their username and password. Take that offer. Do not wait for a Website/Domain grant that may not exist.

- [ ] Owner login they already offered

## Google Business Profile

The site links to their Maps listing (`https://maps.app.goo.gl/NA1BwasQVcFzn1qHA`) in Come arrivare and JSON-LD `sameAs`. The listing website field still points at WordPress; you change it to `https://anticobagliosiciliano.it/` in the cutover week.

You need **Manager** access on the listing for Antico Baglio Siciliano — not just the share link you created from Maps. They invite you in [Google Business Profile](https://business.google.com/) (their login → Business → Users → Add user → Manager). Your own Google account; they can remove you.

While you have access, confirm: (1) this is the only listing for the baglio near Balestrate (no duplicate); (2) the pin matches the site coordinates; (3) you can edit website, hours, and photos.

- [ ] Manager on the Antico Baglio Siciliano listing
- [ ] Listing share link matches `maps.app.goo.gl/NA1BwasQVcFzn1qHA` (or update `baglioLocation.links` if theirs differs)

## GitHub (CMS)

Sveltia `/admin/` commits as the signed-in GitHub user. Each owner who will edit copy needs their **own** GitHub account and **Write** on `rednaw/anticobagliosiciliano` only. You invite; they accept. No shared GitHub login. Do not give Admin (Pages, secrets, collaborators). Do not add them to other rednaw repos.

They sign in at the live admin (`https://rednaw.github.io/anticobagliosiciliano/admin/` until `.it` cutover) with **Sign in with GitHub**.

Guide: [Inviting collaborators](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository) (role **Write**).

- [ ] Each owner who will edit copy has their own GitHub account
- [ ] You invite them Write on this repo
- [ ] They have accepted

## After this conversation

You have Register.it, WordPress, Lodgify, and GBP. They have Write here. Stop. Cutover is the SEO runbook.

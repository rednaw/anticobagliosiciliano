<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { contactCopy, housesSource, site } from '$lib/data/content';
	import Picker from '$lib/standard/Picker.svelte';
	import StayDates from '$lib/standard/StayDates.svelte';
	import { CONTACT_HOUSE_PARAM, pick, ui, type Locale } from '$lib/standard/i18n';

	const ADULT_OPTIONS = numberOptions(1, 20);
	const CHILD_OPTIONS = numberOptions(0, 20);

	function numberOptions(from: number, to: number) {
		return Array.from({ length: to - from + 1 }, (_, i) => {
			const value = String(from + i);
			return { value, label: value };
		});
	}

	const MESSAGE_MAX_LENGTH = 500;
	const DISALLOWED_CHARS =
		/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/;
	const HTML_MARKUP = /<\s*\/?\s*[a-zA-Z!?]/;

	const locale = $derived((page.data.locale ?? 'it') as Locale);
	const heading = $derived(pick(ui.requestAvailability, locale));
	const t = $derived((key: keyof typeof contactCopy) => pick(contactCopy[key], locale));

	let name = $state('');
	let email = $state('');
	let houseSlug = $state('');
	let checkIn = $state('');
	let checkOut = $state('');
	let adults = $state('2');
	let children = $state('0');
	let message = $state('');
	let mailLink = $state<HTMLAnchorElement | null>(null);
	let dateError = $state('');

	onMount(() => {
		const requested = page.url.searchParams.get(CONTACT_HOUSE_PARAM) ?? '';
		if (housesSource.some((h) => h.slug === requested)) houseSlug = requested;
	});

	const selectedHouse = $derived(housesSource.find((h) => h.slug === houseSlug));
	const houseOptions = $derived([
		{ value: '', label: t('houseAny') },
		...housesSource.map((house) => ({ value: house.slug, label: house.name }))
	]);

	/** Browsers phrase their own validation bubbles in the browser language, not the site's. */
	function fieldError(el: HTMLInputElement | HTMLTextAreaElement): string {
		if (el.validity.valueMissing) return t('fieldRequired');
		if (el.validity.typeMismatch) return t('emailInvalid');
		if (el.name === 'message') return messageValidity(message);
		return '';
	}

	function messageValidity(value: string): string {
		if (value.length > MESSAGE_MAX_LENGTH) return t('messageTooLong');
		if (DISALLOWED_CHARS.test(value) || HTML_MARKUP.test(value)) return t('messageUnsafe');
		return '';
	}

	const mailtoHref = $derived.by(() => {
		const houseLabel = selectedHouse?.name ?? t('mailNoHouse');
		const subject = encodeURIComponent(
			selectedHouse
				? `${heading} — ${selectedHouse.name} — ${name || t('mailGuest')}`
				: `${heading} — ${name || t('mailGuest')}`
		);
		const body = encodeURIComponent(
			[
				`${t('mailName')}: ${name}`,
				`${t('mailEmail')}: ${email}`,
				`${t('mailHouse')}: ${houseLabel}`,
				`${t('checkIn')}: ${checkIn}`,
				`${t('checkOut')}: ${checkOut}`,
				`${t('adults')}: ${adults}`,
				`${t('children')}: ${children}`,
				'',
				message || t('mailNoMessage')
			]
				.join('\n')
				.replace(/\r\n|\n|\r/g, '\r\n')
		);
		return `mailto:${site.email}?subject=${subject}&body=${body}`;
	});

	function onMailClick(event: MouseEvent) {
		const form = (event.currentTarget as HTMLElement).closest('form');
		if (!form) return;
		for (const el of form.elements) {
			if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
				el.setCustomValidity(fieldError(el));
			}
		}
		dateError = checkIn && checkOut ? '' : t('fieldRequired');
		const valid = form.checkValidity();
		if (valid && !dateError) return;
		event.preventDefault();
		if (!valid) form.reportValidity();
	}

	function submit(event: Event) {
		event.preventDefault();
		mailLink?.click();
	}
</script>

<section class="section">
	<div class="container layout">
		<div>
			<p class="eyebrow">{pick(ui.contact, locale)}</p>
			<h1>{heading}</h1>
			<p class="lead">{t('lead')}</p>
			<p class="direct">
				{t('direct')}
				<a href={`mailto:${site.email}`}>{site.email}</a>
			</p>
		</div>

		<form class="form" novalidate onsubmit={submit}>
			<label>
				<span>{t('name')}</span>
				<input type="text" name="name" bind:value={name} required autocomplete="name" />
			</label>
			<label>
				<span>{t('email')}</span>
				<input type="email" name="email" bind:value={email} required autocomplete="email" />
			</label>
			<Picker bind:value={houseSlug} label={t('house')} options={houseOptions} />
			<StayDates bind:checkIn bind:checkOut bind:error={dateError} {locale} />
			<div class="row">
				<Picker bind:value={adults} label={t('adults')} options={ADULT_OPTIONS} />
				<Picker bind:value={children} label={t('children')} options={CHILD_OPTIONS} />
			</div>
			<label>
				<span>{t('message')}</span>
				<textarea
					name="message"
					rows="5"
					maxlength={MESSAGE_MAX_LENGTH}
					bind:value={message}
					placeholder={t('messagePlaceholder')}
				></textarea>
				<span class="char-count">{message.length}/{MESSAGE_MAX_LENGTH}</span>
			</label>
			<a
				bind:this={mailLink}
				class="btn"
				href={mailtoHref}
				target="_blank"
				rel="noopener noreferrer"
				onclick={onMailClick}
			>
				{t('submit')}
			</a>
			<p class="hint">{t('hint')}</p>
		</form>
	</div>
</section>

<style>
	.layout {
		display: grid;
		gap: 2.5rem;
		align-items: start;
	}

	h1 {
		margin: 0 0 0.85rem;
		font-size: clamp(2.4rem, 6vw, 3.8rem);
	}

	.lead {
		margin: 0 0 1rem;
		font-size: 1.15rem;
		color: var(--ink-soft);
		max-width: 34rem;
	}

	.direct {
		margin: 0;
		color: var(--muted);
	}

	.direct a {
		color: var(--sea);
		font-weight: 600;
		text-decoration: none;
	}

	.form {
		display: grid;
		gap: 1rem;
		padding: 1.5rem;
		background: #fff;
		border: 1px solid var(--line);
	}

	label {
		display: grid;
		gap: 0.4rem;
	}

	label span {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink-soft);
	}

	label span.char-count {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--muted);
		justify-self: end;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.8rem 0.9rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--paper);
		color: var(--ink);
		font: inherit;
	}

	input:focus,
	textarea:focus {
		outline: 2px solid color-mix(in srgb, var(--sea) 45%, transparent);
		outline-offset: 1px;
		background: #fff;
	}

	.row {
		display: grid;
		gap: 1rem;
	}

	.hint {
		margin: 0;
		font-size: 0.9rem;
		color: var(--muted);
	}

	@media (min-width: 720px) {
		.row {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 960px) {
		.layout {
			grid-template-columns: 0.9fr 1.1fr;
			gap: 4rem;
		}

		.form {
			padding: 2rem;
		}
	}
</style>

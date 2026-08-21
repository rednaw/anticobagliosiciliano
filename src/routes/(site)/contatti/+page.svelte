<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { contactCopy, housesSource, site } from '$lib/data/content';
	import {
		MESSAGE_MAX_LENGTH,
		acceptedHouseSlug,
		buildMailtoHref,
		contactFieldError,
		gateMailtoClick,
		housesFreeHint,
		messageValidity
	} from '$lib/standard/contact-mail';
	import {
		freeHouses,
		nightIsOccupied,
		occupancySnapshot,
		stayIsOccupied
	} from '$lib/standard/occupancy';
	import Picker from '$lib/standard/Picker.svelte';
	import StayDates from '$lib/standard/StayDates.svelte';
	import { CONTACT_HOUSE_PARAM, pick, ui } from '$lib/standard/i18n';

	const ADULT_OPTIONS = numberOptions(1, 20);
	const CHILD_OPTIONS = numberOptions(0, 20);

	function numberOptions(from: number, to: number) {
		return Array.from({ length: to - from + 1 }, (_, i) => {
			const value = String(from + i);
			return { value, label: value };
		});
	}

	const locale = $derived(page.data.locale);
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
	let errors = $state({ name: '', email: '', message: '' });

	onMount(() => {
		houseSlug = acceptedHouseSlug(page.url.searchParams.get(CONTACT_HOUSE_PARAM) ?? '');
	});

	const freeForStay = $derived(
		checkIn && checkOut ? freeHouses(occupancySnapshot, checkIn, checkOut) : null
	);
	const houseOptions = $derived([
		{ value: '', label: t('houseAny') },
		...housesSource.map((house) => ({
			value: house.slug,
			label: house.name,
			disabled: Boolean(freeForStay && !freeForStay.some((slug) => slug === house.slug))
		}))
	]);

	const stayOccupied = $derived(stayIsOccupied(occupancySnapshot, houseSlug, checkIn, checkOut));
	const noPreferenceHint = $derived(
		houseSlug || !freeForStay ? '' : housesFreeHint(locale, freeForStay)
	);

	$effect(() => {
		if (!checkIn) return;
		if (nightIsOccupied(occupancySnapshot, houseSlug, checkIn)) {
			checkIn = '';
			checkOut = '';
			return;
		}
		if (checkOut && stayIsOccupied(occupancySnapshot, houseSlug, checkIn, checkOut)) {
			checkOut = '';
		}
	});

	const mailtoHref = $derived(
		buildMailtoHref({
			locale,
			name,
			email,
			houseSlug,
			checkIn,
			checkOut,
			adults,
			children,
			message
		})
	);

	function onMailClick(event: MouseEvent) {
		gateMailtoClick(event, {
			checkIn,
			checkOut,
			requiredMessage: t('fieldRequired'),
			datesUnavailable: stayOccupied,
			unavailableMessage: t('occupancyBlocked'),
			fieldError: (el) =>
				contactFieldError(el, {
					required: t('fieldRequired'),
					emailInvalid: t('emailInvalid'),
					messageError: messageValidity(message, locale)
				}),
			setDateError: (msg) => {
				dateError = msg;
			},
			setFieldErrors: (next) => {
				errors = {
					name: next.name ?? '',
					email: next.email ?? '',
					message: next.message ?? ''
				};
			}
		});
	}

	function clearFieldError(event: Event) {
		const el = event.target;
		if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return;
		if (el.name === 'name' || el.name === 'email' || el.name === 'message') errors[el.name] = '';
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

		<form class="form" novalidate onsubmit={submit} oninput={clearFieldError}>
			{#snippet fieldError(name: 'name' | 'email' | 'message')}
				{#if errors[name]}
					<p id="{name}-error" class="field-error">{errors[name]}</p>
				{/if}
			{/snippet}
			<label>
				<span>{t('name')}</span>
				<input
					type="text"
					name="name"
					bind:value={name}
					class:invalid={Boolean(errors.name)}
					required
					autocomplete="name"
					aria-invalid={errors.name ? true : undefined}
					aria-describedby={errors.name ? 'name-error' : undefined}
				/>
				{@render fieldError('name')}
			</label>
			<label>
				<span>{t('email')}</span>
				<input
					type="email"
					name="email"
					bind:value={email}
					class:invalid={Boolean(errors.email)}
					required
					autocomplete="email"
					aria-invalid={errors.email ? true : undefined}
					aria-describedby={errors.email ? 'email-error' : undefined}
				/>
				{@render fieldError('email')}
			</label>
			<Picker bind:value={houseSlug} label={t('house')} options={houseOptions} />
			<StayDates
				bind:checkIn
				bind:checkOut
				bind:error={dateError}
				{locale}
				occupiedNight={(iso) => nightIsOccupied(occupancySnapshot, houseSlug, iso)}
			/>
			{#if noPreferenceHint}
				<p class="field-hint">{noPreferenceHint}</p>
			{/if}
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
					class:invalid={Boolean(errors.message)}
					placeholder={t('messagePlaceholder')}
					aria-invalid={errors.message ? true : undefined}
					aria-describedby={errors.message ? 'message-error' : undefined}
				></textarea>
				{@render fieldError('message')}
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

	input.invalid,
	textarea.invalid {
		border-color: var(--error);
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

	.field-hint {
		margin: -0.45rem 0 0;
		font-size: 0.85rem;
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

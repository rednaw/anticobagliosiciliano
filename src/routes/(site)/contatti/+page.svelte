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
	let nameEl = $state<HTMLInputElement | null>(null);
	let emailEl = $state<HTMLInputElement | null>(null);
	let messageEl = $state<HTMLTextAreaElement | null>(null);
	let dateError = $state('');
	let nameError = $state('');
	let emailError = $state('');
	let messageError = $state('');
	const uid = $props.id();

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

	/** In-page red errors use the site language. Do not open the browser popup. */
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
			}
		});
		nameError = nameEl?.validationMessage ?? '';
		emailError = emailEl?.validationMessage ?? '';
		messageError = messageEl?.validationMessage ?? '';
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
				<input
					bind:this={nameEl}
					type="text"
					name="name"
					bind:value={name}
					class:invalid={Boolean(nameError)}
					required
					autocomplete="name"
					aria-invalid={nameError ? true : undefined}
					aria-describedby={nameError ? `${uid}-name-error` : undefined}
					oninput={() => (nameError = '')}
				/>
				{#if nameError}
					<p id={`${uid}-name-error`} class="error">{nameError}</p>
				{/if}
			</label>
			<label>
				<span>{t('email')}</span>
				<input
					bind:this={emailEl}
					type="email"
					name="email"
					bind:value={email}
					class:invalid={Boolean(emailError)}
					required
					autocomplete="email"
					aria-invalid={emailError ? true : undefined}
					aria-describedby={emailError ? `${uid}-email-error` : undefined}
					oninput={() => (emailError = '')}
				/>
				{#if emailError}
					<p id={`${uid}-email-error`} class="error">{emailError}</p>
				{/if}
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
					bind:this={messageEl}
					name="message"
					rows="5"
					maxlength={MESSAGE_MAX_LENGTH}
					bind:value={message}
					class:invalid={Boolean(messageError)}
					placeholder={t('messagePlaceholder')}
					aria-invalid={messageError ? true : undefined}
					aria-describedby={messageError ? `${uid}-message-error` : undefined}
					oninput={() => (messageError = '')}
				></textarea>
				{#if messageError}
					<p id={`${uid}-message-error`} class="error">{messageError}</p>
				{/if}
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

	.error {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--error);
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

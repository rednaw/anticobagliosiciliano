<script lang="ts">
	import { page } from '$app/state';
	import { contactCopy, site } from '$lib/data/content';
	import { pick, ui, type Locale } from '$lib/standard/i18n';

	const locale = $derived((page.data.locale ?? 'it') as Locale);
	const heading = $derived(pick(ui.requestAvailability, locale));
	const t = $derived((key: keyof typeof contactCopy) => pick(contactCopy[key], locale));

	let name = $state('');
	let email = $state('');
	let checkIn = $state('');
	let checkOut = $state('');
	let adults = $state('2');
	let children = $state('0');
	let message = $state('');
	let checkInEl = $state<HTMLInputElement | null>(null);
	let checkOutEl = $state<HTMLInputElement | null>(null);

	const today = $derived(localIsoDate());
	const minCheckOut = $derived(checkIn ? addDaysIso(checkIn, 2) : addDaysIso(today, 2));

	$effect(() => {
		checkInEl?.setCustomValidity(checkIn && checkIn < today ? t('datePast') : '');
		checkOutEl?.setCustomValidity(
			!checkIn || !checkOut
				? ''
				: checkOut <= checkIn
					? t('dateOrder')
					: checkOut < minCheckOut
						? t('dateMinStay')
						: ''
		);
	});

	function submit(event: Event) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}
		const subject = encodeURIComponent(`${heading} — ${name || t('mailGuest')}`);
		const body = encodeURIComponent(
			[
				`${t('mailName')}: ${name}`,
				`${t('mailEmail')}: ${email}`,
				`${t('checkIn')}: ${checkIn}`,
				`${t('checkOut')}: ${checkOut}`,
				`${t('adults')}: ${adults}`,
				`${t('children')}: ${children}`,
				'',
				message || t('mailNoMessage')
			].join('\n')
		);
		window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
	}

	function localIsoDate(d = new Date()): string {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}

	function addDaysIso(iso: string, days: number): string {
		const [y, m, d] = iso.split('-').map(Number);
		return localIsoDate(new Date(y, m - 1, d + days));
	}
</script>

<svelte:head>
	<title>{heading} · {site.name}</title>
	<meta name="description" content={t('metaDescription')} />
</svelte:head>

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

		<form class="form" onsubmit={submit}>
			<label>
				<span>{t('name')}</span>
				<input type="text" name="name" bind:value={name} required autocomplete="name" />
			</label>
			<label>
				<span>{t('email')}</span>
				<input type="email" name="email" bind:value={email} required autocomplete="email" />
			</label>
			<div class="row">
				<label>
					<span>{t('checkIn')}</span>
					<input
						bind:this={checkInEl}
						type="date"
						name="checkin"
						bind:value={checkIn}
						min={today}
						required
					/>
				</label>
				<label>
					<span>{t('checkOut')}</span>
					<input
						bind:this={checkOutEl}
						type="date"
						name="checkout"
						bind:value={checkOut}
						min={minCheckOut}
						required
					/>
				</label>
			</div>
			<div class="row">
				<label>
					<span>{t('adults')}</span>
					<input type="number" name="adults" min="1" max="20" bind:value={adults} required />
				</label>
				<label>
					<span>{t('children')}</span>
					<input type="number" name="children" min="0" max="20" bind:value={children} />
				</label>
			</div>
			<label>
				<span>{t('message')}</span>
				<textarea
					name="message"
					rows="5"
					bind:value={message}
					placeholder={t('messagePlaceholder')}
				></textarea>
			</label>
			<button class="btn" type="submit">{t('submit')}</button>
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

	input,
	textarea {
		width: 100%;
		padding: 0.8rem 0.9rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--paper);
		color: var(--ink);
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

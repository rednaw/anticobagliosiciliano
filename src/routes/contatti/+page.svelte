<script lang="ts">
	import { site } from '$lib/data/content';

	let name = $state('');
	let email = $state('');
	let checkIn = $state('');
	let checkOut = $state('');
	let adults = $state('2');
	let children = $state('0');
	let message = $state('');

	function submit(event: Event) {
		event.preventDefault();
		const subject = encodeURIComponent(`Richiesta disponibilità — ${name || 'Ospite'}`);
		const body = encodeURIComponent(
			[
				`Nome: ${name}`,
				`Email: ${email}`,
				`Check-in: ${checkIn}`,
				`Check-out: ${checkOut}`,
				`Adulti: ${adults}`,
				`Bambini: ${children}`,
				'',
				message || '(nessun messaggio)'
			].join('\n')
		);
		window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
	}
</script>

<svelte:head>
	<title>Contatti · {site.name}</title>
	<meta
		name="description"
		content="Richiedi disponibilità per un soggiorno all’Antico Baglio Siciliano."
	/>
</svelte:head>

<section class="section">
	<div class="container layout">
		<div>
			<p class="eyebrow">Contatti</p>
			<h1>Richiesta disponibilità</h1>
			<p class="lead">
				Raccontaci quando vorresti venire: ti rispondiamo con disponibilità e dettagli per il tuo
				soggiorno.
			</p>
			<p class="direct">
				Oppure scrivi direttamente a
				<a href={`mailto:${site.email}`}>{site.email}</a>
			</p>
		</div>

		<form class="form" onsubmit={submit}>
			<label>
				<span>Il tuo nome</span>
				<input type="text" name="name" bind:value={name} required autocomplete="name" />
			</label>
			<label>
				<span>La tua email</span>
				<input type="email" name="email" bind:value={email} required autocomplete="email" />
			</label>
			<div class="row">
				<label>
					<span>Check-in</span>
					<input type="date" name="checkin" bind:value={checkIn} required />
				</label>
				<label>
					<span>Check-out</span>
					<input type="date" name="checkout" bind:value={checkOut} required />
				</label>
			</div>
			<div class="row">
				<label>
					<span>Adulti</span>
					<input type="number" name="adults" min="1" max="20" bind:value={adults} required />
				</label>
				<label>
					<span>Bambini</span>
					<input type="number" name="children" min="0" max="20" bind:value={children} />
				</label>
			</div>
			<label>
				<span>Messaggio (facoltativo)</span>
				<textarea name="message" rows="5" bind:value={message} placeholder="Casa preferita, esigenze particolari…"
				></textarea>
			</label>
			<button class="btn" type="submit">Invia richiesta</button>
			<p class="hint">Si apre il tuo client email con il messaggio già compilato.</p>
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

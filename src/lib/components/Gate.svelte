<script lang="ts">
	import { checkPassword, unlock } from '$lib/gate';
	import { site } from '$lib/data/content';

	let { onunlock }: { onunlock: () => void } = $props();

	let password = $state('');
	let error = $state(false);
	let inputEl = $state<HTMLInputElement | null>(null);

	$effect(() => {
		inputEl?.focus();
	});

	function submit(e: Event) {
		e.preventDefault();
		if (checkPassword(password)) {
			unlock();
			error = false;
			onunlock();
			return;
		}
		error = true;
		password = '';
		inputEl?.focus();
	}
</script>

<div class="gate-screen">
	<form class="gate-card" onsubmit={submit}>
		<label class="sr-only" for="site-password">Password</label>
		<input
			id="site-password"
			name="password"
			type="password"
			autocomplete="current-password"
			autocapitalize="off"
			spellcheck="false"
			placeholder="Password"
			bind:this={inputEl}
			bind:value={password}
			aria-invalid={error}
			aria-describedby={error ? 'gate-error' : undefined}
		/>
		{#if error}
			<p id="gate-error" class="error" role="alert">Password non corretta.</p>
		{/if}
		<button class="btn" type="submit">Entra</button>
	</form>
</div>

<style>
	.gate-screen {
		min-height: 100dvh;
		display: grid;
		place-items: center;
		padding: 1.5rem;
		background:
			radial-gradient(ellipse 80% 50% at 10% -10%, color-mix(in srgb, var(--sea) 14%, transparent), transparent 55%),
			radial-gradient(ellipse 60% 40% at 100% 0%, color-mix(in srgb, var(--olive) 10%, transparent), transparent 50%),
			var(--paper);
	}

	.gate-card {
		width: min(22rem, 100%);
		display: grid;
		gap: 0.85rem;
	}

	input {
		width: 100%;
		padding: 0.75rem 0.9rem;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: #fff;
		color: var(--ink);
	}

	input:focus {
		outline: 2px solid var(--sea);
		outline-offset: 2px;
	}

	.error {
		margin: 0;
		color: #8b2e2e;
		font-size: 0.92rem;
	}

	.btn {
		justify-self: start;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>

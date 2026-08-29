<script lang="ts">
  import { onMount } from 'svelte';
  import type { ArchivioIndex } from './types';

  let index = $state<ArchivioIndex | null>(null);
  let loadError = $state<string | null>(null);
  let activeId = $state('');

  onMount(async () => {
    try {
      const res = await fetch('/index.json');
      if (!res.ok) {
        throw new Error('index.json missing — run npm run archive:build from the repo root');
      }
      index = (await res.json()) as ArchivioIndex;
    } catch (err) {
      loadError = err instanceof Error ? err.message : 'Could not load archive index';
    }
  });

  const sources = $derived(index?.sources ?? []);
  const active = $derived(
    sources.find((s) => s.id === (activeId || sources[0]?.id)) ?? sources[0]
  );

  /** Minimal markdown → HTML for archived page copy (headings, paragraphs, tables as pre). */
  function renderMarkdown(md: string): string {
    const blocks = md.replace(/\r\n/g, '\n').trim().split(/\n{2,}/);
    return blocks
      .map((block) => {
        const lines = block.split('\n');
        if (lines.every((l) => /^\|/.test(l.trim()))) {
          return `<pre class="md-table">${escapeHtml(block)}</pre>`;
        }
        const h = block.match(/^(#{1,3})\s+(.+)$/);
        if (h && !block.includes('\n')) {
          const level = h[1].length;
          return `<h${level + 1}>${escapeHtml(h[2])}</h${level + 1}>`;
        }
        const html = escapeHtml(block).replace(/\n/g, '<br />');
        return `<p>${html}</p>`;
      })
      .join('\n');
  }

  function escapeHtml(s: string) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
</script>

<section class="page">
  <div class="container">
    <p class="eyebrow">Uso interno</p>
    <h1>Archivio siti precedenti</h1>
    <p class="lead">
      Galleria in sola lettura delle foto e dei testi recuperati dai vecchi siti. Clicca una
      miniatura per aprire l’immagine a piena risoluzione.
    </p>

    {#if loadError}
      <p class="status error">{loadError}</p>
    {:else if !index}
      <p class="status">Caricamento…</p>
    {:else}
      <div class="tabs" role="tablist" aria-label="Sorgente archivio">
        {#each sources as source}
          <button
            type="button"
            role="tab"
            class:active={source.id === active?.id}
            aria-selected={source.id === active?.id}
            onclick={() => (activeId = source.id)}
          >
            {source.label}
            <span class="count">
              {source.groups.reduce((n, g) => n + g.images.length, 0)} foto
            </span>
          </button>
        {/each}
      </div>

      {#if active}
        {#if active.urls?.length}
          <ul class="source-urls">
            {#each active.urls as link}
              <li>
                {link.label}:
                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
              </li>
            {/each}
          </ul>
        {:else if active.url}
          <p class="source-url">
            Fonte:
            <a href={active.url} target="_blank" rel="noopener noreferrer">{active.url}</a>
          </p>
        {/if}

        {#each active.groups as group}
          {#if group.images.length || group.texts.length}
            <section class="group" id="{active.id}-{group.id}">
              <h2>{group.label}</h2>

              {#if group.images.length}
                <ul class="grid">
                  {#each group.images as image}
                    <li>
                      <a
                        class="card"
                        href={image.full}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Apri originale: {image.filename}"
                      >
                        <img
                          src={image.thumb}
                          alt={image.title}
                          loading="lazy"
                          width="480"
                          height="360"
                        />
                        <span class="meta">
                          <span class="filename">{image.filename}</span>
                          <span>{image.width}×{image.height}</span>
                          <span>{formatBytes(image.bytes)}</span>
                        </span>
                      </a>
                    </li>
                  {/each}
                </ul>
              {/if}

              {#if group.texts.length}
                <div class="texts">
                  {#each group.texts as text}
                    <article class="text-block">
                      <h3>{text.title}</h3>
                      <p class="filename">{text.filename}</p>
                      <div class="body">
                        {@html renderMarkdown(text.body)}
                      </div>
                    </article>
                  {/each}
                </div>
              {/if}
            </section>
          {/if}
        {/each}
      {/if}
    {/if}
  </div>
</section>

<style>
  .page {
    padding: clamp(2.5rem, 6vw, 4rem) 0 4rem;
  }

  h1 {
    margin: 0 0 0.75rem;
    font-size: clamp(2rem, 5vw, 3rem);
    font-family: var(--font-display);
  }

  .lead {
    max-width: 42rem;
    color: var(--ink-soft);
    margin-bottom: 1.75rem;
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tabs button {
    appearance: none;
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--paper) 70%, white);
    color: var(--ink);
    padding: 0.55rem 0.9rem;
    border-radius: var(--radius);
    cursor: pointer;
    display: inline-flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .tabs button.active {
    background: var(--sea);
    border-color: var(--sea);
    color: #fff;
  }

  .count {
    font-size: 0.8rem;
    opacity: 0.75;
  }

  .source-url,
  .source-urls {
    font-size: 0.95rem;
    color: var(--muted);
    margin: 0 0 2rem;
  }

  .source-urls {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 0.35rem;
  }

  .group {
    margin-bottom: 2.75rem;
  }

  .group h2 {
    margin: 0 0 1rem;
    font-size: 1.45rem;
    text-transform: capitalize;
  }

  .grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    text-decoration: none;
    color: inherit;
    background: color-mix(in srgb, var(--paper-deep) 55%, white);
    border: 1px solid var(--line);
    overflow: hidden;
    height: 100%;
  }

  .card:hover,
  .card:focus-visible {
    outline: 2px solid var(--sea);
    outline-offset: 2px;
  }

  .card img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    background: var(--paper-deep);
  }

  .meta {
    display: grid;
    gap: 0.15rem;
    padding: 0.35rem 0.5rem 0.55rem;
    font-size: 0.72rem;
    line-height: 1.35;
    color: var(--muted);
  }

  .texts {
    display: grid;
    gap: 1.25rem;
  }

  .text-block {
    padding: 1.1rem 1.2rem;
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--paper) 80%, white);
  }

  .text-block h3 {
    margin: 0 0 0.25rem;
    font-size: 1.2rem;
    text-transform: capitalize;
  }

  .filename {
    color: var(--ink-soft);
    word-break: break-all;
  }

  .text-block .filename {
    margin: 0 0 0.85rem;
    font-size: 0.8rem;
    color: var(--muted);
  }

  .body :global(h2),
  .body :global(h3),
  .body :global(h4) {
    margin: 0.75rem 0 0.4rem;
    font-size: 1.05rem;
  }

  .body :global(p) {
    margin: 0 0 0.75rem;
    white-space: pre-wrap;
  }

  .body :global(.md-table) {
    overflow-x: auto;
    font-size: 0.8rem;
    padding: 0.75rem;
    background: var(--paper-deep);
    border: 1px solid var(--line);
  }
</style>

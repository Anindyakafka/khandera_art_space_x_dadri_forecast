<script lang="ts">
  import { renderSimpleMarkdown } from '$lib/content/markdown';
  export let data;

  const manifestoHtml = renderSimpleMarkdown(data.manifestoMarkdown);
</script>

<main class="dadri-root">
  <section class="title-screen" aria-label="Dadri Forecast introduction">
    <div class="title-center">
      <p class="eyebrow">Dadri Forecast</p>
      <h1>Dadri Forecast</h1>
      <p class="scroll-hint">Scroll to enter the archive</p>
    </div>
  </section>

  <section class="reveal-panel" aria-label="Dadri Forecast details">
    <article class="doc-root">
      <header class="panel-head">
        <h2>Militant research, collective memory, and grounded futures</h2>
        <p>
          Dadri Forecast has its own archive system. Use the section links below to access Dadri-only about, projects, artists, and events.
        </p>
      </header>

      <nav class="route-links" aria-label="Dadri Forecast navigation">
        <a href="/dadri-forecast/about">About</a>
        <a href="/dadri-forecast/projects">Projects</a>
        <a href="/dadri-forecast/artists">Artists</a>
        <a href="/dadri-forecast/events">Events</a>
        <a href={data.site.manifestoDocumentPath} target="_blank" rel="noopener noreferrer">Manifesto Document</a>
      </nav>

      <div class="doc-card">
        {@html manifestoHtml}
      </div>
    </article>
  </section>
  
  <section class="spacer" aria-hidden="true"></section>
</main>

<style>
  .dadri-root {
    color: var(--text);
  }

  .title-screen {
    min-height: calc(100svh - 6.2rem);
    display: grid;
    place-items: center;
    padding: 1rem;
  }

  .title-center {
    text-align: center;
    width: min(92vw, 760px);
  }

  .eyebrow {
    margin: 0;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--muted);
    font-weight: 700;
  }

  h1 {
    margin: 0.6rem 0;
    font-size: clamp(2rem, 11vw, 6.8rem);
    line-height: 0.9;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .scroll-hint {
    margin: 0;
    font-size: 0.82rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .reveal-panel {
    width: min(1100px, 96vw);
    margin: 0 auto;
    border-top: 1px solid var(--line);
    padding: clamp(1rem, 3.5vw, 2.6rem) 0 clamp(2rem, 5vw, 4rem);
  }

  .doc-root {
    width: min(84ch, 100%);
    margin: 0 auto;
  }

  .panel-head h2 {
    margin: 0 0 0.55rem;
    font-size: clamp(1.2rem, 3.3vw, 2.2rem);
  }

  .panel-head p {
    margin: 0;
    max-width: 74ch;
    line-height: 1.7;
    color: color-mix(in srgb, var(--text) 88%, transparent);
  }

  .route-links {
    margin: 1rem 0 1.25rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .route-links a {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 0.5rem 0.82rem;
    text-decoration: none;
    font-size: 0.82rem;
    letter-spacing: 0.03em;
    color: color-mix(in srgb, var(--text) 90%, transparent);
    background: color-mix(in srgb, var(--surface) 78%, transparent);
  }

  .route-links a:hover {
    border-color: color-mix(in srgb, var(--accent) 55%, var(--line));
    color: var(--accent);
  }

  .doc-card {
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    padding: 1.2rem 0;
  }

  .doc-card :global(h1),
  .doc-card :global(h2),
  .doc-card :global(h3) {
    letter-spacing: 0.03em;
    margin-top: 1rem;
    margin-bottom: 0.45rem;
    font-size: clamp(1.02rem, 2.2vw, 1.6rem);
  }

  .doc-card :global(p),
  .doc-card :global(li) {
    line-height: 1.76;
    color: color-mix(in srgb, var(--text) 92%, transparent);
    font-size: clamp(0.94rem, 1.35vw, 1.03rem);
  }

  .spacer {
    height: 5vh;
  }

  @media (max-width: 760px) {
    .title-screen {
      min-height: calc(100svh - 5.7rem);
      padding: 0.8rem;
    }

    h1 {
      font-size: clamp(2rem, 14vw, 4.2rem);
    }

    .doc-card {
      padding: 0.9rem 0;
    }
  }
</style>

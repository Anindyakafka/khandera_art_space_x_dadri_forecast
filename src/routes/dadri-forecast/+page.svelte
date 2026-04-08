<script lang="ts">
  import { renderSimpleMarkdown } from '$lib/content/markdown';
  export let data;

  const dadriLogoPath = '/media/images/dadri-forecast/logo.png';
  const manifestoHtml = renderSimpleMarkdown(data.manifestoMarkdown);
</script>

<main class="dadri-root">
  <section class="title-screen" aria-label="Dadri Forecast introduction">
    <div class="title-center">
      <img class="hero-logo" src={dadriLogoPath} alt="Dadri Forecast logo" />
      <h1>दादरी Forecast</h1>
      <span class="warning-bar">Militant Research Zone</span>
      <p class="scroll-hint">Scroll to enter the archive</p>
    </div>
  </section>

  <section class="reveal-panel" aria-label="Dadri Forecast details">
    <article class="doc-root">
      <header class="panel-head">
        <p class="section-no" aria-hidden="true">02</p>
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

      <div class="doc-card" data-flow-copy>
        <span class="warning-bar">Archive Text: Counter Narrative Material</span>
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
    position: relative;
    padding: 1rem 0;
  }

  .title-center::before,
  .title-center::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: min(78vw, 640px);
    height: 1px;
    background: color-mix(in srgb, var(--accent) 72%, var(--line));
  }

  .title-center::before {
    top: 0;
  }

  .title-center::after {
    bottom: 0;
  }

  .hero-logo {
    display: block;
    width: clamp(4.6rem, 14vw, 8.6rem);
    height: clamp(4.6rem, 14vw, 8.6rem);
    object-fit: contain;
    margin: 0 auto 0.75rem;
  }

  h1 {
    margin: 0.6rem 0;
    font-size: clamp(2.2rem, 12vw, 8rem);
    line-height: 0.9;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    text-shadow: 0 0 24px color-mix(in srgb, var(--accent) 30%, transparent);
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
    border-top: 2px solid color-mix(in srgb, var(--accent) 64%, var(--line));
    padding: clamp(1rem, 3.5vw, 2.6rem) 0 clamp(2rem, 5vw, 4rem);
  }

  .doc-root {
    width: min(84ch, 100%);
    margin: 0 auto;
  }

  .panel-head h2 {
    margin: 0 0 0.55rem;
    font-size: clamp(1.5rem, 4.8vw, 3.3rem);
    letter-spacing: 0.015em;
  }

  .panel-head .section-no {
    margin-bottom: 0.15rem;
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
    border-radius: 0;
    padding: 0.5rem 0.82rem;
    text-decoration: none;
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--text) 90%, transparent);
    background: color-mix(in srgb, var(--surface) 78%, transparent);
  }

  .route-links a:hover {
    border-color: color-mix(in srgb, var(--accent) 55%, var(--line));
    color: var(--accent);
  }

  .doc-card {
    border-top: 2px solid color-mix(in srgb, var(--accent) 64%, var(--line));
    border-bottom: 2px solid color-mix(in srgb, var(--line) 90%, transparent);
    padding: 1.2rem 0;
  }

  .doc-card :global(h1),
  .doc-card :global(h2),
  .doc-card :global(h3) {
    letter-spacing: 0.012em;
    margin-top: 1.1rem;
    margin-bottom: 0.8rem;
    font-size: clamp(1.28rem, 3.4vw, 2.4rem);
  }

  .doc-card :global(h1 + p),
  .doc-card :global(h2 + p),
  .doc-card :global(h3 + p) {
    margin-top: 0.2rem;
  }

  .doc-card :global(p),
  .doc-card :global(li) {
    line-height: 1.76;
    color: color-mix(in srgb, var(--text) 92%, transparent);
    font-size: clamp(0.95rem, 1.35vw, 1.05rem);
    max-width: 78ch;
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

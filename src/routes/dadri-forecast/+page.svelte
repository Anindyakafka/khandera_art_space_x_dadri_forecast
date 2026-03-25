<script lang="ts">
  import { renderSimpleMarkdown } from '$lib/content/markdown';
  export let data;

  const manifestoHtml = renderSimpleMarkdown(data.manifestoMarkdown);
</script>

<main class="forecast-overview">
  <section class="overview-hero">
    <p class="kicker">Dadri Forecast</p>
    <h1>Militant research, collective memory, and grounded futures</h1>
    <p>
      This page holds the larger context of Dadri Forecast. Project-specific documentation now lives on a separate dedicated page.
    </p>
    <a class="project-cta" href="/dadri-forecast/projects">Open Dadri Forecast Projects</a>
  </section>

  <article class="doc-root">
    <div class="doc-card">
      {@html manifestoHtml}
      <nav class="route-links" aria-label="Dadri Forecast navigation">
        <a href="/dadri-forecast/about">About</a>
        <a href="/dadri-forecast/projects">Projects</a>
        <a href="/dadri-forecast/artists">Artists</a>
        <a href="/dadri-forecast/events">Events</a>
        <a href={data.site.manifestoDocumentPath} target="_blank" rel="noopener noreferrer">Download manifesto document</a>
      </nav>
    </div>
  </article>
</main>

<style>
  .forecast-overview {
    color: var(--text);
    width: min(1080px, 96vw);
    margin: clamp(1rem, 3.5vw, 2.5rem) auto clamp(2rem, 5vw, 4rem);
  }

  .overview-hero {
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    padding: clamp(1rem, 2.4vw, 1.8rem);
    background:
      radial-gradient(circle at 14% 18%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 58%),
      radial-gradient(circle at 88% 78%, color-mix(in srgb, var(--hero-c) 12%, transparent), transparent 50%);
  }

  .kicker {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    font-size: 0.76rem;
    font-weight: 700;
  }

  h1 {
    margin: 0.45rem 0 0.6rem;
    font-size: clamp(1.5rem, 4.8vw, 3.1rem);
    line-height: 1.05;
    text-wrap: balance;
  }

  .overview-hero p {
    margin: 0;
    max-width: 78ch;
    line-height: 1.68;
    color: color-mix(in srgb, var(--text) 90%, transparent);
  }

  .project-cta {
    display: inline-flex;
    margin-top: 1rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 0.55rem 0.9rem;
    text-decoration: none;
    font-size: 0.84rem;
    font-weight: 700;
    color: color-mix(in srgb, var(--accent) 82%, var(--text));
  }

  .project-cta:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
  }

  .doc-root {
    max-width: 78ch;
    margin: clamp(1.1rem, 4vw, 2.3rem) auto;
    padding: 0 clamp(0.85rem, 3.2vw, 1.25rem);
  }

  .doc-card {
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    padding: 1.2rem 0;
  }

  .doc-card :global(h1),
  .doc-card :global(h2),
  .doc-card :global(h3) {
    letter-spacing: 0.04em;
    margin-top: 1.05rem;
    margin-bottom: 0.45rem;
    font-size: clamp(1.05rem, 2.4vw, 1.8rem);
  }

  .doc-card :global(p),
  .doc-card :global(li) {
    line-height: 1.72;
    color: color-mix(in srgb, var(--text) 90%, transparent);
    font-size: clamp(0.92rem, 1.6vw, 1.02rem);
  }

  .route-links {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .route-links a {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 0.48rem 0.78rem;
    text-decoration: none;
    font-size: 0.82rem;
    color: color-mix(in srgb, var(--text) 92%, transparent);
  }

  .route-links a:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
    color: color-mix(in srgb, var(--accent) 78%, var(--text));
  }

  @media (max-width: 760px) {
    .overview-hero {
      padding: 0.82rem;
    }

    .doc-card {
      padding: 0.85rem 0;
    }
  }
</style>

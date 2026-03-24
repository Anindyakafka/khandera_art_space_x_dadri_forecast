<script lang="ts">
  import { renderSimpleMarkdown } from '$lib/content/markdown';
  export let data;

  const manifestoHtml = renderSimpleMarkdown(data.manifestoMarkdown);
</script>

<div class="container">
  <!-- Manifesto Section -->
  <article class="doc-root">
    <div class="doc-card">
      {@html manifestoHtml}
      <p class="download-row">
        <a href={data.site.manifestoDocumentPath} target="_blank" rel="noopener noreferrer">Download manifesto document</a>
      </p>
    </div>
  </article>

  <!-- Artists Section -->
  <section class="section">
    <h1>Artists</h1>
    <div class="grid">
      {#each data.artists as artist}
        <article class="artist-card">
          <img src={artist.avatar} alt={artist.name} loading="lazy" />
          <h2>{artist.name}</h2>
          <p class="role">{artist.role}</p>
          <p>{artist.bio}</p>
          {#if artist.instagram}
            <a href={artist.instagram} target="_blank" rel="noopener noreferrer">IG</a>
          {/if}
        </article>
      {/each}
    </div>
  </section>
</div>

<style>
  .container {
    color: var(--text);
  }

  /* Manifesto Styles */
  .doc-root {
    max-width: 78ch;
    margin: clamp(1.2rem, 4vw, 2.5rem) auto;
    padding: 0 clamp(0.85rem, 3.2vw, 1.25rem);
  }

  .doc-card {
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    border-radius: 0;
    padding: 1.25rem 0;
    background: transparent;
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

  .download-row {
    margin-top: 1.6rem;
    padding-top: 1rem;
    border-top: 1px dashed color-mix(in srgb, var(--line) 85%, transparent);
  }

  .download-row a {
    font-weight: 700;
  }

  /* Artists Styles */
  .section {
    max-width: min(1080px, 94vw);
    margin: clamp(1.2rem, 4.2vw, 3.6rem) auto;
    padding: 0 0.3rem;
  }

  .section h1 {
    margin-bottom: 0.7rem;
    font-size: clamp(1.45rem, 4.8vw, 2.5rem);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: clamp(0.65rem, 1.8vw, 1rem);
  }

  .artist-card {
    background: transparent;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    border-radius: 0;
    padding: clamp(0.72rem, 2.2vw, 1rem);
  }

  .artist-card img {
    width: 100%;
    border-radius: 0.6rem;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }

  .role {
    margin-top: 0.2rem;
    color: var(--muted);
  }

  @media (max-width: 640px) {
    .doc-card {
      padding: 0.85rem 0;
    }

    .download-row {
      margin-top: 1.1rem;
      padding-top: 0.75rem;
    }

    .section {
      margin: 1rem auto 2rem;
    }

    .grid {
      grid-template-columns: 1fr;
    }

    .artist-card img {
      border-radius: 0.42rem;
      aspect-ratio: 16 / 11;
    }
  }
</style>

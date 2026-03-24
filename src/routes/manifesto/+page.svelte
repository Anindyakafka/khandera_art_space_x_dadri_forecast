<script lang="ts">
  import { renderSimpleMarkdown } from '$lib/content/markdown';
  export let data;

  const manifestoHtml = renderSimpleMarkdown(data.manifestoMarkdown);
</script>

<article class="doc-root">
  <div class="doc-card">
    {@html manifestoHtml}
    <p class="download-row">
      <a href={data.site.manifestoDocumentPath} target="_blank" rel="noopener noreferrer">Download manifesto document</a>
    </p>
  </div>
</article>

<style>
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

  @media (max-width: 640px) {
    .doc-card {
      padding: 0.85rem 0;
    }

    .download-row {
      margin-top: 1.1rem;
      padding-top: 0.75rem;
    }
  }
</style>

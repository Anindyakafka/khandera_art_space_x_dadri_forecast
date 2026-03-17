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
    margin: 2.5rem auto;
    padding: 0 1.25rem;
  }

  .doc-card {
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 1rem;
    padding: 1.5rem;
    background: rgba(7, 5, 16, 0.62);
  }

  .doc-card :global(h1),
  .doc-card :global(h2),
  .doc-card :global(h3) {
    letter-spacing: 0.04em;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .doc-card :global(p),
  .doc-card :global(li) {
    line-height: 1.8;
  }

  .download-row {
    margin-top: 1.6rem;
    padding-top: 1rem;
    border-top: 1px dashed rgba(255, 255, 255, 0.25);
  }

  .download-row a {
    font-weight: 700;
  }
</style>

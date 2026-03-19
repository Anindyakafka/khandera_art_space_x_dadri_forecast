<script lang="ts">
  import { renderSimpleMarkdown } from '$lib/content/markdown';
  export let data;

  const aboutHtml = renderSimpleMarkdown(data.aboutMarkdown);
</script>

<article class="about-root">
  <div class="about-card">
    {@html aboutHtml}
    <p class="jump-link">
      <a href="/manifesto">Read full manifesto</a>
    </p>
  </div>
</article>

<style>
  .about-root {
    max-width: 62ch;
    margin: 3rem auto;
    padding: 0 1.25rem;
    color: var(--text);
  }

  .about-card {
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    border-radius: 0;
    padding: 1.25rem 0;
    background: transparent;
  }

  .about-card :global(h1), .about-card :global(h2) {
    margin: 0.9rem 0 0.5rem;
    letter-spacing: 0.04em;
  }

  .about-card :global(p), .about-card :global(li) {
    line-height: 1.8;
    opacity: 0.94;
    color: color-mix(in srgb, var(--text) 90%, transparent);
  }

  .jump-link {
    margin-top: 1.2rem;
  }
</style>
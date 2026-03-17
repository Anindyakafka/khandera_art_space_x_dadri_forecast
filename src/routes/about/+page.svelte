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
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 1rem;
    padding: 1.5rem;
    background: rgba(7, 5, 16, 0.62);
  }

  .about-card :global(h1), .about-card :global(h2) {
    margin: 0.9rem 0 0.5rem;
    letter-spacing: 0.04em;
  }

  .about-card :global(p), .about-card :global(li) {
    line-height: 1.8;
    opacity: 0.93;
  }

  .jump-link {
    margin-top: 1.2rem;
  }
</style>
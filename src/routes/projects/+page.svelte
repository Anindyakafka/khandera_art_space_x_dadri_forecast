<script lang="ts">
  export let data;
</script>

<section class="section">
  <h1>Projects</h1>
  <div class="grid">
    {#each data.projects as project}
      <article class="project-card">
        <h2>{project.title}</h2>
        <p>{project.excerpt}</p>
        <p><strong>{project.year}</strong> • {project.tags.join(', ')}</p>
        {#if project.liveUrl}
          <a class="cta" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Explore</a>
        {/if}
      </article>
    {/each}
  </div>
</section>

<style>
  .section {
    max-width: min(1080px, 94vw);
    margin: clamp(2rem, 4.8vw, 4rem) auto;
  }

  h1 {
    margin-bottom: 0.9rem;
    font-size: clamp(1.6rem, 3vw, 2.5rem);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
  }

  .project-card {
    background: transparent;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    border-radius: 0;
    padding: 1rem;
  }

  .cta {
    display: inline-block;
    margin-top: 0.4rem;
    color: color-mix(in srgb, var(--accent) 84%, var(--text));
    font-weight: 700;
  }
</style>
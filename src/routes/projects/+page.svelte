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
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
  }

  .project-card {
    background: rgba(10, 5, 26, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.8rem;
    padding: 1rem;
  }

  .cta {
    display: inline-block;
    margin-top: 0.4rem;
    color: var(--accent);
    font-weight: 700;
  }
</style>
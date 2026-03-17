<script lang="ts">
  export let data;
</script>

<section class="section">
  <h1>Events</h1>
  <div class="grid">
    {#each data.events as event}
      <article class="event-card">
        <h2>{event.title}</h2>
        <p>{new Date(event.date).toLocaleDateString()}</p>
        <p>{event.location}</p>
        <p>{event.summary}</p>
        {#if event.ctaUrl}
          <a class="cta" href={event.ctaUrl} target="_blank" rel="noopener noreferrer">{event.ctaLabel || 'More'}</a>
        {/if}
      </article>
    {/each}
  </div>
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }

  .event-card {
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
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
  .section {
    max-width: min(1080px, 94vw);
    margin: clamp(1.2rem, 4.2vw, 3.6rem) auto;
  }

  h1 {
    margin-bottom: 0.7rem;
    font-size: clamp(1.45rem, 4.8vw, 2.5rem);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: clamp(0.65rem, 1.8vw, 1rem);
  }

  .event-card {
    background: transparent;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    border-radius: 0;
    padding: clamp(0.72rem, 2.2vw, 1rem);
  }

  .cta {
    display: inline-block;
    margin-top: 0.4rem;
    color: color-mix(in srgb, var(--accent) 84%, var(--text));
    font-weight: 700;
  }

  @media (max-width: 640px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .event-card {
      padding: 0.72rem 0;
    }
  }
</style>
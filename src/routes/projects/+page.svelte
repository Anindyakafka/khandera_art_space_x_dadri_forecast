<script lang="ts">
  export let data;

  function moduleClass(index: number) {
    if (index % 6 === 0) {
      return 'module module-wide';
    }

    if (index % 5 === 0) {
      return 'module module-tall';
    }

    if (index % 4 === 0) {
      return 'module module-feature';
    }

    return 'module';
  }
</script>

<section class="section">
  <header class="projects-head">
    <p class="kicker">Archive Index</p>
    <h1>Projects</h1>
    <p class="lead">An optical ledger of interventions, mapped as modular fragments rather than fixed cards.</p>
  </header>

  <div class="grid" role="list">
    {#each data.projects as project, index}
      <article class={moduleClass(index)} role="listitem">
        <p class="serial">{String(index + 1).padStart(2, '0')}</p>
        <h2>{project.title}</h2>
        <p class="excerpt">{project.excerpt}</p>
        <p class="meta"><strong>{project.year}</strong> · {project.tags.join(' · ')}</p>
        {#if project.liveUrl}
          <a class="cta" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Explore module</a>
        {/if}
      </article>
    {/each}
  </div>
</section>

<style>
  .section {
    max-width: min(1180px, 95vw);
    margin: clamp(1.2rem, 4vw, 3.8rem) auto;
  }

  .projects-head {
    margin-bottom: clamp(1.2rem, 3vw, 2.1rem);
    border-bottom: 1px solid var(--line);
    padding-bottom: 0.8rem;
  }

  .kicker {
    margin: 0 0 0.25rem;
    font-size: 0.75rem;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--muted);
  }

  h1 {
    margin: 0 0 0.5rem;
    font-size: clamp(1.7rem, 4.2vw, 3.4rem);
    letter-spacing: 0.01em;
  }

  .lead {
    margin: 0;
    max-width: 64ch;
    color: color-mix(in srgb, var(--text) 86%, transparent);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 0.8rem;
  }

  .module {
    grid-column: span 4;
    background: transparent;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    border-radius: 0;
    padding: 0.8rem 0.1rem 0.95rem;
    min-height: 12.2rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .module-feature {
    grid-column: span 6;
  }

  .module-wide {
    grid-column: span 8;
  }

  .module-tall {
    grid-column: span 4;
    min-height: 15rem;
  }

  .serial {
    margin: 0 0 0.35rem;
    font-family: 'Fraunces', 'Iowan Old Style', 'Times New Roman', serif;
    font-size: 0.88rem;
    color: var(--muted);
    letter-spacing: 0.09em;
  }

  h2 {
    margin: 0 0 0.45rem;
    font-size: clamp(1.05rem, 1.9vw, 1.65rem);
    line-height: 1.12;
  }

  .excerpt {
    margin: 0 0 0.62rem;
    font-size: 0.95rem;
    line-height: 1.58;
    color: color-mix(in srgb, var(--text) 89%, transparent);
    max-width: 54ch;
  }

  .meta {
    margin: 0;
    font-size: 0.8rem;
    letter-spacing: 0.03em;
    color: var(--muted);
  }

  .cta {
    display: inline-block;
    margin-top: auto;
    padding-top: 0.7rem;
    color: color-mix(in srgb, var(--accent) 84%, var(--text));
    font-weight: 700;
    text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
    width: fit-content;
  }

  @media (max-width: 920px) {
    .grid {
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 0.7rem;
    }

    .module,
    .module-feature,
    .module-tall {
      grid-column: span 3;
      min-height: 12rem;
    }

    .module-wide {
      grid-column: span 6;
      min-height: 13rem;
    }
  }

  @media (max-width: 640px) {
    .section {
      margin: 1rem auto 2.1rem;
      width: min(96vw, 640px);
    }

    .projects-head {
      margin-bottom: 0.9rem;
      padding-bottom: 0.65rem;
    }

    h1 {
      font-size: clamp(1.55rem, 8.8vw, 2.3rem);
    }

    .lead {
      font-size: 0.95rem;
    }

    .grid {
      grid-template-columns: 1fr;
      gap: 0.65rem;
    }

    .module,
    .module-feature,
    .module-wide,
    .module-tall {
      grid-column: span 1;
      min-height: 0;
      padding: 0.72rem 0;
    }

    .serial {
      margin-bottom: 0.2rem;
    }

    h2 {
      font-size: clamp(1.02rem, 5vw, 1.25rem);
    }

    .excerpt {
      font-size: 0.9rem;
    }
  }
</style>
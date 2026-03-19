<script lang="ts">
  import Hero from "$lib/components/Hero.svelte";
  import ProjectCard from "$lib/components/ProjectCard.svelte";
  export let data;
</script>

<main class="layout">
  <Hero title={data.site.heroTitle} subtitle={data.site.heroSubtitle} />

  <section id="projects" class="section">
    <h2>{data.site.home.projectsHeading}</h2>
    <p>{data.site.home.projectsIntro}</p>

    <div class="grid">
      {#each data.projects as project}
        <ProjectCard {project} />
      {/each}
    </div>
  </section>

  <section class="section" id="manifesto">
    <h2>{data.site.home.manifestoHeading}</h2>
    <p>{data.site.home.manifestoExcerpt}</p>
    <a class="secondary" href="/manifesto">{data.site.home.manifestoLinkLabel}</a>
  </section>
</main>

<style>
  .layout {
    color: var(--text);
    min-height: 100vh;
    padding-bottom: 1.5rem;
  }

  .section {
    max-width: min(1080px, 94vw);
    margin: clamp(2.2rem, 5vw, 4.4rem) auto;
    padding: 0 0.2rem;
  }

  .section p {
    max-width: 68ch;
    color: color-mix(in srgb, var(--text) 90%, transparent);
  }

  h2 {
    font-size: clamp(1.4rem, 2.8vw, 2.65rem);
    margin-bottom: 0.8rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.05rem;
    margin-top: 1.3rem;
  }

  #manifesto {
    border: 1px solid var(--line);
    border-radius: 1.2rem;
    background: color-mix(in srgb, var(--surface-solid) 86%, transparent);
    box-shadow: 0 16px 38px -30px var(--shadow);
    padding: clamp(1rem, 3.2vw, 1.5rem);
  }

  .secondary {
    color: color-mix(in srgb, var(--accent) 84%, var(--text));
    font-weight: 700;
    text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
    padding-bottom: 0.12rem;
  }
</style>
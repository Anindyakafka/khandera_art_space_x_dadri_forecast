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
    background: radial-gradient(circle at 15% 20%, #0f0720 0%, #06040d 60%, #020104 100%);
  }

  .section {
    max-width: 72ch;
    margin: 3rem auto;
    padding: 0 1.1rem;
  }

  h2 {
    font-size: clamp(1.35rem, 2.2vw, 2.35rem);
    margin-bottom: 0.8rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
    margin-top: 1.2rem;
  }

  .secondary {
    color: var(--accent);
    font-weight: 700;
    text-decoration: underline;
  }
</style>
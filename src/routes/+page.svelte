<script lang="ts">
  import Hero from "$lib/components/Hero.svelte";
  import ProjectCard from "$lib/components/ProjectCard.svelte";
  import { projects } from "$lib/data/content";
</script>

<main class="layout">
  <Hero title="Khandera Art Space" subtitle="Radical art as spatial insurgency and collective ritual." />

  <section id="projects" class="section">
    <h2>Current Radical Projects</h2>
    <p>Each project is a volatile intervention — a snapshot from our ongoing anti-institutional archive.</p>

    <div class="grid">
      {#each projects as project}
        <ProjectCard {project} />
      {/each}
    </div>
  </section>

  <section class="section" id="manifesto">
    <h2>Manifesto</h2>
    <p>
      We are not a gallery. We are a catalyst. We gather in ruins of matter and signal with ephemeral code that refuses the status quo.
      This website is a radical canvas: deep purple, noise, and generative forms that hint at chaos while anchored in intention.
    </p>
    <a class="secondary" href="/about">Read the full intent</a>
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
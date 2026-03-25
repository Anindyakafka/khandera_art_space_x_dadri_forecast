<script lang="ts">
  import Hero from "$lib/components/Hero.svelte";
  export let data;
</script>

<main class="layout">
  <section class="hero-stage">
    <Hero title={data.site.heroTitle} subtitle={data.site.heroSubtitle} />
  </section>

  <section class="section" id="manifesto">
    <h2>{data.site.home.manifestoHeading}</h2>
    <p>{data.site.home.manifestoExcerpt}</p>
    <a class="secondary" href="/dadri-forecast">{data.site.home.manifestoLinkLabel}</a>
  </section>
</main>

<style>
  .layout {
    color: var(--text);
    min-height: 100vh;
    padding-bottom: clamp(1.4rem, 3.8vw, 2.6rem);
  }

  .hero-stage {
    min-height: calc(100svh - 7rem);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
  }

  .section {
    max-width: min(1080px, 95vw);
    margin: clamp(1.4rem, 5vw, 4rem) auto;
    padding: 0 0.3rem;
  }

  .section + .section {
    border-top: 1px solid var(--line);
    padding-top: 1.5rem;
  }

  .section p {
    max-width: 68ch;
    color: color-mix(in srgb, var(--text) 90%, transparent);
  }

  h2 {
    font-size: clamp(1.25rem, 3.1vw, 2.4rem);
    margin-bottom: 0.65rem;
  }

  .secondary {
    color: color-mix(in srgb, var(--accent) 84%, var(--text));
    font-weight: 700;
    text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
    padding-bottom: 0.12rem;
  }

  @media (max-width: 640px) {
    .hero-stage {
      min-height: calc(100svh - 6.2rem);
    }

    .section {
      margin: 1rem auto 2rem;
    }

    h2 {
      font-size: clamp(1.2rem, 7vw, 1.7rem);
      margin-bottom: 0.5rem;
    }

    .section p {
      font-size: 0.95rem;
    }

  }
</style>
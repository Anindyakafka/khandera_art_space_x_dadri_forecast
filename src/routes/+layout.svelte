<script lang="ts">
  // no client data used here, prerender is handled in +layout.server.ts
  import '../app.css';
  import BirdFollower from '$lib/components/BirdFollower.svelte';

  let brandLink: HTMLAnchorElement | undefined;
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Khandera Art Space</title>
</svelte:head>

<BirdFollower perchTarget={brandLink} />

<header class="site-header">
  <a class="brand" href="/" bind:this={brandLink}>Khandera Art Space</a>
  <nav aria-label="Main navigation">
    <a href="/about">About</a>
    <a href="/manifesto">Manifesto</a>
    <a href="/artists">Artists</a>
    <a href="/projects">Projects</a>
    <a href="/events">Events</a>
  </nav>
</header>

<slot />

<style>
  :global(body) {
    margin: 0;
  }

  .site-header {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    min-height: 4.7rem;
    padding: 1.15rem 1.35rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(4, 3, 9, 0.72);
    backdrop-filter: blur(8px);
    overflow: visible;
  }

  .brand {
    font-weight: 800;
    font-size: 1.08rem;
    line-height: 1.15;
    text-decoration: none;
    letter-spacing: 0.04em;
    color: var(--text);
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  nav a {
    color: var(--text);
    opacity: 0.88;
    text-decoration: none;
    font-size: 0.95rem;
  }

  nav a:hover {
    opacity: 1;
    text-decoration: underline;
  }
</style>

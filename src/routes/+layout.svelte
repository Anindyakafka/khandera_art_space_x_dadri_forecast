<script lang="ts">
  // no client data used here, prerender is handled in +layout.server.ts
  import '../app.css';
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Khandera Art Space</title>
</svelte:head>

<header class="site-header">
  <a class="brand" href="/">Khandera Art Space</a>
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
  .site-header {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem 1.2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(4, 3, 9, 0.72);
    backdrop-filter: blur(8px);
  }

  .brand {
    font-weight: 800;
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

<script lang="ts">
  // no client data used here, prerender is handled in +layout.server.ts
  import { onMount } from 'svelte';
  import '../app.css';
  import BirdFollower from '$lib/components/BirdFollower.svelte';

  let brandLink: HTMLAnchorElement | undefined;
  const themeOptions = [
    { id: 'meadow', label: 'Meadow' },
    { id: 'sunset', label: 'Sunset' },
    { id: 'lagoon', label: 'Lagoon' }
  ];
  let activeTheme = themeOptions[0].id;

  function applyTheme(theme: string) {
    activeTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('khandera-theme', theme);
  }

  onMount(() => {
    const storedTheme = localStorage.getItem('khandera-theme');
    const validStoredTheme = themeOptions.some((option) => option.id === storedTheme);
    const defaultTheme = validStoredTheme && storedTheme ? storedTheme : themeOptions[0].id;
    applyTheme(defaultTheme);
  });
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Khandera Art Space</title>
</svelte:head>

<BirdFollower perchTarget={brandLink} />

<div class="atmosphere" aria-hidden="true">
  <span class="shadow-layer clusters far"></span>
  <span class="shadow-layer branches mid"></span>
  <span class="shadow-layer clusters near"></span>
  <span class="shadow-layer clusters near-detail"></span>
</div>

<header class="site-header">
  <div class="brand-row">
    <a class="brand" href="/" bind:this={brandLink}>Khandera Art Space</a>
    <p class="brand-subtitle">Dadri Forecast Residency</p>
  </div>
  <div class="header-controls">
    <nav aria-label="Main navigation">
      <a href="/about">About</a>
      <a href="/manifesto">Manifesto</a>
      <a href="/artists">Artists</a>
      <a href="/projects">Projects</a>
      <a href="/events">Events</a>
    </nav>
    <div class="theme-picker" role="group" aria-label="Select color palette">
      {#each themeOptions as option}
        <button
          type="button"
          class:active={activeTheme === option.id}
          on:click={() => applyTheme(option.id)}
          aria-pressed={activeTheme === option.id}
        >
          {option.label}
        </button>
      {/each}
    </div>
  </div>
</header>

<div class="page-shell">
  <slot />
</div>

<style>
  :global(body) {
    margin: 0;
  }

  .atmosphere {
    position: fixed;
    inset: -14vh -10vw;
    pointer-events: none;
    z-index: 26;
    overflow: hidden;
    transform-origin: 50% 30%;
    animation: canopy-drift 9s ease-in-out infinite alternate;
  }

  .shadow-layer {
    position: absolute;
    inset: -6vh -6vw;
    transform-origin: 50% 35%;
    background-repeat: repeat;
    background-position: center;
    background-size: 1450px auto;
    mix-blend-mode: multiply;
    will-change: transform;
  }

  .clusters {
    background-image: url('/media/images/overlays/leaf-shadow-cluster.svg');
  }

  .branches {
    background-image: url('/media/images/overlays/leaf-shadow-branches.svg');
    background-size: 1700px auto;
  }

  .shadow-layer.far {
    opacity: 0.14;
    filter: blur(11px);
    transform: rotate(-4deg) scale(1.12);
    animation: branch-sway-far 18s ease-in-out infinite;
  }

  .shadow-layer.mid {
    opacity: 0.16;
    filter: blur(6.5px);
    transform: rotate(3deg) scale(1.08);
    animation: branch-sway-mid 14s ease-in-out infinite;
  }

  .shadow-layer.near {
    opacity: 0.23;
    filter: blur(2.2px);
    transform: rotate(-6deg) scale(1.03);
    animation: branch-sway-near 10.5s ease-in-out infinite;
  }

  .shadow-layer.near-detail {
    opacity: 0.28;
    filter: blur(0.85px);
    transform: rotate(8deg) scale(0.96);
    background-size: 1120px auto;
    animation: branch-sway-detail 8.8s ease-in-out infinite;
  }

  .site-header {
    position: sticky;
    top: 0;
    z-index: 30;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.3rem;
    min-height: 5rem;
    padding: 1rem clamp(1rem, 2.4vw, 2rem);
    border-bottom: 1px solid var(--line);
    background: color-mix(in srgb, var(--surface) 92%, transparent);
    backdrop-filter: blur(9px);
    overflow: visible;
  }

  .brand-row {
    display: grid;
    align-items: end;
    gap: 0.2rem;
  }

  .brand {
    font-family: 'Fraunces', 'Iowan Old Style', 'Times New Roman', serif;
    font-weight: 700;
    font-size: clamp(1.03rem, 2.1vw, 1.35rem);
    line-height: 1.15;
    text-decoration: none;
    letter-spacing: 0.02em;
    color: var(--text);
  }

  .brand-subtitle {
    margin: 0;
    font-size: 0.78rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.48rem;
  }

  nav a {
    color: color-mix(in srgb, var(--text) 92%, transparent);
    text-decoration: none;
    font-size: 0.88rem;
    border: 1px solid transparent;
    border-radius: 999px;
    padding: 0.35rem 0.7rem;
    background: transparent;
  }

  nav a:hover {
    border-color: color-mix(in srgb, var(--line) 88%, transparent);
    background: color-mix(in srgb, var(--surface-solid) 65%, transparent);
  }

  .theme-picker {
    display: inline-flex;
    align-items: center;
    gap: 0.38rem;
    padding: 0.32rem;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--surface-solid) 68%, transparent);
  }

  .theme-picker button {
    border: none;
    border-radius: 999px;
    padding: 0.35rem 0.65rem;
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
  }

  .theme-picker button:hover {
    color: var(--text);
    background: color-mix(in srgb, var(--surface-solid) 85%, transparent);
  }

  .theme-picker button.active {
    color: var(--text-inverse);
    background: color-mix(in srgb, var(--accent) 82%, black 8%);
  }

  .page-shell {
    position: relative;
    z-index: 1;
  }

  @keyframes branch-sway-far {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(-4deg) scale(1.12);
    }

    40% {
      transform: translate3d(18px, -12px, 0) rotate(-1.5deg) scale(1.14);
    }

    72% {
      transform: translate3d(-14px, 8px, 0) rotate(-6deg) scale(1.1);
    }
  }

  @keyframes branch-sway-mid {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(3deg) scale(1.08);
    }

    35% {
      transform: translate3d(-24px, 14px, 0) rotate(6deg) scale(1.1);
    }

    70% {
      transform: translate3d(20px, -12px, 0) rotate(1deg) scale(1.06);
    }
  }

  @keyframes branch-sway-near {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(-6deg) scale(1.03);
    }

    28% {
      transform: translate3d(30px, -18px, 0) rotate(-2deg) scale(1.06);
    }

    58% {
      transform: translate3d(-26px, 16px, 0) rotate(-9deg) scale(1.01);
    }

    82% {
      transform: translate3d(14px, -9px, 0) rotate(-4deg) scale(1.04);
    }
  }

  @keyframes branch-sway-detail {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(8deg) scale(0.96);
    }

    30% {
      transform: translate3d(-16px, 10px, 0) rotate(10.5deg) scale(0.99);
    }

    62% {
      transform: translate3d(22px, -14px, 0) rotate(5deg) scale(0.94);
    }
  }

  @keyframes canopy-drift {
    0%,
    100% {
      transform: translate3d(0, 0, 0);
    }

    50% {
      transform: translate3d(0, -8px, 0);
    }
  }

  @media (max-width: 900px) {
    .site-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .header-controls {
      width: 100%;
      justify-content: space-between;
    }

    nav {
      gap: 0.35rem;
    }

    nav a {
      padding: 0.3rem 0.62rem;
      font-size: 0.83rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .atmosphere {
      animation: none;
      inset: -8vh -6vw;
    }

    .shadow-layer {
      animation: none;
      opacity: 0.14;
      filter: blur(5px);
    }

    .shadow-layer.near,
    .shadow-layer.near-detail {
      opacity: 0.16;
      filter: blur(2px);
    }
  }
</style>

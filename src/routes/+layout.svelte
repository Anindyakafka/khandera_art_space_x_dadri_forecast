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
  <span class="shadow-layer branch far"></span>
  <span class="shadow-layer branch mid"></span>
  <span class="shadow-layer branch near"></span>
  <span class="shadow-layer branch near-detail"></span>
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
    animation: canopy-drift 14s ease-in-out infinite alternate;
  }

  .shadow-layer {
    --tile-size: 1450px auto;
    --bg-pos: center;
    position: absolute;
    inset: -6vh -6vw;
    transform-origin: 50% 35%;
    background-repeat: repeat;
    background-position: var(--bg-pos);
    background-size: var(--tile-size);
    mix-blend-mode: multiply;
    will-change: transform;
  }

  .branch {
    background-image: url('/media/images/overlays/overlay_branch.svg');
  }

  .shadow-layer.far {
    --tile-size: 2380px auto;
    --bg-pos: 10% 18%;
    opacity: 0.1;
    filter: blur(14px);
    transform: rotate(-4deg) scale(1.12);
    animation: branch-sway-far 24s ease-in-out infinite;
  }

  .shadow-layer.mid {
    --tile-size: 1860px auto;
    --bg-pos: 60% 32%;
    opacity: 0.12;
    filter: blur(8px);
    transform: rotate(3deg) scale(1.08);
    animation: branch-sway-mid 19s ease-in-out infinite;
  }

  .shadow-layer.near {
    --tile-size: 1420px auto;
    --bg-pos: 26% 56%;
    opacity: 0.29;
    filter: blur(1.9px);
    transform: rotate(-6deg) scale(1.03);
    animation: branch-sway-near 9s ease-in-out infinite;
  }

  .shadow-layer.near-detail {
    --tile-size: 1080px auto;
    --bg-pos: 78% 72%;
    opacity: 0.36;
    filter: blur(0.55px);
    transform: rotate(8deg) scale(0.96);
    animation: branch-sway-detail 7.4s ease-in-out infinite;
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
      transform: translate3d(10px, -7px, 0) rotate(-2.4deg) scale(1.125);
    }

    72% {
      transform: translate3d(-9px, 6px, 0) rotate(-5.1deg) scale(1.11);
    }
  }

  @keyframes branch-sway-mid {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(3deg) scale(1.08);
    }

    35% {
      transform: translate3d(-15px, 9px, 0) rotate(4.6deg) scale(1.095);
    }

    70% {
      transform: translate3d(13px, -8px, 0) rotate(1.8deg) scale(1.07);
    }
  }

  @keyframes branch-sway-near {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(-6deg) scale(1.03);
    }

    24% {
      transform: translate3d(42px, -24px, 0) rotate(-0.4deg) scale(1.07);
    }

    54% {
      transform: translate3d(-36px, 22px, 0) rotate(-10.5deg) scale(1.005);
    }

    80% {
      transform: translate3d(20px, -13px, 0) rotate(-3.2deg) scale(1.045);
    }
  }

  @keyframes branch-sway-detail {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(8deg) scale(0.96);
    }

    28% {
      transform: translate3d(-28px, 16px, 0) rotate(12.2deg) scale(1.01);
    }

    60% {
      transform: translate3d(30px, -18px, 0) rotate(3.2deg) scale(0.93);
    }

    86% {
      transform: translate3d(-12px, 8px, 0) rotate(9deg) scale(0.97);
    }
  }

  @keyframes canopy-drift {
    0%,
    100% {
      transform: translate3d(0, 0, 0);
    }

    50% {
      transform: translate3d(0, -4px, 0);
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

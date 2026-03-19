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
  <span class="leaf leaf-a"></span>
  <span class="leaf leaf-b"></span>
  <span class="leaf leaf-c"></span>
  <span class="leaf leaf-d"></span>
  <span class="leaf leaf-e"></span>
  <span class="leaf leaf-f"></span>
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
    inset: 0;
    pointer-events: none;
    z-index: 34;
    overflow: hidden;
    animation: canopy-drift 12s ease-in-out infinite alternate;
  }

  .leaf {
    --base-rotate: 0deg;
    --base-scale: 1;
    --leaf-opacity: 0.22;
    --leaf-blur: 4px;
    --drift-x: 46px;
    --drift-y: -26px;
    --drift-rotate: 2.4deg;
    position: absolute;
    width: clamp(560px, 72vw, 1240px);
    aspect-ratio: 1.35 / 1;
    background:
      radial-gradient(ellipse 4.4% 2.7% at 6% 12%, color-mix(in srgb, var(--text) 54%, transparent) 0 62%, transparent 71%),
      radial-gradient(ellipse 3.8% 2.3% at 11% 21%, color-mix(in srgb, var(--text) 46%, transparent) 0 61%, transparent 70%),
      radial-gradient(ellipse 4.6% 2.6% at 18% 15%, color-mix(in srgb, var(--text) 56%, transparent) 0 62%, transparent 71%),
      radial-gradient(ellipse 4.2% 2.4% at 24% 25%, color-mix(in srgb, var(--text) 47%, transparent) 0 61%, transparent 70%),
      radial-gradient(ellipse 4.8% 2.7% at 31% 14%, color-mix(in srgb, var(--text) 55%, transparent) 0 62%, transparent 71%),
      radial-gradient(ellipse 4.1% 2.3% at 38% 24%, color-mix(in srgb, var(--text) 46%, transparent) 0 61%, transparent 70%),
      radial-gradient(ellipse 5% 2.8% at 46% 16%, color-mix(in srgb, var(--text) 54%, transparent) 0 62%, transparent 71%),
      radial-gradient(ellipse 4.2% 2.4% at 53% 27%, color-mix(in srgb, var(--text) 45%, transparent) 0 61%, transparent 70%),
      radial-gradient(ellipse 4.7% 2.7% at 61% 15%, color-mix(in srgb, var(--text) 55%, transparent) 0 62%, transparent 71%),
      radial-gradient(ellipse 4.1% 2.3% at 68% 25%, color-mix(in srgb, var(--text) 46%, transparent) 0 61%, transparent 70%),
      radial-gradient(ellipse 4.8% 2.8% at 76% 15%, color-mix(in srgb, var(--text) 56%, transparent) 0 62%, transparent 71%),
      radial-gradient(ellipse 4.2% 2.4% at 83% 26%, color-mix(in srgb, var(--text) 45%, transparent) 0 61%, transparent 70%),
      radial-gradient(ellipse 4.4% 2.5% at 90% 16%, color-mix(in srgb, var(--text) 52%, transparent) 0 62%, transparent 71%),
      radial-gradient(ellipse 3.6% 2.2% at 14% 47%, color-mix(in srgb, var(--text) 43%, transparent) 0 60%, transparent 69%),
      radial-gradient(ellipse 4.2% 2.5% at 27% 61%, color-mix(in srgb, var(--text) 39%, transparent) 0 60%, transparent 69%),
      radial-gradient(ellipse 3.8% 2.3% at 41% 51%, color-mix(in srgb, var(--text) 44%, transparent) 0 60%, transparent 69%),
      radial-gradient(ellipse 4.4% 2.5% at 57% 64%, color-mix(in srgb, var(--text) 38%, transparent) 0 60%, transparent 69%),
      radial-gradient(ellipse 3.9% 2.3% at 72% 52%, color-mix(in srgb, var(--text) 44%, transparent) 0 60%, transparent 69%),
      radial-gradient(ellipse 4.3% 2.5% at 86% 64%, color-mix(in srgb, var(--text) 39%, transparent) 0 60%, transparent 69%),
      linear-gradient(122deg, transparent 18%, color-mix(in srgb, var(--text) 26%, transparent) 29% 30.2%, transparent 33%),
      linear-gradient(114deg, transparent 38%, color-mix(in srgb, var(--text) 22%, transparent) 50.5% 51.5%, transparent 56%),
      linear-gradient(131deg, transparent 64%, color-mix(in srgb, var(--text) 20%, transparent) 74% 75.1%, transparent 79%),
      linear-gradient(120deg, transparent 9%, color-mix(in srgb, var(--text) 18%, transparent) 16.8% 17.6%, transparent 21.5%);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    filter: blur(var(--leaf-blur));
    opacity: var(--leaf-opacity);
    mix-blend-mode: multiply;
    transform-origin: 50% 50%;
    will-change: transform;
    animation: leaf-drift 20s ease-in-out infinite;
  }

  .leaf-a {
    --base-rotate: -8deg;
    --base-scale: 0.96;
    --leaf-opacity: 0.28;
    --leaf-blur: 1.25px;
    --drift-x: 62px;
    --drift-y: -34px;
    --drift-rotate: 3.2deg;
    left: -22vw;
    top: -18vh;
  }

  .leaf-b {
    --base-rotate: 6deg;
    --base-scale: 1.06;
    --leaf-opacity: 0.22;
    --leaf-blur: 3.9px;
    --drift-x: -48px;
    --drift-y: -26px;
    --drift-rotate: 2.2deg;
    right: -24vw;
    top: -14vh;
    width: clamp(620px, 76vw, 1320px);
    animation-duration: 18s;
    animation-delay: -11s;
  }

  .leaf-c {
    --base-rotate: -3deg;
    --base-scale: 1.02;
    --leaf-opacity: 0.15;
    --leaf-blur: 9.5px;
    --drift-x: 36px;
    --drift-y: -18px;
    --drift-rotate: 1.6deg;
    left: -8vw;
    top: 25vh;
    width: clamp(560px, 68vw, 1160px);
    animation-duration: 22s;
    animation-delay: -15s;
  }

  .leaf-d {
    --base-rotate: 10deg;
    --base-scale: 1.04;
    --leaf-opacity: 0.27;
    --leaf-blur: 1.6px;
    --drift-x: -58px;
    --drift-y: 28px;
    --drift-rotate: 3deg;
    right: -22vw;
    bottom: -7vh;
    width: clamp(640px, 78vw, 1360px);
    animation-duration: 16.5s;
    animation-delay: -8s;
  }

  .leaf-e {
    --base-rotate: -11deg;
    --base-scale: 1.12;
    --leaf-opacity: 0.13;
    --leaf-blur: 12px;
    --drift-x: 28px;
    --drift-y: -14px;
    --drift-rotate: 1.3deg;
    left: -28vw;
    bottom: -25vh;
    width: clamp(680px, 82vw, 1420px);
    animation-duration: 26s;
    animation-delay: -21s;
  }

  .leaf-f {
    --base-rotate: 5deg;
    --base-scale: 0.93;
    --leaf-opacity: 0.19;
    --leaf-blur: 5.5px;
    --drift-x: -42px;
    --drift-y: 24px;
    --drift-rotate: 2deg;
    right: -4vw;
    top: 55vh;
    width: clamp(500px, 64vw, 1140px);
    animation-duration: 21s;
    animation-delay: -13s;
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

  @keyframes leaf-drift {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(var(--base-rotate)) scale(var(--base-scale));
    }

    33% {
      transform: translate3d(var(--drift-x), var(--drift-y), 0) rotate(calc(var(--base-rotate) + var(--drift-rotate))) scale(calc(var(--base-scale) + 0.02));
    }

    66% {
      transform: translate3d(calc(var(--drift-x) * -0.62), calc(var(--drift-y) * -0.58), 0) rotate(calc(var(--base-rotate) - var(--drift-rotate))) scale(calc(var(--base-scale) - 0.02));
    }
  }

  @keyframes canopy-drift {
    0% {
      transform: translate3d(0, 0, 0);
    }

    100% {
      transform: translate3d(0, -6px, 0);
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
    }

    .leaf {
      animation: none;
      opacity: 0.16;
    }
  }
</style>

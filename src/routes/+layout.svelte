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
  }

  .leaf {
    --base-rotate: 0deg;
    --base-scale: 1;
    --leaf-opacity: 0.24;
    position: absolute;
    width: clamp(560px, 72vw, 1240px);
    aspect-ratio: 1.35 / 1;
    background:
      radial-gradient(ellipse 7% 3.6% at 6% 13%, color-mix(in srgb, var(--text) 42%, transparent) 0 56%, transparent 64%),
      radial-gradient(ellipse 8% 3.8% at 14% 24%, color-mix(in srgb, var(--text) 39%, transparent) 0 57%, transparent 65%),
      radial-gradient(ellipse 7.2% 3.5% at 23% 16%, color-mix(in srgb, var(--text) 44%, transparent) 0 56%, transparent 64%),
      radial-gradient(ellipse 8.2% 3.8% at 31% 28%, color-mix(in srgb, var(--text) 40%, transparent) 0 57%, transparent 65%),
      radial-gradient(ellipse 7.5% 3.6% at 40% 12%, color-mix(in srgb, var(--text) 43%, transparent) 0 56%, transparent 64%),
      radial-gradient(ellipse 8.4% 3.9% at 49% 25%, color-mix(in srgb, var(--text) 38%, transparent) 0 57%, transparent 65%),
      radial-gradient(ellipse 7.6% 3.5% at 57% 15%, color-mix(in srgb, var(--text) 44%, transparent) 0 56%, transparent 64%),
      radial-gradient(ellipse 8.5% 3.9% at 66% 28%, color-mix(in srgb, var(--text) 40%, transparent) 0 57%, transparent 65%),
      radial-gradient(ellipse 7.2% 3.4% at 75% 14%, color-mix(in srgb, var(--text) 45%, transparent) 0 56%, transparent 64%),
      radial-gradient(ellipse 8.3% 3.9% at 84% 27%, color-mix(in srgb, var(--text) 39%, transparent) 0 57%, transparent 65%),
      radial-gradient(ellipse 7.4% 3.4% at 93% 16%, color-mix(in srgb, var(--text) 42%, transparent) 0 56%, transparent 64%),
      radial-gradient(ellipse 7.8% 3.7% at 12% 46%, color-mix(in srgb, var(--text) 40%, transparent) 0 57%, transparent 65%),
      radial-gradient(ellipse 8.6% 3.9% at 24% 61%, color-mix(in srgb, var(--text) 37%, transparent) 0 57%, transparent 65%),
      radial-gradient(ellipse 7.5% 3.5% at 38% 50%, color-mix(in srgb, var(--text) 42%, transparent) 0 56%, transparent 64%),
      radial-gradient(ellipse 8.7% 4% at 52% 63%, color-mix(in srgb, var(--text) 38%, transparent) 0 57%, transparent 65%),
      radial-gradient(ellipse 7.4% 3.5% at 67% 49%, color-mix(in srgb, var(--text) 41%, transparent) 0 56%, transparent 64%),
      radial-gradient(ellipse 8.5% 3.9% at 81% 62%, color-mix(in srgb, var(--text) 37%, transparent) 0 57%, transparent 65%),
      radial-gradient(ellipse 7.2% 3.4% at 92% 50%, color-mix(in srgb, var(--text) 40%, transparent) 0 56%, transparent 64%),
      linear-gradient(126deg, transparent 16%, color-mix(in srgb, var(--text) 23%, transparent) 30% 32%, transparent 36%),
      linear-gradient(116deg, transparent 41%, color-mix(in srgb, var(--text) 20%, transparent) 53% 55%, transparent 60%),
      linear-gradient(132deg, transparent 66%, color-mix(in srgb, var(--text) 17%, transparent) 74% 76%, transparent 80%);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    filter: blur(6px);
    opacity: var(--leaf-opacity);
    mix-blend-mode: multiply;
    transform-origin: 50% 50%;
    will-change: transform;
    animation: leaf-drift 34s ease-in-out infinite;
  }

  .leaf-a {
    --base-rotate: -8deg;
    --base-scale: 1.02;
    --leaf-opacity: 0.2;
    left: -24vw;
    top: -20vh;
  }

  .leaf-b {
    --base-rotate: 7deg;
    --base-scale: 1.07;
    --leaf-opacity: 0.23;
    right: -26vw;
    top: -14vh;
    width: clamp(620px, 76vw, 1320px);
    animation-duration: 38s;
    animation-delay: -11s;
  }

  .leaf-c {
    --base-rotate: -4deg;
    --base-scale: 0.98;
    --leaf-opacity: 0.21;
    left: -8vw;
    top: 25vh;
    width: clamp(560px, 68vw, 1160px);
    animation-duration: 31s;
    animation-delay: -15s;
  }

  .leaf-d {
    --base-rotate: 8deg;
    --base-scale: 1.05;
    --leaf-opacity: 0.22;
    right: -22vw;
    bottom: -7vh;
    width: clamp(640px, 78vw, 1360px);
    animation-duration: 39s;
    animation-delay: -8s;
  }

  .leaf-e {
    --base-rotate: -11deg;
    --base-scale: 1.1;
    --leaf-opacity: 0.2;
    left: -28vw;
    bottom: -25vh;
    width: clamp(680px, 82vw, 1420px);
    animation-duration: 42s;
    animation-delay: -21s;
  }

  .leaf-f {
    --base-rotate: 5deg;
    --base-scale: 0.95;
    --leaf-opacity: 0.18;
    right: -4vw;
    top: 55vh;
    width: clamp(500px, 64vw, 1140px);
    animation-duration: 33s;
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
      transform: translate3d(24px, -14px, 0) rotate(calc(var(--base-rotate) + 1.8deg)) scale(calc(var(--base-scale) + 0.02));
    }

    66% {
      transform: translate3d(-18px, 12px, 0) rotate(calc(var(--base-rotate) - 1.5deg)) scale(calc(var(--base-scale) - 0.02));
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
    .leaf {
      animation: none;
      opacity: 0.18;
    }
  }
</style>

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
    position: absolute;
    width: clamp(460px, 58vw, 920px);
    aspect-ratio: 1.35 / 1;
    background:
      radial-gradient(ellipse 17% 9% at 8% 17%, color-mix(in srgb, var(--text) 38%, transparent) 0 58%, transparent 64%),
      radial-gradient(ellipse 16% 8% at 18% 31%, color-mix(in srgb, var(--text) 35%, transparent) 0 59%, transparent 65%),
      radial-gradient(ellipse 14% 8% at 30% 14%, color-mix(in srgb, var(--text) 36%, transparent) 0 60%, transparent 66%),
      radial-gradient(ellipse 16% 8% at 37% 34%, color-mix(in srgb, var(--text) 34%, transparent) 0 58%, transparent 65%),
      radial-gradient(ellipse 15% 9% at 48% 18%, color-mix(in srgb, var(--text) 37%, transparent) 0 58%, transparent 64%),
      radial-gradient(ellipse 18% 9% at 58% 36%, color-mix(in srgb, var(--text) 33%, transparent) 0 60%, transparent 66%),
      radial-gradient(ellipse 15% 8% at 69% 17%, color-mix(in srgb, var(--text) 36%, transparent) 0 58%, transparent 64%),
      radial-gradient(ellipse 16% 8% at 81% 33%, color-mix(in srgb, var(--text) 35%, transparent) 0 57%, transparent 64%),
      radial-gradient(ellipse 13% 8% at 92% 19%, color-mix(in srgb, var(--text) 32%, transparent) 0 59%, transparent 65%),
      linear-gradient(128deg, transparent 12%, color-mix(in srgb, var(--text) 20%, transparent) 35%, transparent 38%),
      linear-gradient(116deg, transparent 45%, color-mix(in srgb, var(--text) 18%, transparent) 52%, transparent 55%);
    filter: blur(3px);
    opacity: 0.32;
    mix-blend-mode: multiply;
    transform-origin: 50% 50%;
    animation: leaf-drift 32s ease-in-out infinite;
  }

  .leaf-a {
    left: -18vw;
    top: -12vh;
  }

  .leaf-b {
    right: -15vw;
    top: -7vh;
    width: clamp(520px, 60vw, 980px);
    animation-duration: 34s;
    animation-delay: -9s;
  }

  .leaf-c {
    left: 10vw;
    top: 22vh;
    width: clamp(470px, 56vw, 920px);
    animation-duration: 29s;
    animation-delay: -14s;
  }

  .leaf-d {
    right: -10vw;
    bottom: 3vh;
    width: clamp(520px, 63vw, 1020px);
    animation-duration: 35s;
    animation-delay: -6s;
  }

  .leaf-e {
    left: -12vw;
    bottom: -18vh;
    width: clamp(520px, 64vw, 1060px);
    animation-duration: 37s;
    animation-delay: -19s;
  }

  .leaf-f {
    right: 2vw;
    top: 52vh;
    width: clamp(460px, 54vw, 860px);
    animation-duration: 31s;
    animation-delay: -12s;
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
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
    }

    33% {
      transform: translate3d(30px, -18px, 0) rotate(2.4deg) scale(1.03);
    }

    66% {
      transform: translate3d(-22px, 16px, 0) rotate(-1.7deg) scale(0.98);
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
      opacity: 0.28;
    }
  }
</style>

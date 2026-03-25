<script lang="ts">
  // no client data used here, prerender is handled in +layout.server.ts
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import '../app.css';
  import BirdFollower from '$lib/components/BirdFollower.svelte';

  let brandLink: HTMLAnchorElement | undefined;
  const themeOptions = [
    { id: 'meadow', label: 'Meadow', tone: '#b56a4f' },
    { id: 'sunset', label: 'Sunset', tone: '#be4f4a' },
    { id: 'lagoon', label: 'Lagoon', tone: '#2f8d92' }
  ];
  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/dadri-forecast', label: 'Dadri Forecast' },
    { href: '/artists', label: 'Artists' },
    { href: '/projects', label: 'Projects' },
    { href: '/events', label: 'Events' }
  ];
  let activeTheme = themeOptions[0].id;
  let mobileMenuOpen = false;

  function isCurrentRoute(href: string, pathname: string) {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function applyTheme(theme: string) {
    activeTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('khandera-theme', theme);
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  $: if ($page.url.pathname) {
    mobileMenuOpen = false;
  }

  onMount(() => {
    const storedTheme = localStorage.getItem('khandera-theme');
    const validStoredTheme = themeOptions.some((option) => option.id === storedTheme);
    const defaultTheme = validStoredTheme && storedTheme ? storedTheme : themeOptions[0].id;
    applyTheme(defaultTheme);

    const mediaQuery = window.matchMedia('(min-width: 901px)');
    const closeMenuOnDesktop = () => {
      if (mediaQuery.matches) {
        mobileMenuOpen = false;
      }
    };

    mediaQuery.addEventListener('change', closeMenuOnDesktop);

    closeMenuOnDesktop();

    return () => {
      mediaQuery.removeEventListener('change', closeMenuOnDesktop);
    };
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
    <button
      type="button"
      class="menu-toggle"
      aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
      aria-controls="main-nav"
      aria-expanded={mobileMenuOpen}
      on:click={toggleMobileMenu}
    >
      <span class="menu-toggle-icon" aria-hidden="true"></span>
      <span class="sr-only">Menu</span>
    </button>
    <div class="brand-stack">
      <a class="brand" href="/" bind:this={brandLink}>Khandera Art Space</a>
      <p class="brand-subtitle">Dadri Forecast Residency</p>
    </div>
    <div class="theme-picker mobile-theme-picker" role="group" aria-label="Select color palette">
      {#each themeOptions as option}
        <button
          type="button"
          class:active={activeTheme === option.id}
          on:click={() => applyTheme(option.id)}
          aria-pressed={activeTheme === option.id}
          aria-label={`Activate ${option.label} theme`}
          title={option.label}
        >
          <span class="swatch" style={`--swatch-tone: ${option.tone};`} aria-hidden="true"></span>
          <span class="sr-only">{option.label}</span>
        </button>
      {/each}
    </div>
  </div>
  <div class="header-controls">
    <nav id="main-nav" aria-label="Main navigation" class:open={mobileMenuOpen}>
      {#each navLinks as link}
        <a
          href={link.href}
          class:current={isCurrentRoute(link.href, $page.url.pathname)}
          aria-current={isCurrentRoute(link.href, $page.url.pathname) ? 'page' : undefined}
        >
          {link.label}
        </a>
      {/each}
    </nav>
    <div class="theme-picker desktop-theme-picker" role="group" aria-label="Select color palette">
      {#each themeOptions as option}
        <button
          type="button"
          class:active={activeTheme === option.id}
          on:click={() => applyTheme(option.id)}
          aria-pressed={activeTheme === option.id}
          aria-label={`Activate ${option.label} theme`}
          title={option.label}
        >
          <span class="swatch" style={`--swatch-tone: ${option.tone};`} aria-hidden="true"></span>
          <span class="sr-only">{option.label}</span>
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
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    min-width: 0;
  }

  .brand-stack {
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

  .menu-toggle {
    display: none;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: color-mix(in srgb, var(--surface-solid) 72%, transparent);
    color: var(--text);
    padding: 0.38rem;
    width: 2.05rem;
    height: 2.05rem;
    font-weight: 700;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .menu-toggle-icon {
    width: 0.88rem;
    height: 0.68rem;
    display: inline-block;
    position: relative;
    border-top: 1.8px solid currentColor;
    border-bottom: 1.8px solid currentColor;
  }

  .menu-toggle-icon::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 45%;
    border-top: 1.8px solid currentColor;
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.48rem;
  }

  nav a {
    color: color-mix(in srgb, var(--text) 92%, transparent);
    text-decoration: none;
    font-size: clamp(0.82rem, 1vw, 0.9rem);
    border: 1px solid transparent;
    border-radius: 999px;
    padding: 0.35rem 0.7rem;
    background: transparent;
  }

  nav a.current {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
    background: color-mix(in srgb, var(--surface-solid) 82%, transparent);
    color: var(--text);
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

  .mobile-theme-picker {
    display: none;
    margin-left: auto;
  }

  .desktop-theme-picker {
    display: inline-flex;
  }

  .theme-picker button {
    border: 1px solid transparent;
    border-radius: 999px;
    padding: 0.26rem;
    width: 1.85rem;
    height: 1.85rem;
    font-weight: 700;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    display: grid;
    place-items: center;
  }

  .theme-picker button:hover {
    color: var(--text);
    background: color-mix(in srgb, var(--surface-solid) 85%, transparent);
  }

  .theme-picker button.active {
    border-color: color-mix(in srgb, var(--accent) 65%, var(--line));
    background: color-mix(in srgb, var(--surface-solid) 86%, transparent);
  }

  .swatch {
    width: 0.95rem;
    height: 0.95rem;
    border-radius: 50%;
    display: inline-block;
    background:
      radial-gradient(circle at 30% 28%, color-mix(in srgb, white 42%, var(--swatch-tone)), var(--swatch-tone));
    border: 1px solid color-mix(in srgb, var(--swatch-tone) 55%, black);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
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
      display: grid;
      grid-template-columns: 1fr;
      align-items: start;
      gap: 0.65rem;
    }

    .brand-row {
      width: 100%;
      align-items: center;
      gap: 0.5rem;
    }

    .brand-stack {
      min-width: 0;
      gap: 0.12rem;
    }

    .header-controls {
      display: block;
      width: 100%;
    }

    .menu-toggle {
      display: inline-flex;
    }

    .desktop-theme-picker {
      display: none;
    }

    .mobile-theme-picker {
      display: inline-flex;
    }

    nav {
      display: none;
      width: 100%;
      gap: 0.35rem;
      padding-top: 0.1rem;
    }

    nav.open {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.4rem;
    }

    nav a {
      padding: 0.4rem 0.62rem;
      font-size: 0.8rem;
      text-align: center;
    }

    .theme-picker {
      gap: 0.28rem;
      padding: 0.26rem;
    }

    .theme-picker button {
      width: 1.7rem;
      height: 1.7rem;
    }
  }

  @media (max-width: 520px) {
    .brand {
      font-size: 1.02rem;
    }

    .brand-subtitle {
      font-size: 0.72rem;
    }

    nav.open {
      grid-template-columns: 1fr;
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

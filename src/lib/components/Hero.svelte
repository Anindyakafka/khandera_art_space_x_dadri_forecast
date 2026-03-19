<script lang="ts">
  export let title = "Khandera Art Space";
  export let subtitle = "Radical collaborative art, performative codes, and venue-less media revolutions.";
  let highlighted = false;

  function toggleHighlight() {
    highlighted = !highlighted;
  }
</script>

<section class="hero" aria-label="Hero section" on:mouseenter={toggleHighlight} on:mouseleave={toggleHighlight}>
  <div class="hero-overlay" aria-hidden="true"></div>
  <div class="hero-shape" aria-hidden="true"></div>
  <div class="hero-content">
    <p class="eyebrow">Experimental Collective Studio</p>
    <h1 class:highlighted={highlighted}>{title}</h1>
    <p class="subtitle">{subtitle}</p>
    <a class="cta" href="#projects">View Featured Projects</a>
  </div>
</section>

<style>
  .hero {
    min-height: 72vh;
    display: grid;
    place-items: center;
    position: relative;
    isolation: isolate;
    color: var(--text);
    margin: 1rem auto 0;
    width: min(1160px, calc(100vw - 2rem));
    border-radius: clamp(1rem, 3vw, 2rem);
    border: 1px solid var(--line);
    background:
      radial-gradient(circle at 15% 24%, color-mix(in srgb, var(--hero-a) 70%, transparent), transparent 54%),
      radial-gradient(circle at 88% 76%, color-mix(in srgb, var(--hero-c) 56%, transparent), transparent 52%),
      linear-gradient(145deg, color-mix(in srgb, var(--hero-b) 52%, var(--surface-solid)), var(--surface-solid));
    overflow: hidden;
    text-align: center;
    box-shadow: 0 28px 70px -42px var(--shadow);
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      114deg,
      color-mix(in srgb, var(--accent) 10%, transparent) 0,
      color-mix(in srgb, var(--accent) 10%, transparent) 2px,
      transparent 2px,
      transparent 16px
    );
    pointer-events: none;
    opacity: 0.2;
  }

  .hero-shape {
    position: absolute;
    width: clamp(200px, 30vw, 440px);
    aspect-ratio: 1;
    right: -10%;
    top: -18%;
    border-radius: 42% 58% 64% 36% / 41% 35% 65% 59%;
    background: color-mix(in srgb, var(--accent-2) 26%, transparent);
    filter: blur(18px);
    opacity: 0.42;
    animation: pulse-shape 11s ease-in-out infinite;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 58ch;
    padding: clamp(2rem, 5vw, 4.2rem) 1.2rem;
  }

  .eyebrow {
    margin: 0;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    font-size: 0.77rem;
    font-weight: 700;
  }

  h1 {
    font-size: clamp(2rem, 6vw, 4.2rem);
    line-height: 1.05;
    margin: 0.8rem 0 1rem;
    letter-spacing: 0.02em;
    text-wrap: balance;
    transition: letter-spacing 220ms ease, transform 220ms ease;
  }

  h1.highlighted {
    letter-spacing: 0.032em;
    transform: translateY(-2px);
  }

  .subtitle {
    font-size: clamp(1rem, 1.6vw, 1.3rem);
    margin: 0 0 1.5rem;
    opacity: 0.95;
    color: color-mix(in srgb, var(--text) 92%, transparent);
    text-wrap: balance;
  }

  .cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.78rem;
    padding: 0.8rem 1.4rem;
    border: 1px solid color-mix(in srgb, var(--accent) 24%, var(--line));
    background: color-mix(in srgb, var(--surface-solid) 86%, transparent);
    color: color-mix(in srgb, var(--text) 90%, var(--accent));
    border-radius: 999px;
    box-shadow: 0 10px 28px -20px var(--shadow);
    text-decoration: none;
  }

  .cta:hover {
    transform: translateY(-2px);
    background: color-mix(in srgb, var(--surface-solid) 95%, transparent);
    color: var(--accent);
  }

  @keyframes pulse-shape {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(0deg);
    }

    50% {
      transform: translate3d(-12px, 12px, 0) rotate(8deg);
    }
  }

  @media (max-width: 680px) {
    .hero {
      min-height: 65vh;
      width: calc(100vw - 1rem);
      border-radius: 1.05rem;
    }

    .hero-content {
      padding: 1.7rem 1rem 2rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-shape {
      animation: none;
    }

    h1,
    .cta {
      transition: none;
    }
  }
</style>
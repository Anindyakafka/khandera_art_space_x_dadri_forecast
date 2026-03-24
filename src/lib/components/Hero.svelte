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
  <div class="hero-content">
    <p class="eyebrow">Experimental Collective Studio</p>
    <h1 class:highlighted={highlighted}>{title}</h1>
    <p class="subtitle">{subtitle}</p>
    <a class="cta" href="#projects">View Featured Projects</a>
  </div>
</section>

<style>
  .hero {
    min-height: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    position: relative;
    color: var(--text);
    margin: 0;
    width: 100%;
    background:
      radial-gradient(circle at 22% 28%, color-mix(in srgb, var(--hero-a) 50%, transparent), transparent 56%),
      radial-gradient(circle at 82% 66%, color-mix(in srgb, var(--hero-c) 42%, transparent), transparent 58%);
    overflow: hidden;
    text-align: center;
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

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 72ch;
    padding: clamp(1.7rem, 4.6vw, 4.6rem) clamp(0.9rem, 3vw, 1.3rem);
  }

  .eyebrow {
    margin: 0;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    font-size: clamp(0.68rem, 1.4vw, 0.8rem);
    font-weight: 700;
  }

  h1 {
    font-size: clamp(1.8rem, 6.3vw, 4.2rem);
    line-height: 1.05;
    margin: 0.8rem 0 1rem;
    letter-spacing: 0.02em;
    text-wrap: balance;
    transition: letter-spacing 220ms ease, transform 220ms ease;
  }

  h1.highlighted {
    letter-spacing: 0.032em;
  }

  .subtitle {
    font-size: clamp(0.96rem, 1.8vw, 1.22rem);
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
    font-size: clamp(0.68rem, 1.8vw, 0.78rem);
    padding: 0.72rem 1.15rem;
    border: 1px solid color-mix(in srgb, var(--accent) 24%, var(--line));
    background: transparent;
    color: color-mix(in srgb, var(--text) 90%, var(--accent));
    border-radius: 999px;
    text-decoration: none;
  }

  .cta:hover {
    background: color-mix(in srgb, var(--surface-solid) 55%, transparent);
    color: var(--accent);
  }

  @media (max-width: 680px) {
    .hero-content {
      padding: 1.25rem 0.92rem 1.5rem;
    }

    .subtitle {
      margin-bottom: 1rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    h1,
    .cta {
      transition: none;
    }
  }
</style>
<script lang="ts">
  export let title = "Khandera Art Space";
  export let subtitle = "Radical collaborative art, performative codes, and venue-less media revolutions.";
  let glitch = false;

  function toggleGlitch() {
    glitch = !glitch;
  }
</script>

<section class="hero" aria-label="Hero section" on:mouseenter={toggleGlitch} on:mouseleave={toggleGlitch}>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <h1 class:glitch={glitch}>{title}</h1>
    <p>{subtitle}</p>
    <a class="cta" href="#projects">View Radical Projects</a>
  </div>
</section>

<style>
  .hero {
    min-height: 75vh;
    display: grid;
    place-items: center;
    position: relative;
    color: var(--text-inverse);
    background: radial-gradient(circle at 25% 30%, #802beb88, #0e071b 30%),
      linear-gradient(120deg, #4a0fdd 0%, #13083d 45%, #000000 100%);
    overflow: hidden;
    text-align: center;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="800"%3E%3Cfilter id="f" x="0" y="0" width="100%" height="100%"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.3" numOctaves="5" result="t"/%3E%3CfeColorMatrix type="saturate" values="0"/%3E%3CfeComposite operator="in" in2="SourceGraphic"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23f)" opacity="0.16" fill="white"/%3E%3C/svg%3E');
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: .35;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 58ch;
    padding: 0 1rem;
  }

  h1 {
    font-size: clamp(2rem, 6vw, 4rem);
    line-height: 1.05;
    margin: 0 0 1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-shadow: 0 14px 28px rgba(0, 0, 0, .4);
  }

  h1.glitch {
    animation: glitch 0.5s infinite;
  }

  @keyframes glitch {
    0% {
      text-shadow: 2px 0 red, -2px 0 lime;
      transform: translate(0,0);
    }
    20% { transform: translate(-3px, 2px); }
    40% { transform: translate(2px, -1px); }
    60% { text-shadow: -3px 0 cyan, 3px 0 magenta; }
    80% { transform: translate(-1px, -2px); }
    100% { transform: translate(0,0); }
  }

  p {
    font-size: clamp(1rem, 1.6vw, 1.3rem);
    margin: 0 0 1.5rem;
    opacity: .95;
  }

  .cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding: 0.8rem 1.5rem;
    border: 1px solid rgba(255,255,255,.55);
    background: rgba(255,255,255,.08);
    color: inherit;
    backdrop-filter: blur(4px);
    border-radius: 999px;
    transition: transform 160ms ease, background 180ms ease;
    text-decoration: none;
  }

  .cta:hover {
    transform: translateY(-2px);
    background: rgba(255,255,255,.2);
  }
</style>
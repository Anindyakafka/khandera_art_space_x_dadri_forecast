<script lang="ts">
  export let src = '';
  export let alt = 'UPI QR code';
  export let payeeName = '';
  export let upiId = '';

  let isFlat = false;

  const petals = [
    { x: 8, y: 18, size: 10, delay: 0.0, rot: -18, sway: 10 },
    { x: 18, y: 8, size: 14, delay: 0.8, rot: 22, sway: 14 },
    { x: 82, y: 12, size: 12, delay: 0.4, rot: -12, sway: 12 },
    { x: 88, y: 28, size: 9, delay: 1.1, rot: 18, sway: 9 },
    { x: 14, y: 72, size: 13, delay: 0.6, rot: -28, sway: 13 },
    { x: 72, y: 78, size: 11, delay: 1.4, rot: 14, sway: 11 },
    { x: 90, y: 82, size: 15, delay: 0.2, rot: -20, sway: 12 },
    { x: 56, y: 10, size: 8, delay: 1.6, rot: 10, sway: 8 }
  ];
</script>

<div class="sakura-shell" class:is-flat={isFlat}>
  <button type="button" class="view-toggle" on:click={() => (isFlat = !isFlat)}>
    {isFlat ? 'Show blossom view' : 'Show flat scan view'}
  </button>

  <div class="scene" aria-label={`UPI QR for ${payeeName || upiId}`}>
    <div class="sun-glow" aria-hidden="true"></div>
    <div class="tree-shadow" aria-hidden="true"></div>
    <div class="petal-field" aria-hidden="true">
      {#each petals as petal}
        <span
          class="petal"
          style={`--x:${petal.x}%; --y:${petal.y}%; --size:${petal.size}px; --delay:${petal.delay}s; --rot:${petal.rot}deg; --sway:${petal.sway}px;`}
        ></span>
      {/each}
    </div>

    <div class="qr-plinth" aria-hidden="true"></div>

    <div class="qr-card">
      <img src={src} alt={alt} loading="lazy" />
    </div>
  </div>

  <p class="hint">
    Inspired by the cherry blossom QR reference: blossom view for atmosphere, flat view for cleaner scanning.
  </p>
</div>

<style>
  .sakura-shell {
    display: grid;
    gap: 0.65rem;
  }

  .view-toggle {
    justify-self: start;
    border: 1px solid color-mix(in srgb, var(--accent) 55%, var(--line));
    background: color-mix(in srgb, var(--surface-solid) 88%, transparent);
    color: inherit;
    padding: 0.45rem 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.72rem;
    cursor: pointer;
  }

  .scene {
    position: relative;
    min-height: 20rem;
    overflow: hidden;
    padding: 1rem;
    border: 1px solid color-mix(in srgb, var(--line) 78%, transparent);
    background:
      linear-gradient(180deg, #f7f3ed 0%, #efe6dd 55%, #eadfd6 100%),
      radial-gradient(circle at top left, rgba(255, 255, 255, 0.95), transparent 42%);
    isolation: isolate;
  }

  .sun-glow {
    position: absolute;
    inset: 0 auto auto 0;
    width: 52%;
    aspect-ratio: 1;
    background: radial-gradient(circle, rgba(255, 236, 214, 0.95), rgba(255, 236, 214, 0) 70%);
    pointer-events: none;
    opacity: 0.8;
  }

  .tree-shadow {
    position: absolute;
    left: 50%;
    bottom: 1.15rem;
    width: min(72%, 18rem);
    height: 2rem;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba(34, 24, 18, 0.22), transparent 72%);
    filter: blur(8px);
    transition: opacity 320ms ease;
  }

  .petal-field {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .petal {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--size);
    height: calc(var(--size) * 0.7);
    border-radius: 70% 30% 60% 40%;
    background: linear-gradient(135deg, #f6cbd8, #b24061 80%);
    opacity: 0.82;
    transform: rotate(var(--rot));
    animation: petalFloat 5.8s ease-in-out infinite;
    animation-delay: var(--delay);
    box-shadow: 0 0 0 1px rgba(178, 64, 97, 0.08);
  }

  .qr-plinth {
    position: absolute;
    inset: auto 12% 1rem 12%;
    height: 4.1rem;
    background:
      linear-gradient(180deg, rgba(116, 74, 52, 0.16), rgba(64, 38, 24, 0.24)),
      linear-gradient(90deg, rgba(122, 158, 80, 0.16), rgba(122, 158, 80, 0.03));
    border-radius: 999px;
    filter: blur(0.3px);
  }

  .qr-card {
    position: relative;
    z-index: 1;
    width: min(100%, 18rem);
    margin: 1.6rem auto 0;
    transform-style: preserve-3d;
    transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), filter 460ms ease;
    filter: drop-shadow(0 18px 32px rgba(39, 18, 24, 0.18));
  }

  .qr-card img {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    object-position: center 78%;
    transform: scale(1.16);
    border: 1px solid rgba(67, 44, 34, 0.18);
    background: #f4efe7;
  }

  .sakura-shell:not(.is-flat) .qr-card {
    transform: perspective(1100px) rotateX(56deg) rotateZ(-16deg) translateY(0.2rem) scale(0.96);
  }

  .sakura-shell.is-flat .qr-card {
    transform: none;
    filter: drop-shadow(0 12px 22px rgba(39, 18, 24, 0.12));
  }

  .sakura-shell.is-flat .tree-shadow {
    opacity: 0.35;
  }

  .sakura-shell.is-flat .petal {
    opacity: 0.24;
    animation-duration: 7s;
  }

  .hint {
    margin: 0;
    font-size: 0.78rem;
    line-height: 1.6;
    color: var(--muted);
  }

  @keyframes petalFloat {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(var(--rot));
    }
    50% {
      transform: translate3d(var(--sway), 8px, 0) rotate(calc(var(--rot) + 8deg));
    }
  }
</style>

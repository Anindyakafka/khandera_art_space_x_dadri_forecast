<script lang="ts">
  import { onMount } from 'svelte';

  let shell: HTMLDivElement | null = null;
  let dragging = false;

  const orbSize = 58;
  let orbX = 10;
  let orbY = 14;
  let offsetX = 0;
  let offsetY = 0;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function getLimits() {
    if (!shell) {
      return { maxX: 200, maxY: 500 };
    }

    const width = Math.max(shell.clientWidth, 320);
    const height = Math.max(shell.scrollHeight, shell.clientHeight, 320);

    return {
      maxX: Math.max(8, width - orbSize - 8),
      maxY: Math.max(8, Math.min(height - orbSize - 8, 1200))
    };
  }

  function setFromPointer(event: PointerEvent) {
    if (!shell) {
      return;
    }

    const rect = shell.getBoundingClientRect();
    const limits = getLimits();
    orbX = clamp(event.clientX - rect.left - offsetX, 8, limits.maxX);
    orbY = clamp(event.clientY - rect.top - offsetY, 8, limits.maxY);
  }

  function onOrbPointerDown(event: PointerEvent) {
    event.preventDefault();

    if (!shell) {
      return;
    }

    const rect = shell.getBoundingClientRect();
    dragging = true;
    offsetX = event.clientX - rect.left - orbX;
    offsetY = event.clientY - rect.top - orbY;
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragging) {
      return;
    }

    setFromPointer(event);
  }

  function onPointerUp() {
    dragging = false;
  }

  function constrainOnResize() {
    const limits = getLimits();
    orbX = clamp(orbX, 8, limits.maxX);
    orbY = clamp(orbY, 8, limits.maxY);
  }

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      constrainOnResize();
    });

    if (shell) {
      resizeObserver.observe(shell);
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', constrainOnResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', constrainOnResize);
    };
  });
</script>

<div class="dadri-flow-field" bind:this={shell}>
  <button
    type="button"
    class="dadri-flow-orb"
    aria-label="Drag orb to reflow Dadri text"
    on:pointerdown={onOrbPointerDown}
    style={`--orb-size:${orbSize}px; --orb-x:${orbX}px; --orb-y:${orbY}px;`}
  >
    <span>{dragging ? 'move' : 'flow'}</span>
  </button>

  <div class="flow-content">
    <slot />
  </div>
</div>

<style>
  .dadri-flow-field {
    position: relative;
    width: 100%;
  }

  .dadri-flow-orb {
    --gap: clamp(0.34rem, 1vw, 0.72rem);
    float: left;
    width: var(--orb-size);
    height: var(--orb-size);
    margin-left: var(--orb-x);
    margin-top: var(--orb-y);
    margin-right: var(--gap);
    margin-bottom: var(--gap);
    border-radius: 999px;
    shape-outside: circle(50%);
    clip-path: circle(50%);
    border: 1px solid color-mix(in srgb, var(--accent) 56%, var(--line));
    background:
      radial-gradient(circle at 34% 24%, color-mix(in srgb, var(--accent) 34%, transparent), transparent 58%),
      color-mix(in srgb, var(--surface) 94%, transparent);
    color: color-mix(in srgb, var(--accent) 86%, var(--text));
    font: 700 0.6rem/1 "IBM Plex Sans", "Segoe UI", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: grid;
    place-items: center;
    cursor: grab;
    user-select: none;
    touch-action: none;
    z-index: 2;
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--line) 55%, transparent),
      0 14px 28px color-mix(in srgb, black 21%, transparent);
  }

  .dadri-flow-orb:active {
    cursor: grabbing;
    filter: brightness(1.03);
  }

  .dadri-flow-orb span {
    pointer-events: none;
    opacity: 0.9;
  }

  .flow-content :global(p),
  .flow-content :global(li),
  .flow-content :global(blockquote) {
    overflow-wrap: anywhere;
  }

  .flow-content :global(h1),
  .flow-content :global(h2),
  .flow-content :global(h3),
  .flow-content :global(h4),
  .flow-content :global(h5),
  .flow-content :global(h6),
  .flow-content :global(nav),
  .flow-content :global(figure),
  .flow-content :global(img),
  .flow-content :global(video),
  .flow-content :global(canvas),
  .flow-content :global(pre),
  .flow-content :global(table),
  .flow-content :global(form),
  .flow-content :global(button),
  .flow-content :global(.profile-grid),
  .flow-content :global(.project-grid),
  .flow-content :global(.artist-grid),
  .flow-content :global(.event-grid) {
    clear: both;
  }

  @media (max-width: 760px) {
    .dadri-flow-orb {
      width: calc(var(--orb-size) * 0.88);
      height: calc(var(--orb-size) * 0.88);
    }
  }
</style>
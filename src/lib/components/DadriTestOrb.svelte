<script lang="ts">
  import { onMount } from 'svelte';

  export let size = 44;

  let x = 0;
  let y = 0;
  let dragging = false;
  let pointerOffsetX = 0;
  let pointerOffsetY = 0;
  let initialized = false;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function bounds() {
    const margin = 10;
    const maxX = Math.max(margin, window.innerWidth - size - margin);
    const maxY = Math.max(margin, window.innerHeight - size - margin);

    return { min: margin, maxX, maxY };
  }

  function placeDefault() {
    const margin = 16;
    x = Math.max(margin, window.innerWidth - size - margin);
    y = Math.max(margin, window.innerHeight - size - 100);
  }

  function onPointerDown(event: PointerEvent) {
    dragging = true;
    pointerOffsetX = event.clientX - x;
    pointerOffsetY = event.clientY - y;
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragging) {
      return;
    }

    const { min, maxX, maxY } = bounds();
    x = clamp(event.clientX - pointerOffsetX, min, maxX);
    y = clamp(event.clientY - pointerOffsetY, min, maxY);
  }

  function onPointerUp() {
    dragging = false;
  }

  function onResize() {
    if (!initialized) {
      return;
    }

    const { min, maxX, maxY } = bounds();
    x = clamp(x, min, maxX);
    y = clamp(y, min, maxY);
  }

  onMount(() => {
    placeDefault();
    initialized = true;

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
    };
  });
</script>

<button
  type="button"
  class="dadri-test-orb"
  aria-label="Drag test orb"
  on:pointerdown={onPointerDown}
  style={`--orb-size:${size}px; transform: translate3d(${x}px, ${y}px, 0);`}
>
  <span>{dragging ? 'move' : 'test'}</span>
</button>

<style>
  .dadri-test-orb {
    position: fixed;
    left: 0;
    top: 0;
    width: var(--orb-size);
    height: var(--orb-size);
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--accent) 65%, var(--line));
    background:
      radial-gradient(circle at 34% 26%, color-mix(in srgb, var(--accent) 36%, transparent), transparent 58%),
      color-mix(in srgb, var(--surface) 94%, transparent);
    color: color-mix(in srgb, var(--accent) 88%, var(--text));
    font: 700 0.55rem/1 "IBM Plex Sans", "Segoe UI", sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    display: grid;
    place-items: center;
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--line) 55%, transparent),
      0 10px 24px color-mix(in srgb, black 24%, transparent);
    cursor: grab;
    z-index: 120;
    touch-action: none;
  }

  .dadri-test-orb:active {
    cursor: grabbing;
    filter: brightness(1.05);
  }

  .dadri-test-orb span {
    pointer-events: none;
    opacity: 0.9;
  }
</style>

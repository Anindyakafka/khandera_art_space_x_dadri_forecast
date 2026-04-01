<script lang="ts">
  import { onMount } from 'svelte';

  type Segment = {
    start: number;
    end: number;
    x: number;
    width: number;
    y: number;
  };

  export let text =
    'Dadri Forecast listens to shifting grounds: ash, wind, labor, memory, and the unresolved question of who gets to remain visible. Drag the orb and watch each line negotiate space around it.';
  export let lineHeight = 30;
  export let font = '500 1rem "IBM Plex Sans", "Segoe UI", sans-serif';
  export let orbRadius = 76;

  let host: HTMLDivElement | null = null;
  let lineLayer: HTMLDivElement | null = null;

  let hostWidth = 640;
  let hostHeight = 340;
  let orbX = 210;
  let orbY = 126;
  let dragging = false;

  let segments: Segment[] = [];
  let canvasCtx: CanvasRenderingContext2D | null = null;
  const widthCache = new Map<string, number>();

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function measureTextWidth(fragment: string) {
    if (!canvasCtx || fragment.length === 0) {
      return 0;
    }

    const cached = widthCache.get(fragment);
    if (cached !== undefined) {
      return cached;
    }

    const width = canvasCtx.measureText(fragment).width;
    widthCache.set(fragment, width);
    return width;
  }

  function getBlockedRange(midY: number) {
    const dy = Math.abs(midY - orbY);
    if (dy >= orbRadius) {
      return null;
    }

    const dx = Math.sqrt(orbRadius * orbRadius - dy * dy);
    const inset = 8;

    return {
      left: clamp(orbX - dx - inset, 0, hostWidth),
      right: clamp(orbX + dx + inset, 0, hostWidth)
    };
  }

  function allowedRanges(lineTop: number) {
    const lineMid = lineTop + lineHeight * 0.5;
    const blocked = getBlockedRange(lineMid);

    if (!blocked) {
      return [{ start: 0, end: hostWidth }];
    }

    const spans = [] as Array<{ start: number; end: number }>;
    if (blocked.left > 0) {
      spans.push({ start: 0, end: blocked.left });
    }

    if (blocked.right < hostWidth) {
      spans.push({ start: blocked.right, end: hostWidth });
    }

    if (spans.length === 0) {
      return [{ start: 0, end: hostWidth }];
    }

    return spans;
  }

  function pushLineSegment(start: number, end: number, x: number, y: number) {
    if (end <= start) {
      return;
    }

    segments.push({
      start,
      end,
      x,
      y,
      width: measureTextWidth(text.slice(start, end))
    });
  }

  function shouldSkipLeadingSpace(index: number, isLineStart: boolean) {
    return isLineStart && text[index] === ' ';
  }

  function layoutTextAroundOrb() {
    if (!canvasCtx || !host || hostWidth <= 0) {
      return;
    }

    widthCache.clear();
    segments = [];

    let cursor = 0;
    let lineTop = 0;
    const maxLines = 260;

    for (let lineIndex = 0; lineIndex < maxLines && cursor < text.length; lineIndex++) {
      const ranges = allowedRanges(lineTop);

      for (let rangeIndex = 0; rangeIndex < ranges.length && cursor < text.length; rangeIndex++) {
        const range = ranges[rangeIndex];
        const rangeWidth = range.end - range.start;
        if (rangeWidth < 8) {
          continue;
        }

        const lineStart = cursor;
        let used = 0;
        let localCursor = cursor;

        while (localCursor < text.length) {
          const char = text[localCursor];

          if (char === '\n') {
            localCursor += 1;
            break;
          }

          if (shouldSkipLeadingSpace(localCursor, lineStart === localCursor)) {
            localCursor += 1;
            continue;
          }

          const nextWidth = measureTextWidth(text.slice(lineStart, localCursor + 1));

          if (nextWidth > rangeWidth) {
            break;
          }

          used = nextWidth;
          localCursor += 1;
        }

        if (localCursor === lineStart) {
          const forcedWidth = measureTextWidth(text.slice(localCursor, localCursor + 1));
          pushLineSegment(localCursor, localCursor + 1, range.start, lineTop);
          used = forcedWidth;
          localCursor += 1;
        } else {
          pushLineSegment(lineStart, localCursor, range.start, lineTop);
        }

        cursor = localCursor;

        if (used < rangeWidth - 1 && cursor < text.length && text[cursor] === '\n') {
          cursor += 1;
          break;
        }
      }

      lineTop += lineHeight;
    }

    hostHeight = Math.max(260, lineTop + lineHeight * 0.7);
  }

  function syncHostBounds() {
    if (!host) {
      return;
    }

    const rect = host.getBoundingClientRect();
    hostWidth = Math.max(rect.width, 280);
    orbX = clamp(orbX, orbRadius + 8, hostWidth - orbRadius - 8);
    orbY = clamp(orbY, orbRadius + 8, hostHeight - orbRadius - 8);
    layoutTextAroundOrb();
  }

  function updateOrbFromPointer(event: PointerEvent) {
    if (!host) {
      return;
    }

    const rect = host.getBoundingClientRect();
    orbX = clamp(event.clientX - rect.left, orbRadius + 8, hostWidth - orbRadius - 8);
    orbY = clamp(event.clientY - rect.top, orbRadius + 8, hostHeight - orbRadius - 8);
    layoutTextAroundOrb();
  }

  function onPointerDown(event: PointerEvent) {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (!event.target.closest('.orb')) {
      return;
    }

    dragging = true;
    updateOrbFromPointer(event);
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragging) {
      return;
    }

    updateOrbFromPointer(event);
  }

  function onPointerUp() {
    dragging = false;
  }

  onMount(() => {
    const canvas = document.createElement('canvas');
    canvasCtx = canvas.getContext('2d');

    if (!canvasCtx) {
      return;
    }

    canvasCtx.font = font;
    syncHostBounds();

    const resizeObserver = new ResizeObserver(() => {
      canvasCtx!.font = font;
      syncHostBounds();
    });

    if (host) {
      resizeObserver.observe(host);
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  });
</script>

<section
  class="flow-wrap"
  bind:this={host}
  on:pointerdown={onPointerDown}
  style={`--orb-size:${orbRadius * 2}px; min-height:${Math.ceil(hostHeight)}px;`}
>
  <div class="line-layer" bind:this={lineLayer}>
    {#each segments as segment, index (index)}
      <span class="line-fragment" style={`left:${segment.x}px; top:${segment.y}px;`}>{text.slice(segment.start, segment.end)}</span>
    {/each}
  </div>

  <button
    type="button"
    class="orb"
    aria-label="Drag text repeller"
    style={`left:${orbX - orbRadius}px; top:${orbY - orbRadius}px;`}
  >
    <span>{dragging ? 'Move' : 'Drag'}</span>
  </button>
</section>

<style>
  .flow-wrap {
    position: relative;
    width: min(920px, 100%);
    margin: 1rem 0 0.4rem;
    border-top: 1px solid color-mix(in srgb, var(--line) 75%, transparent);
    border-bottom: 1px solid color-mix(in srgb, var(--line) 65%, transparent);
    background:
      radial-gradient(circle at 10% 0%, color-mix(in srgb, var(--accent) 7%, transparent) 0, transparent 45%),
      linear-gradient(180deg, color-mix(in srgb, var(--surface) 90%, transparent), color-mix(in srgb, var(--surface) 75%, transparent));
    overflow: clip;
    touch-action: none;
  }

  .line-layer {
    position: relative;
    width: 100%;
    min-height: inherit;
    padding: 0.75rem 0;
  }

  .line-fragment {
    position: absolute;
    display: inline-block;
    font: 500 1rem/1.85 "IBM Plex Sans", "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    color: color-mix(in srgb, var(--text) 92%, transparent);
    white-space: pre;
    user-select: none;
    pointer-events: none;
  }

  .orb {
    position: absolute;
    width: var(--orb-size);
    height: var(--orb-size);
    border: 1px solid color-mix(in srgb, var(--accent) 55%, var(--line));
    border-radius: 999px;
    display: grid;
    place-items: center;
    font: 700 0.68rem/1 "IBM Plex Sans", "Segoe UI", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.11em;
    color: color-mix(in srgb, var(--accent) 88%, var(--text));
    background:
      radial-gradient(circle at 32% 26%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 54%),
      radial-gradient(circle at 74% 74%, color-mix(in srgb, var(--text) 14%, transparent), transparent 58%),
      color-mix(in srgb, var(--surface) 94%, transparent);
    cursor: grab;
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--line) 60%, transparent),
      0 12px 34px color-mix(in srgb, black 25%, transparent);
  }

  .orb:active {
    cursor: grabbing;
    transform: scale(0.985);
  }

  .orb span {
    pointer-events: none;
    opacity: 0.85;
  }

  @media (max-width: 720px) {
    .line-fragment {
      font-size: 0.94rem;
      line-height: 1.78;
    }
  }
</style>

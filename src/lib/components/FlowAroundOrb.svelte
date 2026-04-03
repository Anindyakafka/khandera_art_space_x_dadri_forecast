<script lang="ts">
  import { onMount } from 'svelte';

  type Cursor = {
    segmentIndex: number;
    graphemeIndex: number;
  };

  type LayoutLine = {
    text: string;
    width: number;
    start: Cursor;
    end: Cursor;
  };

  type PretextApi = {
    prepareWithSegments: (text: string, font: string, options?: { whiteSpace?: 'normal' | 'pre-wrap' }) => unknown;
    layoutNextLine: (prepared: unknown, start: Cursor, maxWidth: number) => LayoutLine | null;
  };

  type Segment = {
    text: string;
    x: number;
    width: number;
    y: number;
  };

  export let text =
    'Dadri Forecast listens to shifting grounds: ash, wind, labor, memory, and the unresolved question of who gets to remain visible. Drag the orb and watch each line negotiate space around it.';
  export let lineHeight = 30;
  export let font = '500 1rem "IBM Plex Sans", "Segoe UI", sans-serif';
  export let orbRadius = 76;
  export let minHeight = 260;
  export let hoverOnly = false;
  export let showKicker = true;
  export let compact = false;
  export let orbOffsetX = 0;
  export let orbOffsetY = 0;

  let host: HTMLElement | null = null;

  let hostWidth = 640;
  let hostHeight = 340;
  let orbX = 210;
  let orbY = 126;
  let dragging = false;
  let hovering = false;

  let segments: Segment[] = [];
  let canvasCtx: CanvasRenderingContext2D | null = null;
  let pretextApi: PretextApi | null = null;
  let prepared: unknown = null;
  let usingPretext = false;

  const widthCache = new Map<string, number>();

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function sameCursor(a: Cursor, b: Cursor) {
    return a.segmentIndex === b.segmentIndex && a.graphemeIndex === b.graphemeIndex;
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

  function prepareLayoutData() {
    widthCache.clear();

    if (canvasCtx) {
      canvasCtx.font = font;
    }

    if (!pretextApi) {
      prepared = null;
      usingPretext = false;
      return;
    }

    try {
      prepared = pretextApi.prepareWithSegments(text, font, { whiteSpace: 'normal' });
      usingPretext = true;
    } catch {
      prepared = null;
      usingPretext = false;
    }
  }

  function getBlockedRange(midY: number) {
    if (hoverOnly && !hovering) {
      return null;
    }

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

  function pushLineSegment(content: string, x: number, y: number) {
    if (content.length === 0) {
      return;
    }

    segments.push({
      text: content,
      x,
      y,
      width: measureTextWidth(content)
    });
  }

  function shouldSkipLeadingSpace(index: number, isLineStart: boolean) {
    return isLineStart && text[index] === ' ';
  }

  function layoutTextWithPretext() {
    if (!pretextApi || !prepared) {
      return false;
    }

    const nextSegments: Segment[] = [];
    let lineTop = 0;
    let safety = 0;
    let done = false;
    let cursor: Cursor = { segmentIndex: 0, graphemeIndex: 0 };

    while (!done && lineTop < 1600 && safety < 260) {
      const ranges = allowedRanges(lineTop);
      let consumedRow = false;

      for (const range of ranges) {
        const width = range.end - range.start;
        if (width < 12) {
          continue;
        }

        const before = { ...cursor };
        const line = pretextApi.layoutNextLine(prepared, cursor, width);

        if (!line) {
          done = true;
          break;
        }

        if (sameCursor(before, line.end)) {
          continue;
        }

        nextSegments.push({
          text: line.text,
          x: range.start,
          y: lineTop,
          width: line.width
        });

        cursor = line.end;
        consumedRow = true;
      }

      if (!consumedRow && !done) {
        const fallback = pretextApi.layoutNextLine(prepared, cursor, hostWidth);
        if (!fallback || sameCursor(cursor, fallback.end)) {
          done = true;
        } else {
          nextSegments.push({
            text: fallback.text,
            x: 0,
            y: lineTop,
            width: fallback.width
          });
          cursor = fallback.end;
        }
      }

      lineTop += lineHeight;
      safety += 1;
    }

    segments = nextSegments;
    hostHeight = Math.max(minHeight, lineTop + lineHeight * 0.7);
    return true;
  }

  function layoutTextFallback() {
    if (!canvasCtx || !host || hostWidth <= 0) {
      return;
    }

    segments = [];

    let cursor = 0;
    let lineTop = 0;
    const maxLines = 260;

    for (let lineIndex = 0; lineIndex < maxLines && cursor < text.length; lineIndex += 1) {
      const ranges = allowedRanges(lineTop);

      for (let rangeIndex = 0; rangeIndex < ranges.length && cursor < text.length; rangeIndex += 1) {
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
          const singleChar = text.slice(localCursor, localCursor + 1);
          pushLineSegment(singleChar, range.start, lineTop);
          used = measureTextWidth(singleChar);
          localCursor += 1;
        } else {
          pushLineSegment(text.slice(lineStart, localCursor), range.start, lineTop);
        }

        cursor = localCursor;

        if (used < rangeWidth - 1 && cursor < text.length && text[cursor] === '\n') {
          cursor += 1;
          break;
        }
      }

      lineTop += lineHeight;
    }

    hostHeight = Math.max(minHeight, lineTop + lineHeight * 0.7);
  }

  function layoutTextAroundOrb() {
    if (!host || hostWidth <= 0) {
      return;
    }

    if (layoutTextWithPretext()) {
      return;
    }

    layoutTextFallback();
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
    orbX = clamp(event.clientX - rect.left + orbOffsetX, orbRadius + 8, hostWidth - orbRadius - 8);
    orbY = clamp(event.clientY - rect.top + orbOffsetY, orbRadius + 8, hostHeight - orbRadius - 8);
    layoutTextAroundOrb();
  }

  function onPointerEnter(event: PointerEvent) {
    if (!hoverOnly) {
      return;
    }

    hovering = true;
    updateOrbFromPointer(event);
  }

  function onLocalPointerMove(event: PointerEvent) {
    if (!hoverOnly) {
      return;
    }

    hovering = true;
    updateOrbFromPointer(event);
  }

  function onPointerLeave() {
    if (!hoverOnly) {
      return;
    }

    hovering = false;
    layoutTextAroundOrb();
  }

  function onPointerDown(event: PointerEvent) {
    if (hoverOnly || !(event.target instanceof HTMLElement) || !event.target.closest('.orb')) {
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

    prepareLayoutData();
    syncHostBounds();

    void (async () => {
      try {
        pretextApi = (await import('@chenglou/pretext')) as PretextApi;
      } catch {
        pretextApi = null;
      }

      prepareLayoutData();
      layoutTextAroundOrb();
    })();

    const resizeObserver = new ResizeObserver(() => {
      prepareLayoutData();
      syncHostBounds();
    });

    if (host) {
      resizeObserver.observe(host);
    }

    if (!hoverOnly) {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    }

    return () => {
      resizeObserver.disconnect();

      if (!hoverOnly) {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      }
    };
  });
</script>

<section
  class="flow-wrap"
  class:compact
  class:hover-only={hoverOnly}
  role="group"
  bind:this={host}
  on:pointerenter={onPointerEnter}
  on:pointermove={onLocalPointerMove}
  on:pointerleave={onPointerLeave}
  on:pointerdown={onPointerDown}
  style={`--orb-size:${orbRadius * 2}px; min-height:${Math.ceil(hostHeight)}px; --flow-font:${font}; --flow-line-height:${lineHeight}px;`}
>
  {#if showKicker}
    <p class="flow-kicker">{usingPretext ? 'Cheng Lou Pretext // active' : hoverOnly ? 'Hover text // fallback wrap' : 'Drag orb // fallback wrap'}</p>
  {/if}

  <div class="line-layer">
    {#each segments as segment, index (index)}
      <span class="line-fragment" style={`left:${segment.x}px; top:${segment.y}px;`}>{segment.text}</span>
    {/each}
  </div>

  {#if hoverOnly}
    <div
      class="orb orb-hover"
      class:is-visible={hovering}
      aria-hidden="true"
      style={`left:${orbX - orbRadius}px; top:${orbY - orbRadius}px;`}
    ></div>
  {:else}
    <button
      type="button"
      class="orb"
      aria-label="Drag text repeller"
      style={`left:${orbX - orbRadius}px; top:${orbY - orbRadius}px;`}
    >
      <span>{dragging ? 'Move' : 'Drag'}</span>
    </button>
  {/if}
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

  .flow-wrap.hover-only {
    touch-action: auto;
    cursor: text;
  }

  .flow-wrap.compact {
    width: 100%;
    margin: 0.16rem 0 0.52rem;
    border-top: 0;
    border-bottom: 0;
    background: transparent;
  }

  .flow-kicker {
    margin: 0;
    padding: 0.65rem 0.8rem 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font: 700 0.62rem/1 "IBM Plex Sans", "Segoe UI", sans-serif;
    color: color-mix(in srgb, var(--muted) 88%, var(--text));
  }

  .line-layer {
    position: relative;
    z-index: 2;
    width: 100%;
    min-height: inherit;
    padding: 0.75rem 0;
  }

  .flow-wrap.compact .line-layer {
    padding: 0.12rem 0;
  }

  .line-fragment {
    position: absolute;
    display: inline-block;
    font: var(--flow-font);
    line-height: var(--flow-line-height);
    letter-spacing: 0.01em;
    color: color-mix(in srgb, var(--text) 92%, transparent);
    white-space: pre;
    user-select: none;
    pointer-events: none;
  }

  .flow-wrap.compact .line-fragment {
    color: color-mix(in srgb, var(--text) 94%, transparent);
  }

  .orb {
    position: absolute;
    z-index: 3;
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
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--line) 60%, transparent),
      0 12px 34px color-mix(in srgb, black 25%, transparent);
  }

  button.orb {
    cursor: grab;
  }

  button.orb:active {
    cursor: grabbing;
    transform: scale(0.985);
  }

  .orb-hover {
    z-index: 1;
    pointer-events: none;
    opacity: 0;
    transform: scale(0.88);
    transition:
      opacity 140ms ease,
      transform 140ms ease;
  }

  .orb-hover.is-visible {
    opacity: 0.92;
    transform: scale(1);
  }

  .flow-wrap.compact .orb-hover {
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--line) 42%, transparent),
      0 10px 24px color-mix(in srgb, black 18%, transparent);
    background:
      radial-gradient(circle at 32% 26%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 56%),
      color-mix(in srgb, var(--surface) 90%, transparent);
  }

  .orb span {
    pointer-events: none;
    opacity: 0.85;
  }

  @media (max-width: 720px) {
    .flow-wrap {
      margin-top: 0.75rem;
    }
  }
</style>

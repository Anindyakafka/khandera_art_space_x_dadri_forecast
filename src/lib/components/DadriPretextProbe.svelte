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

  type RenderLine = {
    x: number;
    y: number;
    text: string;
  };

  export let text =
    'Pretext probe: drag this orb and each row recalculates with variable width. This follows Cheng Lou style layout routing using prepareWithSegments plus layoutNextLine.';
  export let font = '500 14px "IBM Plex Sans", "Segoe UI", sans-serif';
  export let lineHeight = 22;
  export let orbRadius = 26;

  let host: HTMLDivElement | null = null;
  let hostWidth = 320;
  let hostHeight = 190;
  let orbX = 112;
  let orbY = 82;
  let dragging = false;

  let pretextApi: PretextApi | null = null;
  let prepared: unknown = null;
  let status = 'loading';
  let lines: RenderLine[] = [];

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function sameCursor(a: Cursor, b: Cursor) {
    return a.segmentIndex === b.segmentIndex && a.graphemeIndex === b.graphemeIndex;
  }

  function getBlockedRange(midY: number) {
    const dy = Math.abs(midY - orbY);
    if (dy >= orbRadius) {
      return null;
    }

    const dx = Math.sqrt(orbRadius * orbRadius - dy * dy);
    const pad = 4;

    return {
      left: clamp(orbX - dx - pad, 0, hostWidth),
      right: clamp(orbX + dx + pad, 0, hostWidth)
    };
  }

  function allowedRanges(lineTop: number) {
    const blocked = getBlockedRange(lineTop + lineHeight * 0.5);

    if (!blocked) {
      return [{ start: 0, end: hostWidth }];
    }

    const ranges = [] as Array<{ start: number; end: number }>;
    if (blocked.left > 0) {
      ranges.push({ start: 0, end: blocked.left });
    }
    if (blocked.right < hostWidth) {
      ranges.push({ start: blocked.right, end: hostWidth });
    }

    return ranges.length > 0 ? ranges : [{ start: 0, end: hostWidth }];
  }

  function syncBounds() {
    if (!host) {
      return;
    }

    const rect = host.getBoundingClientRect();
    hostWidth = Math.max(260, rect.width - 18);
    orbX = clamp(orbX, orbRadius + 4, hostWidth - orbRadius - 4);
    orbY = clamp(orbY, orbRadius + 4, hostHeight - orbRadius - 4);
  }

  function relayout() {
    if (!pretextApi || !prepared) {
      return;
    }

    const nextLines: RenderLine[] = [];
    let lineTop = 6;
    let safety = 0;
    let done = false;
    let cursor: Cursor = { segmentIndex: 0, graphemeIndex: 0 };

    while (!done && lineTop < 300 && safety < 240) {
      const ranges = allowedRanges(lineTop);
      let consumedRow = false;

      for (const range of ranges) {
        const width = range.end - range.start;
        if (width < 12) {
          continue;
        }

        const before = cursor;
        const line = pretextApi.layoutNextLine(prepared, cursor, width);

        if (!line) {
          done = true;
          break;
        }

        if (sameCursor(before, line.end)) {
          continue;
        }

        nextLines.push({
          x: range.start,
          y: lineTop,
          text: line.text
        });

        cursor = line.end;
        consumedRow = true;
      }

      if (!consumedRow && !done) {
        const fallback = pretextApi.layoutNextLine(prepared, cursor, hostWidth);
        if (!fallback || sameCursor(cursor, fallback.end)) {
          done = true;
        } else {
          nextLines.push({ x: 0, y: lineTop, text: fallback.text });
          cursor = fallback.end;
        }
      }

      lineTop += lineHeight;
      safety += 1;
    }

    lines = nextLines;
    hostHeight = Math.max(160, lineTop + 14);
  }

  function setOrbFromPointer(event: PointerEvent) {
    if (!host) {
      return;
    }

    const rect = host.getBoundingClientRect();
    orbX = clamp(event.clientX - rect.left - 9, orbRadius + 4, hostWidth - orbRadius - 4);
    orbY = clamp(event.clientY - rect.top - 8, orbRadius + 4, hostHeight - orbRadius - 4);
    relayout();
  }

  function onPointerDown(event: PointerEvent) {
    if (!(event.target instanceof HTMLElement) || !event.target.closest('.probe-orb')) {
      return;
    }

    dragging = true;
    setOrbFromPointer(event);
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragging) {
      return;
    }

    setOrbFromPointer(event);
  }

  function onPointerUp() {
    dragging = false;
  }

  onMount(async () => {
    syncBounds();

    try {
      const mod = (await import('@chenglou/pretext')) as PretextApi;
      pretextApi = mod;
      prepared = pretextApi.prepareWithSegments(text, font, { whiteSpace: 'normal' });
      status = 'ready';
      relayout();
    } catch {
      status = 'missing-package';
      lines = [
        {
          x: 0,
          y: 6,
          text: 'Install @chenglou/pretext to enable probe.'
        }
      ];
    }

    const resizeObserver = new ResizeObserver(() => {
      syncBounds();
      relayout();
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

<aside class="probe-shell" aria-label="Dadri text flow probe" on:pointerdown={onPointerDown}>
  <p class="probe-kicker">Dadri Pretext Probe {status === 'ready' ? '// active' : '// fallback'}</p>
  <div class="probe-canvas" bind:this={host} style={`--probe-height:${Math.ceil(hostHeight)}px; --orb-size:${orbRadius * 2}px;`}>
    {#each lines as line, idx (idx)}
      <span class="probe-line" style={`left:${line.x}px; top:${line.y}px;`}>{line.text}</span>
    {/each}

    <button
      type="button"
      class="probe-orb"
      aria-label="Drag probe orb"
      style={`left:${orbX - orbRadius}px; top:${orbY - orbRadius}px;`}
    >
      <span>{dragging ? 'move' : 'orb'}</span>
    </button>
  </div>
</aside>

<style>
  .probe-shell {
    position: fixed;
    left: 0.7rem;
    bottom: 0.7rem;
    width: min(360px, calc(100vw - 1.4rem));
    padding: 0.52rem 0.56rem 0.6rem;
    border: 1px solid color-mix(in srgb, var(--line) 70%, transparent);
    background: color-mix(in srgb, var(--surface) 93%, transparent);
    backdrop-filter: blur(5px);
    z-index: 110;
  }

  .probe-kicker {
    margin: 0 0 0.38rem;
    text-transform: uppercase;
    letter-spacing: 0.11em;
    font: 700 0.57rem/1 "IBM Plex Sans", "Segoe UI", sans-serif;
    color: color-mix(in srgb, var(--muted) 86%, var(--text));
  }

  .probe-canvas {
    position: relative;
    border: 1px solid color-mix(in srgb, var(--line) 62%, transparent);
    min-height: var(--probe-height);
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--surface) 94%, transparent), color-mix(in srgb, var(--surface) 82%, transparent)),
      radial-gradient(circle at 16% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 42%);
    overflow: clip;
    touch-action: none;
  }

  .probe-line {
    position: absolute;
    font: 500 0.84rem/1.6 "IBM Plex Sans", "Segoe UI", sans-serif;
    color: color-mix(in srgb, var(--text) 91%, transparent);
    letter-spacing: 0.01em;
    white-space: pre;
    pointer-events: none;
    user-select: none;
  }

  .probe-orb {
    position: absolute;
    width: var(--orb-size);
    height: var(--orb-size);
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--accent) 58%, var(--line));
    background:
      radial-gradient(circle at 32% 24%, color-mix(in srgb, var(--accent) 35%, transparent), transparent 58%),
      color-mix(in srgb, var(--surface) 95%, transparent);
    color: color-mix(in srgb, var(--accent) 90%, var(--text));
    font: 700 0.54rem/1 "IBM Plex Sans", "Segoe UI", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: grid;
    place-items: center;
    cursor: grab;
    box-shadow: 0 8px 20px color-mix(in srgb, black 18%, transparent);
  }

  .probe-orb:active {
    cursor: grabbing;
  }

  .probe-orb span {
    pointer-events: none;
  }

  @media (max-width: 700px) {
    .probe-shell {
      width: calc(100vw - 1rem);
      left: 0.5rem;
      bottom: 0.5rem;
    }
  }
</style>

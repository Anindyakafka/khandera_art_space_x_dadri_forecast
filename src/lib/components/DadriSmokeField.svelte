<script lang="ts">
  import { onMount } from 'svelte';

  type Cursor = { segmentIndex: number; graphemeIndex: number };
  type LayoutLine = { text: string; width: number; start: Cursor; end: Cursor };
  type PretextApi = {
    prepareWithSegments: (text: string, font: string, options?: { whiteSpace?: 'normal' | 'pre-wrap' }) => unknown;
    layoutNextLine: (prepared: unknown, start: Cursor, maxWidth: number) => LayoutLine | null;
  };

  type SmokeLine = {
    text: string;
    x: number;
    y: number;
    seed: number;
    alpha: number;
  };

  export let text = '';

  const FONT_SIZE = 11;
  const LINE_HEIGHT = 15;
  const FONT = `500 ${FONT_SIZE}px "IBM Plex Sans", "Segoe UI", sans-serif`;

  let host: HTMLDivElement | null = null;
  let canvas: HTMLCanvasElement | null = null;
  let pretextApi: PretextApi | null = null;
  let prepared: unknown = null;
  let lines: SmokeLine[] = [];
  let frameId: number | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let cssWidth = 0;
  let cssHeight = 0;
  let dpr = 1;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function buildCursorOffset(width: number, offset: number) {
    if (!pretextApi || !prepared) {
      return { segmentIndex: 0, graphemeIndex: 0 };
    }

    let cursor: Cursor = { segmentIndex: 0, graphemeIndex: 0 };

    for (let i = 0; i < offset; i += 1) {
      const next = pretextApi.layoutNextLine(prepared, cursor, width);
      if (!next) {
        return { segmentIndex: 0, graphemeIndex: 0 };
      }
      cursor = next.end;
    }

    return cursor;
  }

  function pushRegion(regionX: number, regionY: number, regionWidth: number, regionHeight: number, offset: number, alphaBase: number) {
    if (!pretextApi || !prepared) {
      return;
    }

    let cursor = buildCursorOffset(regionWidth, offset);
    let y = regionY;
    let safety = 0;

    while (y < regionY + regionHeight && safety < 180) {
      const line = pretextApi.layoutNextLine(prepared, cursor, regionWidth);

      if (!line) {
        cursor = { segmentIndex: 0, graphemeIndex: 0 };
        safety += 1;
        continue;
      }

      lines.push({
        text: line.text,
        x: regionX + Math.max(0, (regionWidth - line.width) * 0.08),
        y,
        seed: offset * 17 + safety * 11,
        alpha: alphaBase
      });

      cursor = line.end;
      y += LINE_HEIGHT;
      safety += 1;
    }
  }

  function relayout() {
    if (!host || !canvas) {
      return;
    }

    const rect = host.getBoundingClientRect();
    cssWidth = Math.max(320, rect.width);
    cssHeight = Math.max(220, rect.height);
    dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    lines = [];

    if (!pretextApi || !text.trim()) {
      return;
    }

    prepared = pretextApi.prepareWithSegments(text, FONT, { whiteSpace: 'normal' });

    const gutter = clamp(cssWidth * 0.18, 120, 210);
    const inset = clamp(cssWidth * 0.028, 12, 28);
    const topBand = Math.min(145, cssHeight * 0.34);
    const sideHeight = Math.max(120, cssHeight - 24);

    pushRegion(inset, 12, gutter, sideHeight, 0, 0.085);
    pushRegion(cssWidth - gutter - inset, 18, gutter, sideHeight, 18, 0.072);
    pushRegion(inset, 8, Math.min(220, gutter + 36), topBand, 34, 0.05);
    pushRegion(cssWidth - Math.min(220, gutter + 36) - inset, 10, Math.min(220, gutter + 36), topBand, 48, 0.048);
  }

  function draw(time: number) {
    if (!canvas) {
      frameId = null;
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      frameId = null;
      return;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    ctx.font = FONT;
    ctx.textBaseline = 'top';

    const t = time * 0.001;

    for (const line of lines) {
      const driftX = Math.sin(t * 0.62 + line.seed * 0.19 + line.y * 0.017) * 8 + Math.cos(t * 0.31 + line.seed * 0.07) * 2;
      const driftY = Math.cos(t * 0.44 + line.seed * 0.11 + line.x * 0.01) * 1.8;
      const pulse = 0.62 + 0.38 * Math.sin(t * 0.9 + line.seed * 0.13);
      const alpha = line.alpha * pulse;

      ctx.fillStyle = `rgba(220, 205, 190, ${alpha})`;
      ctx.fillText(line.text, line.x + driftX, line.y + driftY);

      ctx.fillStyle = `rgba(181, 106, 79, ${alpha * 0.7})`;
      ctx.fillText(line.text, line.x + driftX * 0.55, line.y + driftY * 0.65);
    }

    frameId = requestAnimationFrame(draw);
  }

  onMount(async () => {
    try {
      pretextApi = (await import('@chenglou/pretext')) as PretextApi;
    } catch {
      pretextApi = null;
    }

    relayout();

    resizeObserver = new ResizeObserver(() => {
      relayout();
    });

    if (host) {
      resizeObserver.observe(host);
    }

    frameId = requestAnimationFrame(draw);

    return () => {
      resizeObserver?.disconnect();
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  });
</script>

<div class="dadri-smoke" bind:this={host} aria-hidden="true">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .dadri-smoke {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
    opacity: 0.78;
    mix-blend-mode: screen;
    mask-image: radial-gradient(ellipse at 50% 44%, transparent 0 20%, black 52%);
    -webkit-mask-image: radial-gradient(ellipse at 50% 44%, transparent 0 20%, black 52%);
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    filter: blur(0.2px);
  }
</style>

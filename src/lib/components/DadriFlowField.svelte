<script lang="ts">
  import { onMount } from 'svelte';

  type PreparedChar = { widths?: number[] };
  type PretextApi = {
    prepareWithSegments: (text: string, font: string, options?: { whiteSpace?: 'normal' | 'pre-wrap' }) => PreparedChar;
  };

  type PaletteEntry = {
    char: string;
    weight: 300 | 500 | 800;
    style: 'normal' | 'italic';
    width: number;
    brightness: number;
  };

  type Emitter = {
    cx: number;
    cy: number;
    orbitX: number;
    orbitY: number;
    freq: number;
    phase: number;
    strength: number;
  };

  export let text = '';

  const FONT_SIZE = 14;
  const LINE_HEIGHT = 18;
  const FAMILY = '"IBM Plex Sans", "Segoe UI", sans-serif';
  const FONT_STYLES = ['normal', 'italic'] as const;
  const WEIGHTS = [300, 500, 800] as const;
  const MAX_COLS = 84;
  const MAX_ROWS = 32;
  const MIN_COLS = 42;
  const MIN_ROWS = 18;
  const SPACE_W = FONT_SIZE * 0.28;
  const CHARSET_FALLBACK = '.,:;!+-=*#@%&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const emitters: Emitter[] = [
    { cx: 0.08, cy: 0.18, orbitX: 0.06, orbitY: 0.09, freq: 0.22, phase: 0.0, strength: 0.26 },
    { cx: 0.92, cy: 0.16, orbitX: 0.06, orbitY: 0.09, freq: 0.25, phase: 1.7, strength: 0.26 },
    { cx: 0.12, cy: 0.72, orbitX: 0.05, orbitY: 0.07, freq: 0.19, phase: 3.1, strength: 0.16 },
    { cx: 0.88, cy: 0.68, orbitX: 0.05, orbitY: 0.07, freq: 0.24, phase: 4.4, strength: 0.16 },
    { cx: 0.5, cy: 0.08, orbitX: 0.2, orbitY: 0.03, freq: 0.15, phase: 0.8, strength: 0.11 }
  ];

  let host: HTMLDivElement | null = null;
  let artEl: HTMLDivElement | null = null;
  let pretextApi: PretextApi | null = null;
  let rowEls: HTMLDivElement[] = [];
  let palette: PaletteEntry[] = [];
  let density = new Float32Array(0);
  let tempDensity = new Float32Array(0);
  let cols = 0;
  let rows = 0;
  let avgCharW = FONT_SIZE * 0.58;
  let aspect = avgCharW / LINE_HEIGHT;
  let aspect2 = aspect * aspect;
  let frameId: number | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let probeCanvas: HTMLCanvasElement | null = null;
  let probeCtx: CanvasRenderingContext2D | null = null;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function ensureProbeContext() {
    if (!probeCanvas) {
      probeCanvas = document.createElement('canvas');
      probeCanvas.width = 32;
      probeCanvas.height = 32;
      probeCtx = probeCanvas.getContext('2d', { willReadFrequently: true });
    }
  }

  function estimateBrightness(char: string, font: string) {
    ensureProbeContext();

    if (!probeCtx) {
      return 0;
    }

    probeCtx.clearRect(0, 0, 32, 32);
    probeCtx.font = font;
    probeCtx.fillStyle = '#fff';
    probeCtx.textBaseline = 'middle';
    probeCtx.fillText(char, 2, 16);

    const pixels = probeCtx.getImageData(0, 0, 32, 32).data;
    let sum = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      sum += pixels[i];
    }

    return sum / (255 * 32 * 32);
  }

  function measureCharWidth(char: string, font: string) {
    ensureProbeContext();

    if (!probeCtx) {
      return FONT_SIZE * 0.62;
    }

    probeCtx.font = font;
    const width = probeCtx.measureText(char).width;
    return width > 0 ? width : FONT_SIZE * 0.62;
  }

  function buildCharset(source: string) {
    const merged = Array.from(new Set((CHARSET_FALLBACK + source).replace(/\s+/g, '')));
    return merged.join('');
  }

  function buildPalette() {
    const charset = buildCharset(text);
    const next: PaletteEntry[] = [];

    for (const style of FONT_STYLES) {
      for (const weight of WEIGHTS) {
        const font = `${style === 'italic' ? 'italic ' : ''}${weight} ${FONT_SIZE}px ${FAMILY}`;

        for (const char of charset) {
          if (char === ' ') {
            continue;
          }

          const pretextWidth = pretextApi ? (pretextApi.prepareWithSegments(char, font).widths?.[0] ?? 0) : 0;
          const width = pretextWidth > 0 ? pretextWidth : measureCharWidth(char, font);

          next.push({
            char,
            weight,
            style,
            width,
            brightness: estimateBrightness(char, font)
          });
        }
      }
    }

    const maxBrightness = Math.max(...next.map((entry) => entry.brightness), 1);
    palette = next
      .map((entry) => ({ ...entry, brightness: entry.brightness / maxBrightness }))
      .sort((a, b) => a.brightness - b.brightness);

    avgCharW = palette.reduce((sum, entry) => sum + entry.width, 0) / Math.max(1, palette.length);
    aspect = avgCharW / LINE_HEIGHT;
    aspect2 = aspect * aspect;
  }

  function weightClass(weight: number) {
    return weight === 300 ? 'w3' : weight === 500 ? 'w5' : 'w8';
  }

  function escapeHtml(char: string) {
    if (char === '&') return '&amp;';
    if (char === '<') return '&lt;';
    if (char === '>') return '&gt;';
    return char;
  }

  function findBest(targetBrightness: number, targetWidth: number) {
    if (palette.length === 0) {
      return null;
    }

    let lo = 0;
    let hi = palette.length - 1;

    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (palette[mid].brightness < targetBrightness) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }

    let best = palette[lo];
    let bestScore = Infinity;

    for (let i = Math.max(0, lo - 14); i < Math.min(palette.length, lo + 14); i += 1) {
      const entry = palette[i];
      const score = Math.abs(entry.brightness - targetBrightness) * 2.4 + Math.abs(entry.width - targetWidth) / Math.max(1, targetWidth);

      if (score < bestScore) {
        bestScore = score;
        best = entry;
      }
    }

    return best;
  }

  function initGrid() {
    if (!host || !artEl) {
      return;
    }

    cols = Math.min(MAX_COLS, Math.max(MIN_COLS, Math.floor(host.clientWidth / Math.max(avgCharW, 6))));
    rows = Math.min(MAX_ROWS, Math.max(MIN_ROWS, Math.floor(host.clientHeight / LINE_HEIGHT)));

    density = new Float32Array(cols * rows);
    tempDensity = new Float32Array(cols * rows);

    artEl.innerHTML = '';
    rowEls = [];

    for (let r = 0; r < rows; r += 1) {
      const row = document.createElement('div');
      row.className = 'r';
      row.style.height = `${LINE_HEIGHT}px`;
      row.style.lineHeight = `${LINE_HEIGHT}px`;
      artEl.appendChild(row);
      rowEls.push(row);
    }
  }

  function edgeFactor(c: number, r: number) {
    const nx = c / Math.max(1, cols - 1);
    const ny = r / Math.max(1, rows - 1);
    const side = clamp((Math.abs(nx - 0.5) * 2 - 0.08) / 0.92, 0, 1);
    const top = clamp((0.42 - ny) / 0.42, 0, 1) * 0.72;
    const cornerLift = clamp((Math.abs(nx - 0.5) * 1.6 + (0.34 - ny)) * 0.9, 0, 1);
    const holeX = Math.abs(nx - 0.5) / 0.19;
    const holeY = Math.abs(ny - 0.46) / 0.26;
    const centerHole = clamp(Math.max(holeX, holeY) - 0.78, 0, 1);
    return clamp(Math.max(side, top, cornerLift) * centerHole, 0, 1);
  }

  function getVelocity(c: number, r: number, time: number) {
    const nx = c / Math.max(1, cols - 1);
    const ny = r / Math.max(1, rows - 1);

    let vx =
      Math.sin(ny * 6.2 + time * 0.35) * 1.65 +
      Math.cos((nx + ny) * 11.4 + time * 0.48) * 0.72 +
      Math.sin(nx * 18 - ny * 14 + time * 0.86) * 0.24;

    let vy =
      -0.42 +
      Math.cos(nx * 4.8 + time * 0.39) * 0.82 +
      Math.sin((nx - ny) * 9.6 + time * 0.44) * 0.58;

    vy *= aspect;
    return [vx, vy];
  }

  function updateSimulation(time: number) {
    if (cols === 0 || rows === 0) {
      return;
    }

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const [vx, vy] = getVelocity(c, r, time);
        const sx = clamp(c - vx, 0, cols - 1.001);
        const sy = clamp(r - vy, 0, rows - 1.001);
        const x0 = sx | 0;
        const y0 = sy | 0;
        const x1 = Math.min(x0 + 1, cols - 1);
        const y1 = Math.min(y0 + 1, rows - 1);
        const fx = sx - x0;
        const fy = sy - y0;

        tempDensity[r * cols + c] =
          density[y0 * cols + x0] * (1 - fx) * (1 - fy) +
          density[y0 * cols + x1] * fx * (1 - fy) +
          density[y1 * cols + x0] * (1 - fx) * fy +
          density[y1 * cols + x1] * fx * fy;
      }
    }

    [density, tempDensity] = [tempDensity, density];

    for (let r = 1; r < rows - 1; r += 1) {
      for (let c = 1; c < cols - 1; c += 1) {
        const i = r * cols + c;
        const avg = (density[i - 1] + density[i + 1] + (density[i - cols] + density[i + cols]) * aspect2) / (2 + 2 * aspect2);
        tempDensity[i] = density[i] * 0.915 + avg * 0.085;
      }
    }

    [density, tempDensity] = [tempDensity, density];

    const spread = 4;
    for (const emitter of emitters) {
      const ex = (emitter.cx + Math.cos(time * emitter.freq + emitter.phase) * emitter.orbitX) * cols;
      const ey = (emitter.cy + Math.sin(time * emitter.freq * 0.78 + emitter.phase) * emitter.orbitY) * rows;
      const ec = ex | 0;
      const er = ey | 0;

      for (let dr = -spread; dr <= spread; dr += 1) {
        for (let dc = -spread; dc <= spread; dc += 1) {
          const rr = er + dr;
          const cc = ec + dc;

          if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
            const dist = Math.sqrt(dc * dc + (dr / Math.max(aspect, 0.001)) ** 2);
            const strength = Math.max(0, 1 - dist / (spread + 1));
            density[rr * cols + cc] = Math.min(1, density[rr * cols + cc] + strength * emitter.strength * edgeFactor(cc, rr));
          }
        }
      }
    }

    for (let i = 0; i < density.length; i += 1) {
      density[i] *= 0.985;
    }
  }

  function render(now: number) {
    const time = now / 1000;
    updateSimulation(time);

    if (palette.length > 0 && cols > 0) {
      const cellWidth = (host?.clientWidth ?? cols * avgCharW) / cols;

      for (let r = 0; r < rows; r += 1) {
        let html = '';

        for (let c = 0; c < cols; c += 1) {
          const densityValue = density[r * cols + c] * edgeFactor(c, r);

          if (densityValue < 0.016) {
            html += ' ';
            continue;
          }

          const entry = findBest(densityValue, cellWidth);
          if (!entry) {
            html += ' ';
            continue;
          }

          const alphaIndex = Math.max(1, Math.min(10, Math.round(densityValue * 10)));
          const classes = `${weightClass(entry.weight)}${entry.style === 'italic' ? ' it' : ''} a${alphaIndex}`;
          html += `<span class="${classes}">${escapeHtml(entry.char)}</span>`;
        }

        const rowEl = rowEls[r];
        if (rowEl) {
          rowEl.innerHTML = html;
          rowEl.style.paddingLeft = `${Math.max(0, Math.sin(time * 0.32 + r * 0.27) * 4 + 2)}px`;
        }
      }
    }

    frameId = requestAnimationFrame(render);
  }

  onMount(async () => {
    try {
      pretextApi = (await import('@chenglou/pretext')) as PretextApi;
    } catch {
      pretextApi = null;
    }

    buildPalette();
    initGrid();

    resizeObserver = new ResizeObserver(() => {
      initGrid();
    });

    if (host) {
      resizeObserver.observe(host);
    }

    frameId = requestAnimationFrame(render);

    return () => {
      resizeObserver?.disconnect();
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  });
</script>

<div class="dadri-field-shell">
  <div class="dadri-smoke" bind:this={host} aria-hidden="true">
    <div class="art" bind:this={artEl}></div>
  </div>

  <div class="dadri-content">
    <slot />
  </div>
</div>

<style>
  .dadri-field-shell {
    position: relative;
    min-height: 100%;
    isolation: isolate;
  }

  .dadri-content {
    position: relative;
    z-index: 2;
  }

  .dadri-smoke {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
    opacity: 1;
    mix-blend-mode: normal;
    mask-image: radial-gradient(ellipse at 50% 46%, transparent 0 14%, rgba(0, 0, 0, 0.55) 24%, black 48%);
    -webkit-mask-image: radial-gradient(ellipse at 50% 46%, transparent 0 14%, rgba(0, 0, 0, 0.55) 24%, black 48%);
  }

  .art {
    position: absolute;
    inset: 0;
    padding: 0.2rem 0;
    font-size: 14px;
    overflow: hidden;
    user-select: none;
    text-rendering: geometricPrecision;
    filter: blur(0.15px);
  }

  .r {
    white-space: pre;
    font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
    letter-spacing: 0;
  }

  .w3 {
    font-weight: 300;
  }

  .w5 {
    font-weight: 500;
  }

  .w8 {
    font-weight: 800;
  }

  .it {
    font-style: italic;
  }

  .a1 { color: rgba(225, 214, 202, 0.12); }
  .a2 { color: rgba(226, 208, 193, 0.17); }
  .a3 { color: rgba(228, 202, 184, 0.24); }
  .a4 { color: rgba(231, 192, 170, 0.32); }
  .a5 { color: rgba(233, 181, 156, 0.41); }
  .a6 { color: rgba(236, 168, 141, 0.5); }
  .a7 { color: rgba(238, 155, 126, 0.6); }
  .a8 { color: rgba(240, 143, 112, 0.7); }
  .a9 { color: rgba(242, 132, 99, 0.8); }
  .a10 {
    color: rgba(245, 124, 90, 0.9);
    text-shadow: 0 0 12px rgba(245, 124, 90, 0.24);
  }

  @media (prefers-reduced-motion: reduce) {
    .dadri-smoke {
      display: none;
    }
  }
</style>

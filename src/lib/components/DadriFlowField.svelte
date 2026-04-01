<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';

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

  type ActiveParagraph = {
    el: HTMLElement;
    originalText: string;
    originalPosition: string;
    originalMinHeight: string;
    prepared: unknown;
    lineHeight: number;
  };

  // 20% larger than previous 29px
  const ORB_D = 35;
  const ORB_R = ORB_D / 2;
  const HIT_PAD = 5;
  const INNER_GAP = 4;
  const LAYOUT_INTERVAL_MS = 34;
  const LAYOUT_MOVE_THRESHOLD = 2;
  const ORB_LERP = 0.34;

  let mounted = false;
  let orbVisible = false;
  let orbX = -2000;
  let orbY = -2000;
  let pointerX = -2000;
  let pointerY = -2000;

  let pretextApi: PretextApi | null = null;
  let activeParagraph: ActiveParagraph | null = null;
  let loopRaf: number | null = null;
  let lastLayoutTime = 0;
  let lastLayoutX = -9999;
  let lastLayoutY = -9999;
  let lastLayoutSignature = '';

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function parseLineHeight(style: CSSStyleDeclaration) {
    const raw = style.lineHeight;
    if (!raw || raw === 'normal') {
      const fs = Number.parseFloat(style.fontSize);
      return Number.isFinite(fs) ? fs * 1.62 : 24;
    }

    const lh = Number.parseFloat(raw);
    if (Number.isFinite(lh)) {
      return lh;
    }

    const fs = Number.parseFloat(style.fontSize);
    return Number.isFinite(fs) ? fs * 1.62 : 24;
  }

  function sameCursor(a: Cursor, b: Cursor) {
    return a.segmentIndex === b.segmentIndex && a.graphemeIndex === b.graphemeIndex;
  }

  function isEligibleText(el: Element | null): el is HTMLElement {
    if (!el) return false;
    if (!el.matches('p, li, blockquote')) return false;
    if (!(el instanceof HTMLElement)) return false;
    if (el.childElementCount > 0) return false;
    if (
      el.closest('nav') ||
      el.closest('header') ||
      el.closest('button') ||
      el.closest('a') ||
      el.closest('footer') ||
      el.closest('.title-screen') ||
      el.closest('.route-links') ||
      el.closest('.warning-bar') ||
      el.closest('.section-no')
    ) {
      return false;
    }

    if (el.closest('a, button, [role="button"], [role="link"]')) {
      return false;
    }

    return (el.textContent?.trim().length ?? 0) > 30;
  }

  function getFontShorthand(style: CSSStyleDeclaration) {
    const weight = style.fontWeight || '400';
    const size = style.fontSize || '16px';
    const family = style.fontFamily || 'serif';
    return `${weight} ${size} ${family}`;
  }

  function restoreActiveParagraph() {
    if (!activeParagraph) {
      return;
    }

    activeParagraph.el.textContent = activeParagraph.originalText;
    activeParagraph.el.style.position = activeParagraph.originalPosition;
    activeParagraph.el.style.minHeight = activeParagraph.originalMinHeight;
    activeParagraph = null;
    lastLayoutSignature = '';
  }

  function setActiveParagraph(el: HTMLElement) {
    if (!pretextApi) {
      return;
    }

    if (activeParagraph?.el === el) {
      return;
    }

    restoreActiveParagraph();

    const style = getComputedStyle(el);
    const text = (el.textContent ?? '').trim();
    const prepared = pretextApi.prepareWithSegments(text, getFontShorthand(style), { whiteSpace: 'normal' });

    activeParagraph = {
      el,
      originalText: el.textContent ?? '',
      originalPosition: el.style.position,
      originalMinHeight: el.style.minHeight,
      prepared,
      lineHeight: parseLineHeight(style)
    };

    el.style.position = 'relative';
    el.style.minHeight = `${Math.ceil(activeParagraph.lineHeight)}px`;
  }

  // --- Layout ---

  function hitsOrb(cx: number, cy: number, rect: DOMRect): boolean {
    const nx = Math.max(rect.left, Math.min(cx, rect.right));
    const ny = Math.max(rect.top, Math.min(cy, rect.bottom));
    const dx = cx - nx;
    const dy = cy - ny;
    return dx * dx + dy * dy < (ORB_R + HIT_PAD) * (ORB_R + HIT_PAD);
  }

  function blockedRange(rect: DOMRect, lineMidY: number) {
    const localMidY = lineMidY - rect.top;
    const cyLocal = orbY - rect.top;
    const dy = Math.abs(localMidY - cyLocal);

    if (dy >= ORB_R) {
      return null;
    }

    const dx = Math.sqrt(ORB_R * ORB_R - dy * dy) + INNER_GAP;
    const cxLocal = orbX - rect.left;

    return {
      left: clamp(cxLocal - dx, 0, rect.width),
      right: clamp(cxLocal + dx, 0, rect.width)
    };
  }

  function renderActiveLayout() {
    if (!pretextApi || !activeParagraph) {
      return;
    }

    const { el, prepared, lineHeight } = activeParagraph;
    const rect = el.getBoundingClientRect();

    if (!hitsOrb(orbX, orbY, rect)) {
      restoreActiveParagraph();
      return;
    }

    const frag = document.createDocumentFragment();
    const sig: string[] = [];
    let lineTop = 0;
    let safety = 0;
    let done = false;
    let cursor: Cursor = { segmentIndex: 0, graphemeIndex: 0 };

    while (!done && safety < 320 && lineTop <= 1800) {
      const rowMidY = rect.top + lineTop + lineHeight * 0.5;
      const blocked = blockedRange(rect, rowMidY);
      const ranges: Array<{ start: number; end: number }> = [];

      if (!blocked) {
        ranges.push({ start: 0, end: rect.width });
      } else {
        if (blocked.left > 6) {
          ranges.push({ start: 0, end: blocked.left });
        }
        if (blocked.right < rect.width - 6) {
          ranges.push({ start: blocked.right, end: rect.width });
        }
      }

      let consumed = false;

      for (const range of ranges) {
        const width = range.end - range.start;
        if (width < 10) {
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

        const left = Math.round(range.start);
        const top = Math.round(lineTop);
        sig.push(`${left}|${top}|${line.text}`);

        const span = document.createElement('span');
        span.className = 'dadri-flow-line';
        span.style.left = `${left}px`;
        span.style.top = `${top}px`;
        span.textContent = line.text;
        frag.appendChild(span);

        cursor = line.end;
        consumed = true;
      }

      if (!consumed && !done) {
        const fallback = pretextApi.layoutNextLine(prepared, cursor, rect.width);
        if (!fallback || sameCursor(cursor, fallback.end)) {
          done = true;
        } else {
          const top = Math.round(lineTop);
          sig.push(`0|${top}|${fallback.text}`);
          const span = document.createElement('span');
          span.className = 'dadri-flow-line';
          span.style.left = '0px';
          span.style.top = `${top}px`;
          span.textContent = fallback.text;
          frag.appendChild(span);
          cursor = fallback.end;
        }
      }

      lineTop += lineHeight;
      safety += 1;
    }

    const signature = sig.join('\n');
    if (signature === lastLayoutSignature) {
      return;
    }

    lastLayoutSignature = signature;
    el.textContent = '';
    el.appendChild(frag);
    el.style.minHeight = `${Math.max(lineHeight, lineTop)}px`;
  }

  function clearAll() {
    restoreActiveParagraph();
  }

  function runFrame(now: number) {
    if (!orbVisible) {
      loopRaf = null;
      return;
    }

    orbX += (pointerX - orbX) * ORB_LERP;
    orbY += (pointerY - orbY) * ORB_LERP;

    if (Math.abs(pointerX - orbX) < 0.25) orbX = pointerX;
    if (Math.abs(pointerY - orbY) < 0.25) orbY = pointerY;

    const moved = Math.hypot(orbX - lastLayoutX, orbY - lastLayoutY) >= LAYOUT_MOVE_THRESHOLD;
    const due = now - lastLayoutTime >= LAYOUT_INTERVAL_MS;

    if (activeParagraph && moved && due) {
      renderActiveLayout();
      lastLayoutX = orbX;
      lastLayoutY = orbY;
      lastLayoutTime = now;
    }

    loopRaf = requestAnimationFrame(runFrame);
  }

  function ensureLoop() {
    if (loopRaf !== null) {
      return;
    }

    loopRaf = requestAnimationFrame(runFrame);
  }

  // --- Event handlers ---

  function onMouseMove(e: MouseEvent) {
    if (!pretextApi) {
      return;
    }

    const hovered = document.elementFromPoint(e.clientX, e.clientY)?.closest('p, li, blockquote') ?? null;

    if (!isEligibleText(hovered)) {
      orbVisible = false;
      pointerX = -2000;
      pointerY = -2000;
      orbX = -2000;
      orbY = -2000;
      clearAll();
      return;
    }

    setActiveParagraph(hovered);
    orbVisible = true;
    pointerX = e.clientX;
    pointerY = e.clientY;

    if (orbX < -1000 || orbY < -1000) {
      orbX = pointerX;
      orbY = pointerY;
    }

    ensureLoop();
  }

  function onMouseLeave() {
    orbVisible = false;
    pointerX = -2000;
    pointerY = -2000;
    orbX = -2000;
    orbY = -2000;
    clearAll();
    if (loopRaf !== null) {
      cancelAnimationFrame(loopRaf);
      loopRaf = null;
    }
  }

  // --- Lifecycle ---

  afterNavigate(() => {
    orbVisible = false;
    pointerX = -2000;
    pointerY = -2000;
    orbX = -2000;
    orbY = -2000;
    clearAll();
    if (loopRaf !== null) {
      cancelAnimationFrame(loopRaf);
      loopRaf = null;
    }
  });

  onMount(async () => {
    mounted = true;

    try {
      pretextApi = (await import('@chenglou/pretext')) as PretextApi;
    } catch {
      pretextApi = null;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    return () => {
      mounted = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      clearAll();
      if (loopRaf !== null) {
        cancelAnimationFrame(loopRaf);
        loopRaf = null;
      }
    };
  });
</script>

<div class="dadri-shell">
  <slot />
</div>

{#if mounted && orbVisible}
  <div
    class="dadri-orb"
    aria-hidden="true"
    style="left:{orbX}px;top:{orbY}px;"
  ></div>
{/if}

<style>
  .dadri-shell {
    width: 100%;
  }

  .dadri-shell :global(.dadri-flow-line) {
    position: absolute;
    white-space: pre;
    pointer-events: none;
    color: inherit;
    font: inherit;
    line-height: inherit;
  }

  .dadri-orb {
    position: fixed;
    width: 29px;
    height: 29px;
    transform: translate(-50%, -50%);
    border-radius: 999px;
    pointer-events: none;
    z-index: 8000;
    border: 1px solid color-mix(in srgb, var(--accent) 58%, var(--line));
    background:
      radial-gradient(
        circle at 34% 24%,
        color-mix(in srgb, var(--accent) 38%, transparent),
        transparent 60%
      ),
      color-mix(in srgb, var(--surface) 88%, transparent);
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--line) 38%, transparent),
      0 3px 8px color-mix(in srgb, black 16%, transparent);
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';

  // ---- types ----
  type Cursor = { segmentIndex: number; graphemeIndex: number };
  type LayoutLine = { text: string; width: number; start: Cursor; end: Cursor };
  type PretextApi = {
    prepareWithSegments: (text: string, font: string, options?: { whiteSpace?: 'normal' | 'pre-wrap' }) => unknown;
    layoutNextLine: (prepared: unknown, start: Cursor, maxWidth: number) => LayoutLine | null;
  };

  type ActiveParagraph = {
    el: HTMLElement;
    prepared: unknown;
    lineHeight: number;
    overlay: HTMLDivElement;
    pool: HTMLSpanElement[];
    textColor: string;
    originalColor: string;
    originalPosition: string;
    rect: DOMRect;
    scrollY: number;
  };

  const ORB_D = 35;
  const ORB_R = ORB_D / 2;
  const HIT_PAD = 8;
  const INNER_GAP = 4;
  const ORB_LERP = 0.22;

  let mounted = false;
  let orbVisible = false;
  let orbX = -2000;
  let orbY = -2000;
  let pointerX = -2000;
  let pointerY = -2000;

  let pretextApi: PretextApi | null = null;
  let activeParagraph: ActiveParagraph | null = null;
  let loopRaf: number | null = null;

  function clamp(v: number, lo: number, hi: number) {
    return Math.min(Math.max(v, lo), hi);
  }

  function parseLineHeight(style: CSSStyleDeclaration) {
    const fs = parseFloat(style.fontSize);
    const raw = style.lineHeight;
    if (!raw || raw === 'normal') return isFinite(fs) ? fs * 1.6 : 24;
    const lh = parseFloat(raw);
    return isFinite(lh) ? lh : (isFinite(fs) ? fs * 1.6 : 24);
  }

  function sameCursor(a: Cursor, b: Cursor) {
    return a.segmentIndex === b.segmentIndex && a.graphemeIndex === b.graphemeIndex;
  }

  function isEligibleText(el: Element | null): el is HTMLElement {
    if (!el || !(el instanceof HTMLElement)) return false;
    if (!el.matches('p, li, blockquote')) return false;
    if (el.childElementCount > 0) return false;
    if (el.closest('nav, header, button, a, footer, .title-screen, .route-links, .warning-bar, .section-no')) return false;
    if (el.closest('[role="button"], [role="link"]')) return false;
    return (el.textContent?.trim().length ?? 0) > 30;
  }

  function getFontShorthand(style: CSSStyleDeclaration) {
    return `${style.fontWeight || '400'} ${style.fontSize || '16px'} ${style.fontFamily || 'serif'}`;
  }

  function restoreActiveParagraph() {
    if (!activeParagraph) return;
    activeParagraph.el.style.color = activeParagraph.originalColor;
    activeParagraph.el.style.position = activeParagraph.originalPosition;
    activeParagraph.overlay.remove();
    activeParagraph = null;
  }

  function setActiveParagraph(el: HTMLElement) {
    if (!pretextApi) return;

    if (activeParagraph?.el === el) {
      // invalidate cached rect if user has scrolled
      if (Math.abs(window.scrollY - activeParagraph.scrollY) > 4) {
        activeParagraph.rect = el.getBoundingClientRect();
        activeParagraph.scrollY = window.scrollY;
      }
      return;
    }

    restoreActiveParagraph();

    const style = getComputedStyle(el);
    const text = (el.textContent ?? '').trim();
    const prepared = pretextApi.prepareWithSegments(text, getFontShorthand(style), { whiteSpace: 'normal' });

    const originalPosition = el.style.position;
    const originalColor = el.style.color;
    const textColor = style.color;

    if (!['relative', 'absolute', 'fixed', 'sticky'].includes(getComputedStyle(el).position)) {
      el.style.position = 'relative';
    }
    // hide original text — overlay renders its own spans on top
    el.style.color = 'transparent';

    const overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = 'position:absolute;top:0;left:0;right:0;pointer-events:none;overflow:visible;';
    el.appendChild(overlay);

    activeParagraph = {
      el, prepared,
      lineHeight: parseLineHeight(style),
      overlay, pool: [],
      textColor, originalColor, originalPosition,
      rect: el.getBoundingClientRect(),
      scrollY: window.scrollY,
    };
  }

  function hitsOrb(cx: number, cy: number, rect: DOMRect): boolean {
    const nx = clamp(cx, rect.left, rect.right);
    const ny = clamp(cy, rect.top, rect.bottom);
    return (cx - nx) ** 2 + (cy - ny) ** 2 < (ORB_R + HIT_PAD) ** 2;
  }

  function blockedRange(rect: DOMRect, lineMidY: number) {
    const dy = Math.abs(lineMidY - orbY);
    if (dy >= ORB_R) return null;
    const dx = Math.sqrt(ORB_R * ORB_R - dy * dy) + INNER_GAP;
    const cx = orbX - rect.left;
    return {
      left: clamp(cx - dx, 0, rect.width),
      right: clamp(cx + dx, 0, rect.width),
    };
  }

  function renderActiveLayout() {
    if (!pretextApi || !activeParagraph) return;
    const { prepared, lineHeight, overlay, pool, rect, textColor } = activeParagraph;

    if (!hitsOrb(orbX, orbY, rect)) {
      restoreActiveParagraph();
      return;
    }

    let poolIdx = 0;
    let lineTop = 0;
    let done = false;
    let safety = 0;
    let cursor: Cursor = { segmentIndex: 0, graphemeIndex: 0 };

    while (!done && safety < 400 && lineTop < 2000) {
      const lineMidY = rect.top + lineTop + lineHeight * 0.5;
      const blocked = blockedRange(rect, lineMidY);
      const ranges: { start: number; end: number }[] = [];

      if (!blocked) {
        ranges.push({ start: 0, end: rect.width });
      } else {
        if (blocked.left > 6) ranges.push({ start: 0, end: blocked.left });
        if (blocked.right < rect.width - 6) ranges.push({ start: blocked.right, end: rect.width });
      }

      let consumed = false;

      for (const range of ranges) {
        const w = range.end - range.start;
        if (w < 10) continue;
        const before = cursor;
        const line = pretextApi.layoutNextLine(prepared, cursor, w);
        if (!line) { done = true; break; }
        if (sameCursor(before, line.end)) continue;

        // reuse pooled span — no createElement cost per frame
        let span = pool[poolIdx];
        if (!span) {
          span = document.createElement('span');
          pool.push(span);
          overlay.appendChild(span);
        }
        if (span.textContent !== line.text) span.textContent = line.text;
        const nl = Math.round(range.start);
        const nt = Math.round(lineTop);
        span.style.cssText = `position:absolute;white-space:pre;pointer-events:none;color:${textColor};font:inherit;left:${nl}px;top:${nt}px;display:block;`;
        poolIdx++;
        cursor = line.end;
        consumed = true;
      }

      if (!consumed && !done) {
        const fallback = pretextApi.layoutNextLine(prepared, cursor, rect.width);
        if (!fallback || sameCursor(cursor, fallback.end)) {
          done = true;
        } else {
          let span = pool[poolIdx];
          if (!span) {
            span = document.createElement('span');
            pool.push(span);
            overlay.appendChild(span);
          }
          if (span.textContent !== fallback.text) span.textContent = fallback.text;
          const nt = Math.round(lineTop);
          span.style.cssText = `position:absolute;white-space:pre;pointer-events:none;color:${textColor};font:inherit;left:0px;top:${nt}px;display:block;`;
          poolIdx++;
          cursor = fallback.end;
        }
      }

      lineTop += lineHeight;
      safety++;
    }

    // hide surplus pool spans rather than removing them
    for (let i = poolIdx; i < pool.length; i++) {
      if (pool[i].style.display !== 'none') pool[i].style.display = 'none';
    }

    overlay.style.minHeight = `${Math.max(lineHeight, lineTop)}px`;
  }

  function clearAll() {
    restoreActiveParagraph();
  }

  function stopLoop() {
    if (loopRaf !== null) { cancelAnimationFrame(loopRaf); loopRaf = null; }
  }

  function runFrame() {
    if (!orbVisible) { loopRaf = null; return; }

    orbX += (pointerX - orbX) * ORB_LERP;
    orbY += (pointerY - orbY) * ORB_LERP;
    if (Math.abs(pointerX - orbX) < 0.3) orbX = pointerX;
    if (Math.abs(pointerY - orbY) < 0.3) orbY = pointerY;

    if (activeParagraph) renderActiveLayout();

    loopRaf = requestAnimationFrame(runFrame);
  }

  function onMouseMove(e: MouseEvent) {
    if (!pretextApi) return;
    const hovered = document.elementFromPoint(e.clientX, e.clientY)?.closest('p, li, blockquote') ?? null;

    if (!isEligibleText(hovered)) {
      if (orbVisible) {
        orbVisible = false;
        pointerX = -2000; pointerY = -2000;
        orbX = -2000; orbY = -2000;
        clearAll();
        stopLoop();
      }
      return;
    }

    setActiveParagraph(hovered);
    pointerX = e.clientX;
    pointerY = e.clientY;

    if (!orbVisible) {
      orbX = pointerX; orbY = pointerY;
      orbVisible = true;
    }

    if (loopRaf === null) loopRaf = requestAnimationFrame(runFrame);
  }

  function onMouseLeave() {
    orbVisible = false;
    pointerX = -2000; pointerY = -2000;
    orbX = -2000; orbY = -2000;
    clearAll();
    stopLoop();
  }

  afterNavigate(() => {
    orbVisible = false;
    pointerX = -2000; pointerY = -2000;
    orbX = -2000; orbY = -2000;
    clearAll();
    stopLoop();
  });

  onMount(async () => {
    mounted = true;
    try { pretextApi = (await import('@chenglou/pretext')) as PretextApi; }
    catch { pretextApi = null; }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    return () => {
      mounted = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      clearAll();
      stopLoop();
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

  .dadri-orb {
    position: fixed;
    width: 35px;
    height: 35px;
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


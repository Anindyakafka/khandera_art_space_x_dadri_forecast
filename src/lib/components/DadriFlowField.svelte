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

  type Segment = {
    text: string;
    x: number;
    y: number;
  };

  type LayoutResult = {
    segments: Segment[];
    height: number;
  };

  type PretextApi = {
    prepareWithSegments: (text: string, font: string, options?: { whiteSpace?: 'normal' | 'pre-wrap' }) => unknown;
    layoutNextLine: (prepared: unknown, start: Cursor, maxWidth: number) => LayoutLine | null;
  };

  const ORB_SIZE = 58;
  const ORB_RADIUS = ORB_SIZE / 2;
  const MIN_COPY_LENGTH = 48;
  const MAX_LAYOUT_HEIGHT = 1400;
  const BLOCK_SELECTOR = 'p, li, blockquote, [data-flow-copy], .dadri-flow-orb';
  const IGNORE_SELECTOR =
    '[data-flow-ignore], .section-no, .kicker, .warning-bar, .label, .jump-link, .download-row';

  let shell: HTMLDivElement | null = null;
  let contentEl: HTMLDivElement | null = null;
  let orbEl: HTMLButtonElement | null = null;
  let lineLayerEl: HTMLDivElement | null = null;
  let activeBlock: HTMLElement | null = null;
  let pretextApi: PretextApi | null = null;
  let prepared: unknown = null;
  let canvasCtx: CanvasRenderingContext2D | null = null;
  let dragging = false;

  let blockText = '';
  let blockWidth = 0;
  let blockMinHeight = 0;
  let leftInset = 0;
  let topInset = 0;
  let bottomInset = 0;
  let lineHeight = 28;
  let font = '500 1rem "IBM Plex Sans", "Segoe UI", sans-serif';
  let orbCenterX = ORB_RADIUS + 12;
  let orbCenterY = ORB_RADIUS + 12;
  let offsetX = 0;
  let offsetY = 0;

  const widthCache = new Map<string, number>();

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function sameCursor(a: Cursor, b: Cursor) {
    return a.segmentIndex === b.segmentIndex && a.graphemeIndex === b.graphemeIndex;
  }

  function escapeHtml(text: string) {
    return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

  function resolveLineHeight(style: CSSStyleDeclaration) {
    const parsed = Number.parseFloat(style.lineHeight);
    if (Number.isFinite(parsed)) {
      return parsed;
    }

    const fontSize = Number.parseFloat(style.fontSize);
    return Number.isFinite(fontSize) ? fontSize * 1.65 : 28;
  }

  function resolveFont(style: CSSStyleDeclaration) {
    const fontValue = style.font?.trim();
    if (fontValue) {
      return fontValue;
    }

    return `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  }

  function extractPlainText(block: HTMLElement) {
    const clone = block.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.dadri-flow-orb, .dadri-flow-line-layer').forEach((node) => node.remove());
    return clone.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  function isBigTextBlock(block: HTMLElement) {
    if (block.hasAttribute('data-flow-copy')) {
      return true;
    }

    const text = extractPlainText(block);
    const rect = block.getBoundingClientRect();

    return text.length >= MIN_COPY_LENGTH || rect.height >= 56;
  }

  function ensureArtifacts() {
    if (typeof document === 'undefined') {
      return;
    }

    if (!orbEl) {
      orbEl = document.createElement('button');
      orbEl.type = 'button';
      orbEl.className = 'dadri-flow-orb';
      orbEl.tabIndex = -1;
      orbEl.setAttribute('aria-hidden', 'true');
      orbEl.setAttribute('aria-label', 'Drag orb to reflow text');
      orbEl.innerHTML = '<span>flow</span>';
      orbEl.addEventListener('pointerdown', onOrbPointerDown);
    }

    if (!lineLayerEl) {
      lineLayerEl = document.createElement('div');
      lineLayerEl.className = 'dadri-flow-line-layer';
      lineLayerEl.setAttribute('aria-hidden', 'true');
    }
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

  function prepareActiveBlock() {
    if (!activeBlock) {
      return;
    }

    const style = getComputedStyle(activeBlock);
    const rect = activeBlock.getBoundingClientRect();
    const rightInset = Number.parseFloat(style.paddingRight) || 0;

    leftInset = Number.parseFloat(style.paddingLeft) || 0;
    topInset = Number.parseFloat(style.paddingTop) || 0;
    bottomInset = Number.parseFloat(style.paddingBottom) || 0;
    lineHeight = resolveLineHeight(style);
    font = resolveFont(style);
    blockWidth = Math.max(160, rect.width - leftInset - rightInset);
    blockMinHeight = Math.max(lineHeight * 2, rect.height - topInset - bottomInset);
    blockText = activeBlock.dataset.flowText ?? extractPlainText(activeBlock);

    widthCache.clear();

    if (canvasCtx) {
      canvasCtx.font = font;
    }

    if (!pretextApi || blockText.length === 0) {
      prepared = null;
      return;
    }

    try {
      prepared = pretextApi.prepareWithSegments(blockText, font, { whiteSpace: 'normal' });
    } catch {
      prepared = null;
    }
  }

  function constrainOrb() {
    const maxX = Math.max(ORB_RADIUS, blockWidth - ORB_RADIUS);
    const maxY = Math.max(ORB_RADIUS, Math.min(Math.max(blockMinHeight, lineHeight * 3), 320) - ORB_RADIUS);

    orbCenterX = clamp(orbCenterX, ORB_RADIUS, maxX);
    orbCenterY = clamp(orbCenterY, ORB_RADIUS, maxY);
  }

  function syncOrbVisual() {
    if (!orbEl) {
      return;
    }

    constrainOrb();
    orbEl.classList.toggle('is-dragging', dragging);
    orbEl.style.width = `${ORB_SIZE}px`;
    orbEl.style.height = `${ORB_SIZE}px`;
    orbEl.style.left = `${leftInset + orbCenterX - ORB_RADIUS}px`;
    orbEl.style.top = `${topInset + orbCenterY - ORB_RADIUS}px`;
  }

  function getBlockedRange(midY: number) {
    const dy = Math.abs(midY - orbCenterY);
    if (dy >= ORB_RADIUS) {
      return null;
    }

    const dx = Math.sqrt(ORB_RADIUS * ORB_RADIUS - dy * dy);
    const inset = 8;

    return {
      left: clamp(orbCenterX - dx - inset, 0, blockWidth),
      right: clamp(orbCenterX + dx + inset, 0, blockWidth)
    };
  }

  function allowedRanges(lineTop: number) {
    const blocked = getBlockedRange(lineTop + lineHeight * 0.5);

    if (!blocked) {
      return [{ start: 0, end: blockWidth }];
    }

    const spans: Array<{ start: number; end: number }> = [];

    if (blocked.left > 0) {
      spans.push({ start: 0, end: blocked.left });
    }

    if (blocked.right < blockWidth) {
      spans.push({ start: blocked.right, end: blockWidth });
    }

    return spans.length > 0 ? spans : [{ start: 0, end: blockWidth }];
  }

  function layoutTextWithPretext() {
    if (!pretextApi || !prepared) {
      return null;
    }

    const segments: Segment[] = [];
    let lineTop = 0;
    let safety = 0;
    let done = false;
    let cursor: Cursor = { segmentIndex: 0, graphemeIndex: 0 };

    while (!done && lineTop < MAX_LAYOUT_HEIGHT && safety < 260) {
      const ranges = allowedRanges(lineTop);
      let consumedRow = false;

      for (const range of ranges) {
        const width = range.end - range.start;
        if (width < 24) {
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

        segments.push({
          text: line.text,
          x: range.start,
          y: lineTop
        });

        cursor = line.end;
        consumedRow = true;
      }

      if (!consumedRow && !done) {
        const fallback = pretextApi.layoutNextLine(prepared, cursor, blockWidth);

        if (!fallback || sameCursor(cursor, fallback.end)) {
          done = true;
        } else {
          segments.push({ text: fallback.text, x: 0, y: lineTop });
          cursor = fallback.end;
        }
      }

      lineTop += lineHeight;
      safety += 1;
    }

    return {
      segments,
      height: Math.max(blockMinHeight, lineTop + lineHeight * 0.5)
    } satisfies LayoutResult;
  }

  function shouldSkipLeadingSpace(index: number, isLineStart: boolean) {
    return isLineStart && blockText[index] === ' ';
  }

  function pushLineSegment(segments: Segment[], text: string, x: number, y: number) {
    if (!text) {
      return;
    }

    segments.push({ text, x, y });
  }

  function layoutTextFallback() {
    const segments: Segment[] = [];
    let cursor = 0;
    let lineTop = 0;

    for (let lineIndex = 0; lineIndex < 260 && cursor < blockText.length; lineIndex += 1) {
      const ranges = allowedRanges(lineTop);

      for (const range of ranges) {
        if (cursor >= blockText.length) {
          break;
        }

        const rangeWidth = range.end - range.start;
        if (rangeWidth < 12) {
          continue;
        }

        const lineStart = cursor;
        let localCursor = cursor;

        while (localCursor < blockText.length) {
          const char = blockText[localCursor];

          if (char === '\n') {
            localCursor += 1;
            break;
          }

          if (shouldSkipLeadingSpace(localCursor, localCursor === lineStart)) {
            localCursor += 1;
            continue;
          }

          const nextWidth = measureTextWidth(blockText.slice(lineStart, localCursor + 1));
          if (nextWidth > rangeWidth) {
            break;
          }

          localCursor += 1;
        }

        if (localCursor === lineStart) {
          const singleChar = blockText.slice(localCursor, localCursor + 1);
          pushLineSegment(segments, singleChar, range.start, lineTop);
          localCursor += 1;
        } else {
          pushLineSegment(segments, blockText.slice(lineStart, localCursor), range.start, lineTop);
        }

        cursor = localCursor;
      }

      lineTop += lineHeight;
    }

    return {
      segments,
      height: Math.max(blockMinHeight, lineTop + lineHeight * 0.5)
    } satisfies LayoutResult;
  }

  function renderLayout() {
    if (!activeBlock || !lineLayerEl) {
      return;
    }

    const layout = layoutTextWithPretext() ?? layoutTextFallback();

    lineLayerEl.style.left = `${leftInset}px`;
    lineLayerEl.style.top = `${topInset}px`;
    lineLayerEl.style.setProperty('--flow-font', font);
    lineLayerEl.style.setProperty('--flow-line-height', `${lineHeight}px`);
    lineLayerEl.style.height = `${Math.ceil(layout.height)}px`;
    lineLayerEl.innerHTML = layout.segments
      .map(
        (segment) =>
          `<span class="dadri-flow-line" style="left:${segment.x}px; top:${segment.y}px;">${escapeHtml(segment.text)}</span>`
      )
      .join('');

    activeBlock.style.minHeight = `${Math.ceil(layout.height + topInset + bottomInset)}px`;
    syncOrbVisual();
  }

  function clearActiveBlock() {
    if (activeBlock) {
      activeBlock.classList.remove('dadri-flow-copy-active');
      activeBlock.style.minHeight = '';
      delete activeBlock.dataset.flowText;
    }

    lineLayerEl?.remove();
    orbEl?.remove();
    activeBlock = null;
    prepared = null;
    blockText = '';
  }

  function activateBlock(block: HTMLElement) {
    if (activeBlock === block) {
      return;
    }

    clearActiveBlock();
    ensureArtifacts();

    activeBlock = block;
    activeBlock.dataset.flowText = extractPlainText(block);
    activeBlock.classList.add('dadri-flow-copy-active');
    lineLayerEl && activeBlock.append(lineLayerEl);
    orbEl && activeBlock.append(orbEl);

    prepareActiveBlock();
    renderLayout();
  }

  function findEligibleTextBlock(target: EventTarget | null) {
    if (!(target instanceof Element) || !contentEl) {
      return null;
    }

    const candidate = target.closest(BLOCK_SELECTOR);

    if (!(candidate instanceof HTMLElement) || !contentEl.contains(candidate)) {
      return null;
    }

    if (candidate.classList.contains('dadri-flow-orb')) {
      return activeBlock;
    }

    if (candidate.matches(IGNORE_SELECTOR) || candidate.closest(`nav, ${IGNORE_SELECTOR}`)) {
      return null;
    }

    return isBigTextBlock(candidate) ? candidate : null;
  }

  function positionOrbFromPointer(event: PointerEvent, useDragOffset = false) {
    if (!activeBlock) {
      return;
    }

    const rect = activeBlock.getBoundingClientRect();
    const maxX = Math.max(ORB_RADIUS, blockWidth - ORB_RADIUS);
    const maxY = Math.max(ORB_RADIUS, Math.min(Math.max(blockMinHeight, lineHeight * 3), 320) - ORB_RADIUS);

    const nextX = event.clientX - rect.left - leftInset - (useDragOffset ? offsetX : 0);
    const nextY = event.clientY - rect.top - topInset - (useDragOffset ? offsetY : 0);

    orbCenterX = clamp(nextX, ORB_RADIUS, maxX);
    orbCenterY = clamp(nextY, ORB_RADIUS, maxY);

    renderLayout();
  }

  function onOrbPointerDown(event: PointerEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!activeBlock || !orbEl) {
      return;
    }

    dragging = true;
    orbEl.setPointerCapture(event.pointerId);

    const rect = activeBlock.getBoundingClientRect();
    offsetX = event.clientX - rect.left - leftInset - orbCenterX;
    offsetY = event.clientY - rect.top - topInset - orbCenterY;
    syncOrbVisual();
  }

  function onLocalPointerMove(event: PointerEvent) {
    if (dragging) {
      return;
    }

    const block = findEligibleTextBlock(event.target);

    if (!block) {
      clearActiveBlock();
      return;
    }

    activateBlock(block);
    positionOrbFromPointer(event);
  }

  function onWindowPointerMove(event: PointerEvent) {
    if (!dragging || !activeBlock) {
      return;
    }

    positionOrbFromPointer(event, true);
  }

  function onPointerUp(event?: PointerEvent) {
    if (event && orbEl?.hasPointerCapture(event.pointerId)) {
      orbEl.releasePointerCapture(event.pointerId);
    }

    if (!dragging) {
      return;
    }

    dragging = false;
    syncOrbVisual();

    const hovered = event ? findEligibleTextBlock(document.elementFromPoint(event.clientX, event.clientY)) : null;
    if (!hovered) {
      clearActiveBlock();
    }
  }

  function onShellPointerLeave() {
    if (!dragging) {
      clearActiveBlock();
    }
  }

  function constrainOnResize() {
    if (!activeBlock || !contentEl?.contains(activeBlock)) {
      clearActiveBlock();
      return;
    }

    prepareActiveBlock();
    renderLayout();
  }

  onMount(() => {
    const canvas = document.createElement('canvas');
    canvasCtx = canvas.getContext('2d');
    ensureArtifacts();

    void (async () => {
      try {
        pretextApi = (await import('@chenglou/pretext')) as PretextApi;
      } catch {
        pretextApi = null;
      }

      if (activeBlock) {
        prepareActiveBlock();
        renderLayout();
      }
    })();

    const resizeObserver = new ResizeObserver(() => {
      constrainOnResize();
    });

    if (shell) {
      resizeObserver.observe(shell);
    }

    if (contentEl) {
      resizeObserver.observe(contentEl);
    }

    window.addEventListener('pointermove', onWindowPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', constrainOnResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', constrainOnResize);
      orbEl?.removeEventListener('pointerdown', onOrbPointerDown);
      clearActiveBlock();
    };
  });
</script>

<div class="dadri-flow-field" bind:this={shell} on:pointermove={onLocalPointerMove} on:pointerleave={onShellPointerLeave}>
  <div class="flow-content" bind:this={contentEl}>
    <slot />
  </div>
</div>

<style>
  .dadri-flow-field {
    position: relative;
    width: 100%;
  }

  :global(.dadri-flow-copy-active) {
    position: relative;
    color: transparent !important;
  }

  :global(.dadri-flow-copy-active > *) {
    color: transparent !important;
  }

  :global(.dadri-flow-copy-active::marker) {
    color: color-mix(in srgb, var(--text) 86%, transparent);
  }

  :global(.dadri-flow-line-layer) {
    position: absolute;
    z-index: 2;
    width: max(100%, 1px);
    pointer-events: none;
  }

  :global(.dadri-flow-line) {
    position: absolute;
    display: inline-block;
    white-space: pre;
    font: var(--flow-font, 500 1rem "IBM Plex Sans", "Segoe UI", sans-serif);
    line-height: var(--flow-line-height, 1.7);
    letter-spacing: 0.01em;
    color: color-mix(in srgb, var(--text) 92%, transparent);
    pointer-events: none;
    user-select: none;
  }

  :global(.dadri-flow-orb) {
    position: absolute;
    z-index: 3;
    border: 1px solid color-mix(in srgb, var(--accent) 56%, var(--line));
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      radial-gradient(circle at 32% 26%, color-mix(in srgb, var(--accent) 28%, transparent), transparent 54%),
      radial-gradient(circle at 74% 74%, color-mix(in srgb, var(--text) 14%, transparent), transparent 58%),
      color-mix(in srgb, var(--surface) 94%, transparent);
    color: color-mix(in srgb, var(--accent) 88%, var(--text));
    font: 700 0.62rem/1 "IBM Plex Sans", "Segoe UI", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: grab;
    user-select: none;
    touch-action: none;
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--line) 55%, transparent),
      0 14px 28px color-mix(in srgb, black 21%, transparent);
  }

  :global(.dadri-flow-orb.is-dragging) {
    cursor: grabbing;
    filter: brightness(1.03);
  }

  :global(.dadri-flow-orb span) {
    pointer-events: none;
    opacity: 0.9;
  }

  .flow-content :global(p),
  .flow-content :global(li),
  .flow-content :global(blockquote) {
    overflow-wrap: anywhere;
  }

  @media (max-width: 760px) {
    :global(.dadri-flow-orb) {
      transform: scale(0.92);
      transform-origin: center;
    }
  }
</style>
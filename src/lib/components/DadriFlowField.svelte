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

  type FireParticle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    life: number;
    decay: number;
    alpha: number;
    gravity: number;
  };

  type PointerRect = Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>;

  type PretextApi = {
    prepareWithSegments: (text: string, font: string, options?: { whiteSpace?: 'normal' | 'pre-wrap' }) => unknown;
    layoutNextLine: (prepared: unknown, start: Cursor, maxWidth: number) => LayoutLine | null;
  };

  const ORB_SIZE = 52;
  const ORB_RADIUS = ORB_SIZE / 2;
  const MIN_COPY_LENGTH = 48;
  const MAX_LAYOUT_HEIGHT = 1400;
  const BLOCK_SELECTOR = 'p, li, blockquote, .dadri-flow-orb';
  const COPY_NODE_SELECTOR = 'p:not(.section-no):not(.kicker):not(.label), li, blockquote';
  const IGNORE_SELECTOR =
    '[data-flow-ignore], .section-no, .kicker, .warning-bar, .label, .jump-link, .download-row';
  const POINTER_SLOP_X = 16;
  const POINTER_SLOP_Y = 14;

  let shell: HTMLDivElement | null = null;
  let contentEl: HTMLDivElement | null = null;
  let orbEl: HTMLButtonElement | null = null;
  let lineLayerEl: HTMLDivElement | null = null;
  let particleCanvasEl: HTMLCanvasElement | null = null;
  let activeBlock: HTMLElement | null = null;
  let pretextApi: PretextApi | null = null;
  let prepared: unknown = null;
  let canvasCtx: CanvasRenderingContext2D | null = null;
  let particleCtx: CanvasRenderingContext2D | null = null;
  let dragging = false;
  let fireBurstTimeout: number | null = null;
  let animationFrame = 0;
  let lastFrameTime = 0;

  let blockText = '';
  let blockWidth = 0;
  let blockMinHeight = 0;
  let originalBlockHeight = 0;
  let leftInset = 0;
  let topInset = 0;
  let bottomInset = 0;
  let lineHeight = 28;
  let font = '500 1rem "IBM Plex Sans", "Segoe UI", sans-serif';
  let copyNodes: HTMLElement[] = [];
  let activeSourceNode: HTMLElement | null = null;
  let orbCenterX = ORB_RADIUS + 12;
  let orbCenterY = ORB_RADIUS + 12;
  let moveDirectionX = 1;
  let moveDirectionY = -0.12;
  let particles: FireParticle[] = [];
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

  function extractStructuredText(block: HTMLElement) {
    const clone = block.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.dadri-flow-orb, .dadri-flow-line-layer').forEach((node) => node.remove());
    clone.querySelectorAll('br').forEach((node) => node.replaceWith('\n'));

    return clone.textContent
      ?.replace(/\u00a0/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() ?? '';
  }

  function extractPlainText(block: HTMLElement) {
    return extractStructuredText(block).replace(/\s+/g, ' ').trim();
  }

  function buildFlowText(nodes: HTMLElement[]) {
    const parts: string[] = [];

    for (let index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];
      const text = extractStructuredText(node);

      if (text) {
        parts.push(text);
      }

      const nextNode = nodes[index + 1];
      if (!nextNode) {
        continue;
      }

      const currentRect = node.getBoundingClientRect();
      const nextRect = nextNode.getBoundingClientRect();
      const gapPx = Math.max(0, nextRect.top - currentRect.bottom);
      const blankLines = Math.max(2, Math.round(gapPx / Math.max(lineHeight, 1)) + 1);

      parts.push('\n'.repeat(blankLines));
    }

    return parts.join('');
  }

  function clearHiddenNodes() {
    copyNodes.forEach((node) => node.classList.remove('dadri-flow-hidden-node'));
  }

  function isBigTextBlock(block: HTMLElement) {
    if (block.hasAttribute('data-flow-copy') || block.closest('[data-flow-copy]')) {
      return true;
    }

    const text = extractPlainText(block);
    const rect = block.getBoundingClientRect();

    return text.length >= MIN_COPY_LENGTH || rect.height >= 56;
  }

  function isRenderableCopyNode(node: Element | null): node is HTMLElement {
    return (
      node instanceof HTMLElement &&
      node.matches(COPY_NODE_SELECTOR) &&
      !node.matches(IGNORE_SELECTOR) &&
      !node.closest(`nav, ${IGNORE_SELECTOR}`) &&
      extractPlainText(node).length > 0
    );
  }

  function shouldBreakFlowGroup(node: Element | null) {
    return !!(
      node instanceof HTMLElement &&
      (node.matches(IGNORE_SELECTOR) ||
        node.matches('h1, h2, h3, h4, h5, h6, hr, figure, nav, img, video, table, pre, .warning-bar'))
    );
  }

  function getCopyNodes(block: HTMLElement) {
    if (block.matches('p, li, blockquote')) {
      return [block];
    }

    const nodes = Array.from(block.querySelectorAll<HTMLElement>(COPY_NODE_SELECTOR)).filter((node) => {
      if (node.matches(IGNORE_SELECTOR) || node.closest(`nav, ${IGNORE_SELECTOR}`)) {
        return false;
      }

      return extractPlainText(node).length > 0;
    });

    if (nodes.length === 0) {
      return [block];
    }

    const source = activeSourceNode && nodes.includes(activeSourceNode) ? activeSourceNode : nodes[0];
    return [source];
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
      orbEl.setAttribute('aria-label', 'Drag ember to reflow text');
      orbEl.innerHTML = '<span>burn</span>';
      orbEl.addEventListener('pointerdown', onOrbPointerDown);
    }

    if (!particleCanvasEl) {
      particleCanvasEl = document.createElement('canvas');
      particleCanvasEl.className = 'dadri-flow-particle-layer';
      particleCanvasEl.setAttribute('aria-hidden', 'true');
      particleCtx = particleCanvasEl.getContext('2d');
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

    copyNodes = getCopyNodes(activeBlock);

    const rect = activeBlock.getBoundingClientRect();
    const firstNode = copyNodes[0] ?? activeBlock;
    const lastNode = copyNodes[copyNodes.length - 1] ?? activeBlock;
    const style = getComputedStyle(firstNode);
    const firstRect = firstNode.getBoundingClientRect();
    const lastRect = lastNode.getBoundingClientRect();
    const minLeft = Math.min(...copyNodes.map((node) => node.getBoundingClientRect().left));
    const maxRight = Math.max(...copyNodes.map((node) => node.getBoundingClientRect().right));

    originalBlockHeight = rect.height;
    leftInset = Math.max(0, minLeft - rect.left);
    topInset = Math.max(0, firstRect.top - rect.top);
    bottomInset = Math.max(0, rect.bottom - lastRect.bottom);
    lineHeight = resolveLineHeight(style);
    font = resolveFont(style);
    blockWidth = Math.max(160, maxRight - minLeft);
    blockMinHeight = Math.max(lineHeight * 2, lastRect.bottom - firstRect.top);
    blockText = buildFlowText(copyNodes);

    widthCache.clear();

    if (canvasCtx) {
      canvasCtx.font = font;
    }

    if (!pretextApi || blockText.length === 0) {
      prepared = null;
      return;
    }

    try {
      prepared = pretextApi.prepareWithSegments(blockText, font, { whiteSpace: 'pre-wrap' });
    } catch {
      prepared = null;
    }
  }

  function constrainOrb() {
    const maxX = Math.max(ORB_RADIUS, blockWidth - ORB_RADIUS);
    const maxY = Math.max(ORB_RADIUS, Math.max(blockMinHeight, originalBlockHeight - topInset - bottomInset, lineHeight * 3) - ORB_RADIUS);

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

  function syncParticleCanvas(height: number) {
    if (!particleCanvasEl || typeof window === 'undefined') {
      return;
    }

    const cssWidth = Math.max(1, Math.ceil(blockWidth));
    const cssHeight = Math.max(1, Math.ceil(height));
    const dpr = window.devicePixelRatio || 1;

    particleCanvasEl.style.left = `${leftInset}px`;
    particleCanvasEl.style.top = `${topInset}px`;
    particleCanvasEl.style.width = `${cssWidth}px`;
    particleCanvasEl.style.height = `${cssHeight}px`;

    const nextWidth = Math.max(1, Math.round(cssWidth * dpr));
    const nextHeight = Math.max(1, Math.round(cssHeight * dpr));

    if (particleCanvasEl.width !== nextWidth || particleCanvasEl.height !== nextHeight) {
      particleCanvasEl.width = nextWidth;
      particleCanvasEl.height = nextHeight;
    }

    particleCtx = particleCanvasEl.getContext('2d');
    particleCtx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function pulseOrbFire() {
    orbEl?.classList.add('is-firing');

    if (fireBurstTimeout !== null && typeof window !== 'undefined') {
      window.clearTimeout(fireBurstTimeout);
    }

    if (typeof window !== 'undefined') {
      fireBurstTimeout = window.setTimeout(() => {
        orbEl?.classList.remove('is-firing');
        fireBurstTimeout = null;
      }, 220);
    }
  }

  function addParticle(
    x: number,
    y: number,
    vx: number,
    vy: number,
    radius: number,
    life: number,
    decay: number,
    alpha: number,
    gravity: number
  ) {
    particles.push({ x, y, vx, vy, radius, life, decay, alpha, gravity });
  }

  function emitTrailParticles(originX: number, originY: number, dirX: number, dirY: number, count = 4) {
    if (!activeBlock) {
      return;
    }

    const length = Math.hypot(dirX, dirY) || 1;
    const nx = dirX / length;
    const ny = dirY / length;

    for (let index = 0; index < count; index += 1) {
      const spread = (Math.random() - 0.5) * 0.85;
      const speed = 0.45 + Math.random() * 1.25;

      addParticle(
        originX + (Math.random() - 0.5) * 8,
        originY + (Math.random() - 0.5) * 8,
        nx * speed + spread,
        ny * speed + spread * 0.45 - 0.25,
        3 + Math.random() * 4,
        0.9,
        0.03 + Math.random() * 0.025,
        0.26 + Math.random() * 0.2,
        -0.004 - Math.random() * 0.018
      );
    }
  }

  function emitFireBurst(strength = 1) {
    if (!activeBlock) {
      return;
    }

    pulseOrbFire();

    const length = Math.hypot(moveDirectionX, moveDirectionY) || 1;
    const dirX = moveDirectionX / length;
    const dirY = moveDirectionY / length;
    const originX = orbCenterX + dirX * (ORB_RADIUS * 0.7);
    const originY = orbCenterY + dirY * (ORB_RADIUS * 0.18);

    for (let index = 0; index < 20; index += 1) {
      const spread = (Math.random() - 0.5) * 0.95;
      const speed = (1.4 + Math.random() * 3.1) * strength;

      addParticle(
        originX + dirX * 4 + (Math.random() - 0.5) * 10,
        originY + dirY * 4 + (Math.random() - 0.5) * 10,
        dirX * speed + spread,
        dirY * speed + spread * 0.55 - 0.25,
        5 + Math.random() * 7,
        1,
        0.025 + Math.random() * 0.03,
        0.42 + Math.random() * 0.34,
        0.008 + Math.random() * 0.02
      );
    }

    for (let index = 0; index < 10; index += 1) {
      addParticle(
        originX + (Math.random() - 0.5) * 12,
        originY + (Math.random() - 0.5) * 12,
        dirX * (0.4 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.5,
        dirY * (0.1 + Math.random() * 0.5) - 0.3 + (Math.random() - 0.5) * 0.35,
        6 + Math.random() * 8,
        0.82,
        0.016 + Math.random() * 0.018,
        0.14 + Math.random() * 0.12,
        -0.01 - Math.random() * 0.012
      );
    }
  }

  function renderParticles() {
    if (!particleCtx || !particleCanvasEl) {
      return;
    }

    const cssWidth = Number.parseFloat(particleCanvasEl.style.width) || particleCanvasEl.clientWidth || 1;
    const cssHeight = Number.parseFloat(particleCanvasEl.style.height) || particleCanvasEl.clientHeight || 1;

    particleCtx.clearRect(0, 0, cssWidth, cssHeight);

    if (particles.length === 0) {
      return;
    }

    particleCtx.save();
    particleCtx.globalCompositeOperation = 'lighter';

    for (const particle of particles) {
      const life = Math.max(0, Math.min(1, particle.life));
      const radius = particle.radius * (0.7 + (1 - life) * 0.65);
      const alpha = particle.alpha * life;
      const gradient = particleCtx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, radius);

      gradient.addColorStop(0, `rgba(255,248,225,${alpha})`);
      gradient.addColorStop(0.34, `rgba(255,196,82,${alpha * 0.95})`);
      gradient.addColorStop(0.7, `rgba(255,98,28,${alpha * 0.58})`);
      gradient.addColorStop(1, 'rgba(95,18,6,0)');

      particleCtx.fillStyle = gradient;
      particleCtx.beginPath();
      particleCtx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      particleCtx.fill();
    }

    particleCtx.restore();
  }

  function stepParticles(delta: number) {
    if (particles.length === 0) {
      renderParticles();
      return;
    }

    const maxHeight = Math.max(blockMinHeight, originalBlockHeight, 160);

    particles = particles.filter((particle) => {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vx *= 0.988;
      particle.vy = particle.vy * 0.992 + particle.gravity * delta;
      particle.life -= particle.decay * delta;

      return (
        particle.life > 0.01 &&
        particle.x > -80 &&
        particle.x < blockWidth + 80 &&
        particle.y > -120 &&
        particle.y < maxHeight + 120
      );
    });

    renderParticles();
  }

  function tickParticles(now = 0) {
    animationFrame = window.requestAnimationFrame(tickParticles);

    const delta = lastFrameTime ? Math.min(2.1, (now - lastFrameTime) / 16.6667) : 1;
    lastFrameTime = now;
    stepParticles(delta);
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

        let hitHardBreak = false;

        while (localCursor < blockText.length) {
          const char = blockText[localCursor];

          if (char === '\n') {
            hitHardBreak = true;
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
          if (hitHardBreak) {
            localCursor += 1;
          } else {
            const singleChar = blockText.slice(localCursor, localCursor + 1);
            pushLineSegment(segments, singleChar, range.start, lineTop);
            localCursor += 1;
          }
        } else {
          pushLineSegment(segments, blockText.slice(lineStart, localCursor), range.start, lineTop);

          if (hitHardBreak) {
            localCursor += 1;
          }
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

    syncParticleCanvas(Math.ceil(layout.height));
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

    activeBlock.style.minHeight = `${Math.ceil(originalBlockHeight)}px`;
    syncOrbVisual();
    renderParticles();
  }

  function clearActiveBlock() {
    clearHiddenNodes();

    if (activeBlock) {
      activeBlock.classList.remove('dadri-flow-copy-active');
      activeBlock.style.minHeight = '';
      delete activeBlock.dataset.flowText;
    }

    lineLayerEl?.remove();
    particleCanvasEl?.remove();
    orbEl?.classList.remove('is-firing');
    orbEl?.remove();
    particles = [];
    activeBlock = null;
    activeSourceNode = null;
    prepared = null;
    blockText = '';
    copyNodes = [];
    renderParticles();
  }

  function activateBlock(block: HTMLElement) {
    if (activeBlock === block && activeSourceNode === block) {
      return;
    }

    if (activeBlock === block) {
      activeSourceNode = block;
      return;
    }

    clearActiveBlock();
    ensureArtifacts();

    activeSourceNode = block;
    activeBlock = block;
    activeBlock.dataset.flowText = extractPlainText(block);
    activeBlock.classList.add('dadri-flow-copy-active');
    particleCanvasEl && activeBlock.append(particleCanvasEl);
    lineLayerEl && activeBlock.append(lineLayerEl);
    orbEl && activeBlock.append(orbEl);

    prepareActiveBlock();
    copyNodes.forEach((node) => node.classList.add('dadri-flow-hidden-node'));
    renderLayout();
  }

  function pointNearRect(clientX: number, clientY: number, rect: PointerRect) {
    return (
      clientX >= rect.left - POINTER_SLOP_X &&
      clientX <= rect.right + POINTER_SLOP_X &&
      clientY >= rect.top - POINTER_SLOP_Y &&
      clientY <= rect.bottom + POINTER_SLOP_Y
    );
  }

  function getHoverRect(node: HTMLElement): PointerRect {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    const marginTop = Number.parseFloat(style.marginTop) || 0;
    const marginBottom = Number.parseFloat(style.marginBottom) || 0;
    const marginLeft = Number.parseFloat(style.marginLeft) || 0;
    const marginRight = Number.parseFloat(style.marginRight) || 0;

    return {
      left: rect.left - Math.min(marginLeft * 0.5, POINTER_SLOP_X),
      right: rect.right + Math.min(marginRight * 0.5, POINTER_SLOP_X),
      top: rect.top - Math.min(marginTop * 0.6, lineHeight * 0.9),
      bottom: rect.bottom + Math.min(marginBottom * 0.6, lineHeight * 0.9)
    };
  }

  function pointNearActiveCopy(clientX: number, clientY: number) {
    const nodes = copyNodes;
    if (nodes.length === 0) {
      return false;
    }

    const rects = nodes
      .map((node) => getHoverRect(node))
      .sort((a, b) => (a.top === b.top ? a.left - b.left : a.top - b.top));

    for (const rect of rects) {
      if (pointNearRect(clientX, clientY, rect)) {
        return true;
      }
    }

    for (let index = 0; index < rects.length - 1; index += 1) {
      const current = rects[index];
      const next = rects[index + 1];
      const gapSize = next.top - current.bottom;

      if (gapSize < 0 || gapSize > lineHeight * 2.4) {
        continue;
      }

      const gapTop = current.bottom - POINTER_SLOP_Y;
      const gapBottom = next.top + POINTER_SLOP_Y;
      const gapLeft = Math.min(current.left, next.left) - POINTER_SLOP_X;
      const gapRight = Math.max(current.right, next.right) + POINTER_SLOP_X;

      if (clientX >= gapLeft && clientX <= gapRight && clientY >= gapTop && clientY <= gapBottom) {
        return true;
      }
    }

    return false;
  }

  function isBlockedPointerTarget(element: Element | null) {
    if (!(element instanceof HTMLElement) || !contentEl) {
      return false;
    }

    const blocked = element.closest(
      `${IGNORE_SELECTOR}, h1, h2, h3, h4, h5, h6, .writing-head, .panel-head, .collab-head, .archive-head, .gallery-head`
    );

    return blocked instanceof HTMLElement && contentEl.contains(blocked) && !element.closest('.dadri-flow-orb');
  }

  function resolveCandidateBlock(element: Element | null) {
    if (!element || !contentEl) {
      return null;
    }

    const candidate = element.closest(BLOCK_SELECTOR);

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

  function findNearbyTextBlock(target: Element | null, clientX: number, clientY: number) {
    if (!contentEl) {
      return null;
    }

    const scope = target?.closest('[data-flow-copy]') ?? target?.closest('article, main, section, div') ?? contentEl;
    const blocks = Array.from(scope.querySelectorAll<HTMLElement>('p, li, blockquote'));

    let bestBlock: HTMLElement | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (const block of blocks) {
      if (block.matches(IGNORE_SELECTOR) || !isBigTextBlock(block)) {
        continue;
      }

      const rect = getHoverRect(block);
      if (!pointNearRect(clientX, clientY, rect)) {
        continue;
      }

      const dx = clientX < rect.left ? rect.left - clientX : clientX > rect.right ? clientX - rect.right : 0;
      const dy = clientY < rect.top ? rect.top - clientY : clientY > rect.bottom ? clientY - rect.bottom : 0;
      const score = dx + dy * 1.5;

      if (score < bestScore) {
        bestScore = score;
        bestBlock = block;
      }
    }

    return bestBlock;
  }

  function findEligibleTextBlock(target: EventTarget | null, clientX?: number, clientY?: number) {
    if (!contentEl) {
      return null;
    }

    const directTarget = target instanceof Element ? target : null;

    if (isBlockedPointerTarget(directTarget)) {
      return null;
    }

    const elements = [
      ...(directTarget ? [directTarget] : []),
      ...(typeof clientX === 'number' && typeof clientY === 'number' ? document.elementsFromPoint(clientX, clientY) : [])
    ];

    for (const element of elements) {
      if (isBlockedPointerTarget(element)) {
        return null;
      }

      const candidate = resolveCandidateBlock(element);
      if (candidate) {
        return candidate;
      }
    }

    if (typeof clientX === 'number' && typeof clientY === 'number' && pointNearActiveCopy(clientX, clientY)) {
      return activeSourceNode ?? activeBlock;
    }

    if (typeof clientX === 'number' && typeof clientY === 'number') {
      return findNearbyTextBlock(directTarget, clientX, clientY);
    }

    return null;
  }

  function positionOrbFromPointer(event: PointerEvent, useDragOffset = false) {
    if (!activeBlock) {
      return;
    }

    const previousX = orbCenterX;
    const previousY = orbCenterY;
    const rect = activeBlock.getBoundingClientRect();
    const maxX = Math.max(ORB_RADIUS, blockWidth - ORB_RADIUS);
    const maxY = Math.max(ORB_RADIUS, Math.max(blockMinHeight, originalBlockHeight - topInset - bottomInset, lineHeight * 3) - ORB_RADIUS);

    const nextX = event.clientX - rect.left - leftInset - (useDragOffset ? offsetX : 0);
    const nextY = event.clientY - rect.top - topInset - (useDragOffset ? offsetY : 0);

    orbCenterX = clamp(nextX, ORB_RADIUS, maxX);
    orbCenterY = clamp(nextY, ORB_RADIUS, maxY);

    const deltaX = orbCenterX - previousX;
    const deltaY = orbCenterY - previousY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > 0.8) {
      moveDirectionX = deltaX / distance;
      moveDirectionY = deltaY / distance;
      emitTrailParticles(
        orbCenterX - moveDirectionX * (ORB_RADIUS * 0.45),
        orbCenterY - moveDirectionY * (ORB_RADIUS * 0.45),
        -moveDirectionX,
        -moveDirectionY,
        clamp(Math.round(distance * 0.35), 2, 6)
      );
    }

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
    emitFireBurst(0.95);
    syncOrbVisual();
  }

  function onLocalPointerMove(event: PointerEvent) {
    if (dragging) {
      return;
    }

    const block = findEligibleTextBlock(event.target, event.clientX, event.clientY);

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

    const hovered = event
      ? findEligibleTextBlock(document.elementFromPoint(event.clientX, event.clientY), event.clientX, event.clientY)
      : null;

    if (!hovered) {
      clearActiveBlock();
    }
  }

  function onShellClick(event: MouseEvent) {
    if (dragging) {
      return;
    }

    const block = findEligibleTextBlock(event.target, event.clientX, event.clientY);
    if (!block) {
      return;
    }

    activateBlock(block);

    if (!activeBlock) {
      return;
    }

    const rect = activeBlock.getBoundingClientRect();
    const dx = event.clientX - rect.left - leftInset - orbCenterX;
    const dy = event.clientY - rect.top - topInset - orbCenterY;
    const distance = Math.hypot(dx, dy);

    if (distance > 0.001) {
      moveDirectionX = dx / distance;
      moveDirectionY = dy / distance;
    }

    emitFireBurst(distance > 120 ? 1.15 : 1);
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
    animationFrame = window.requestAnimationFrame(tickParticles);

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
      window.cancelAnimationFrame(animationFrame);
      if (fireBurstTimeout !== null) {
        window.clearTimeout(fireBurstTimeout);
      }
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', constrainOnResize);
      orbEl?.removeEventListener('pointerdown', onOrbPointerDown);
      clearActiveBlock();
    };
  });
</script>

<div
  class="dadri-flow-field"
  bind:this={shell}
  on:pointermove={onLocalPointerMove}
  on:pointerleave={onShellPointerLeave}
  on:click={onShellClick}
>
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
  }

  :global(.dadri-flow-hidden-node) {
    color: transparent !important;
  }

  :global(.dadri-flow-hidden-node::marker) {
    color: color-mix(in srgb, var(--text) 86%, transparent);
  }

  :global(.dadri-flow-particle-layer) {
    position: absolute;
    z-index: 2;
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: 0.96;
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
    border: 1px solid rgba(255, 178, 92, 0.42);
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      radial-gradient(circle at 34% 28%, rgba(255, 247, 223, 0.95), transparent 18%),
      radial-gradient(circle at 46% 44%, rgba(255, 132, 36, 0.78), transparent 44%),
      radial-gradient(circle at 72% 72%, rgba(122, 19, 4, 0.45), transparent 64%),
      color-mix(in srgb, var(--surface) 82%, #260701);
    color: color-mix(in srgb, #ffd18b 86%, var(--text));
    font: 700 0.58rem/1 "IBM Plex Sans", "Segoe UI", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: grab;
    user-select: none;
    touch-action: none;
    box-shadow:
      0 0 0 1px rgba(255, 190, 112, 0.22),
      0 0 18px rgba(255, 112, 28, 0.24),
      0 14px 28px color-mix(in srgb, black 25%, transparent);
    transition: transform 120ms ease, box-shadow 120ms ease, filter 120ms ease;
  }

  :global(.dadri-flow-orb.is-dragging) {
    cursor: grabbing;
    filter: brightness(1.05) saturate(1.08);
    transform: scale(1.02);
  }

  :global(.dadri-flow-orb.is-firing) {
    box-shadow:
      0 0 0 1px rgba(255, 196, 118, 0.4),
      0 0 28px rgba(255, 118, 28, 0.45),
      0 0 52px rgba(255, 72, 12, 0.24),
      0 14px 28px color-mix(in srgb, black 28%, transparent);
    filter: brightness(1.08) saturate(1.16);
  }

  :global(.dadri-flow-orb span) {
    pointer-events: none;
    opacity: 0.92;
    text-shadow: 0 0 14px rgba(255, 112, 28, 0.34);
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
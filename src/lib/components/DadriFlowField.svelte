<script lang="ts">
  import { onMount } from 'svelte';

  const orbSize = 58;
  const MIN_COPY_LENGTH = 48;

  let shell: HTMLDivElement | null = null;
  let contentEl: HTMLDivElement | null = null;
  let orbEl: HTMLButtonElement | null = null;
  let activeBlock: HTMLElement | null = null;
  let dragging = false;

  let orbX = 10;
  let orbY = 12;
  let offsetX = 0;
  let offsetY = 0;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function isBigTextBlock(block: HTMLElement) {
    if (block.hasAttribute('data-flow-copy')) {
      return true;
    }

    const text = block.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    const rect = block.getBoundingClientRect();

    return text.length >= MIN_COPY_LENGTH || rect.height >= 56;
  }

  function syncOrbState() {
    if (!orbEl) {
      return;
    }

    orbEl.style.setProperty('--orb-size', `${orbSize}px`);
    orbEl.style.setProperty('--orb-x', `${orbX}px`);
    orbEl.style.setProperty('--orb-y', `${orbY}px`);
    orbEl.classList.toggle('is-dragging', dragging);
  }

  function ensureOrb() {
    if (orbEl || typeof document === 'undefined') {
      return;
    }

    orbEl = document.createElement('button');
    orbEl.type = 'button';
    orbEl.className = 'dadri-flow-orb';
    orbEl.tabIndex = -1;
    orbEl.setAttribute('aria-hidden', 'true');
    orbEl.setAttribute('aria-label', 'Drag orb to reflow Dadri text');
    orbEl.innerHTML = '<span>flow</span>';
    orbEl.addEventListener('pointerdown', onOrbPointerDown);
    syncOrbState();
  }

  function getLimits(block: HTMLElement | null = activeBlock) {
    if (!block) {
      return { maxX: 0, maxY: 0 };
    }

    const rect = block.getBoundingClientRect();

    return {
      maxX: Math.max(0, rect.width - orbSize - 4),
      maxY: Math.max(0, Math.min(rect.height - orbSize - 4, 220))
    };
  }

  function removeOrb() {
    if (activeBlock) {
      activeBlock.classList.remove('flow-orb-active');
    }

    activeBlock = null;

    if (orbEl?.parentElement) {
      orbEl.remove();
    }
  }

  function activateBlock(block: HTMLElement) {
    ensureOrb();

    if (!orbEl) {
      return;
    }

    if (activeBlock !== block) {
      activeBlock?.classList.remove('flow-orb-active');
      activeBlock = block;
      activeBlock.classList.add('flow-orb-active');

      if (orbEl.parentElement !== block) {
        block.prepend(orbEl);
      }
    }

    syncOrbState();
  }

  function findEligibleTextBlock(target: EventTarget | null) {
    if (!(target instanceof Element) || !contentEl) {
      return null;
    }

    const candidate = target.closest('p, li, blockquote, [data-flow-copy], .dadri-flow-orb');

    if (!(candidate instanceof HTMLElement) || !contentEl.contains(candidate)) {
      return null;
    }

    if (candidate.classList.contains('dadri-flow-orb')) {
      return activeBlock;
    }

    if (
      candidate.matches(
        '[data-flow-ignore], .section-no, .kicker, .warning-bar, .label, .jump-link, .download-row'
      ) ||
      candidate.closest('nav, [data-flow-ignore]')
    ) {
      return null;
    }

    return isBigTextBlock(candidate) ? candidate : null;
  }

  function positionOrbFromPointer(event: PointerEvent, block: HTMLElement, useDragOffset = false) {
    const rect = block.getBoundingClientRect();
    const limits = getLimits(block);
    const nextX = event.clientX - rect.left - (useDragOffset ? offsetX : orbSize * 0.5);
    const nextY = event.clientY - rect.top - (useDragOffset ? offsetY : orbSize * 0.5);

    orbX = clamp(nextX, 0, limits.maxX);
    orbY = clamp(nextY, 0, limits.maxY);
    syncOrbState();
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
    offsetX = event.clientX - rect.left - orbX;
    offsetY = event.clientY - rect.top - orbY;

    syncOrbState();
  }

  function onLocalPointerMove(event: PointerEvent) {
    if (dragging) {
      return;
    }

    const block = findEligibleTextBlock(event.target);

    if (!block) {
      removeOrb();
      return;
    }

    activateBlock(block);
    positionOrbFromPointer(event, block);
  }

  function onWindowPointerMove(event: PointerEvent) {
    if (!dragging || !activeBlock) {
      return;
    }

    positionOrbFromPointer(event, activeBlock, true);
  }

  function onPointerUp(event?: PointerEvent) {
    if (event && orbEl?.hasPointerCapture(event.pointerId)) {
      orbEl.releasePointerCapture(event.pointerId);
    }

    if (!dragging) {
      return;
    }

    dragging = false;
    syncOrbState();

    const hovered = event ? findEligibleTextBlock(document.elementFromPoint(event.clientX, event.clientY)) : null;

    if (!hovered) {
      removeOrb();
    }
  }

  function onShellPointerLeave() {
    if (dragging) {
      return;
    }

    removeOrb();
  }

  function constrainOnResize() {
    if (!activeBlock || !contentEl?.contains(activeBlock)) {
      removeOrb();
      return;
    }

    const limits = getLimits(activeBlock);
    orbX = clamp(orbX, 0, limits.maxX);
    orbY = clamp(orbY, 0, limits.maxY);
    syncOrbState();
  }

  onMount(() => {
    ensureOrb();

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
      removeOrb();
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

  :global(.dadri-flow-orb) {
    --gap: clamp(0.34rem, 1vw, 0.72rem);
    float: left;
    width: var(--orb-size, 58px);
    height: var(--orb-size, 58px);
    margin-left: var(--orb-x, 0px);
    margin-top: var(--orb-y, 0px);
    margin-right: var(--gap);
    margin-bottom: var(--gap);
    border-radius: 999px;
    shape-outside: circle(50%);
    clip-path: circle(50%);
    border: 1px solid color-mix(in srgb, var(--accent) 56%, var(--line));
    background:
      radial-gradient(circle at 34% 24%, color-mix(in srgb, var(--accent) 34%, transparent), transparent 58%),
      color-mix(in srgb, var(--surface) 94%, transparent);
    color: color-mix(in srgb, var(--accent) 86%, var(--text));
    font: 700 0.6rem/1 "IBM Plex Sans", "Segoe UI", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: grid;
    place-items: center;
    cursor: grab;
    user-select: none;
    touch-action: none;
    z-index: 2;
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
      width: calc(var(--orb-size, 58px) * 0.88);
      height: calc(var(--orb-size, 58px) * 0.88);
    }
  }
</style>
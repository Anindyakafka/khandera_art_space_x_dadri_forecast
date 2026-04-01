<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';

  // 50% smaller than previous 58px
  const ORB_D = 29;
  const ORB_R = ORB_D / 2;

  let mounted = false;
  let orbVisible = false;
  let orbX = -2000;
  let orbY = -2000;

  let activeTextEl: Element | null = null;
  const floatMap = new Map<Element, { left: HTMLSpanElement; right: HTMLSpanElement }>();
  let rafPending: number | null = null;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function isEligibleText(el: Element | null): el is Element {
    if (!el) return false;
    if (!el.matches('p, li, blockquote')) return false;
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
    return (el.textContent?.trim().length ?? 0) > 30;
  }

  // --- Float injection ---

  function hitsOrb(cx: number, cy: number, rect: DOMRect): boolean {
    const nx = Math.max(rect.left, Math.min(cx, rect.right));
    const ny = Math.max(rect.top, Math.min(cy, rect.bottom));
    const dx = cx - nx;
    const dy = cy - ny;
    return dx * dx + dy * dy < (ORB_R + 4) * (ORB_R + 4);
  }

  function tick(target: Element, cx: number, cy: number) {
    const rect = target.getBoundingClientRect();

    if (!hitsOrb(cx, cy, rect)) {
      clearAll();
      activeTextEl = null;
      orbVisible = false;
      return;
    }

    let pair = floatMap.get(target);
    if (!pair) {
      clearAll();
      const left = document.createElement('span');
      const right = document.createElement('span');
      left.setAttribute('aria-hidden', 'true');
      right.setAttribute('aria-hidden', 'true');
      left.className = 'dadri-flow-spacer';
      right.className = 'dadri-flow-spacer';
      target.insertBefore(right, target.firstChild);
      target.insertBefore(left, target.firstChild);
      pair = { left, right };
      floatMap.set(target, pair);
    }

    const mt = Math.max(0, cy - ORB_R - rect.top);
    const availableWidth = Math.max(ORB_R, rect.width - ORB_R);
    const leftInset = clamp(cx - ORB_R - rect.left, 0, availableWidth);
    const rightInset = clamp(rect.right - cx - ORB_R, 0, availableWidth);

    pair.left.style.cssText =
      `display:block;float:left;shape-outside:circle(50%);shape-margin:0.06em;pointer-events:none;` +
      `width:${ORB_R}px;height:${ORB_D}px;margin:${mt}px 0.18em 0 ${leftInset}px;`;

    pair.right.style.cssText =
      `display:block;float:right;shape-outside:circle(50%);shape-margin:0.06em;pointer-events:none;` +
      `width:${ORB_R}px;height:${ORB_D}px;margin:${mt}px ${rightInset}px 0 0.18em;`;
  }

  function clearAll() {
    for (const pair of floatMap.values()) {
      pair.left.remove();
      pair.right.remove();
    }
    floatMap.clear();
  }

  // --- Event handlers ---

  function onMouseMove(e: MouseEvent) {
    const hovered = document.elementFromPoint(e.clientX, e.clientY)?.closest('p, li, blockquote') ?? null;

    if (!isEligibleText(hovered)) {
      activeTextEl = null;
      orbVisible = false;
      orbX = -2000;
      orbY = -2000;
      clearAll();
      return;
    }

    activeTextEl = hovered;
    orbVisible = true;
    orbX = e.clientX;
    orbY = e.clientY;

    if (rafPending !== null) cancelAnimationFrame(rafPending);
    rafPending = requestAnimationFrame(() => {
      if (activeTextEl) {
        tick(activeTextEl, orbX, orbY);
      }
      rafPending = null;
    });
  }

  function onMouseLeave() {
    activeTextEl = null;
    orbVisible = false;
    orbX = -2000;
    orbY = -2000;
    clearAll();
  }

  // --- Lifecycle ---

  afterNavigate(() => {
    activeTextEl = null;
    orbVisible = false;
    clearAll();
  });

  onMount(() => {
    mounted = true;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    return () => {
      mounted = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      clearAll();
      if (rafPending !== null) cancelAnimationFrame(rafPending);
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

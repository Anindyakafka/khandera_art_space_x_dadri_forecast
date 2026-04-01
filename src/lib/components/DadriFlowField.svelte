<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';

  // 50% smaller than previous 58px
  const ORB_D = 29;
  const ORB_R = ORB_D / 2;

  let mounted = false;
  let orbX = -2000;
  let orbY = -2000;

  const floatMap = new Map<Element, HTMLSpanElement>();
  let textCache: Element[] = [];
  let cacheAge = 0;
  let rafPending: number | null = null;

  // --- Cache ---

  function buildCache() {
    textCache = Array.from(
      document.querySelectorAll<Element>('p, li, blockquote')
    ).filter(el => {
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
      ) return false;
      return (el.textContent?.trim().length ?? 0) > 30;
    });
    cacheAge = Date.now();
  }

  // --- Float injection ---

  function hitsOrb(cx: number, cy: number, rect: DOMRect): boolean {
    const nx = Math.max(rect.left, Math.min(cx, rect.right));
    const ny = Math.max(rect.top, Math.min(cy, rect.bottom));
    const dx = cx - nx;
    const dy = cy - ny;
    return dx * dx + dy * dy < (ORB_R + 4) * (ORB_R + 4);
  }

  function tick(cx: number, cy: number) {
    if (Date.now() - cacheAge > 2500) buildCache();

    // Read phase — gather rects without triggering layout thrash
    const hits: { el: Element; rect: DOMRect }[] = [];
    for (const el of textCache) {
      if (!el.isConnected) continue;
      const rect = el.getBoundingClientRect();
      if (hitsOrb(cx, cy, rect)) hits.push({ el, rect });
    }

    // Write phase — update / create float spans
    const active = new Set<Element>();
    for (const { el, rect } of hits) {
      active.add(el);
      let span = floatMap.get(el);
      if (!span) {
        span = document.createElement('span');
        span.setAttribute('aria-hidden', 'true');
        el.insertBefore(span, el.firstChild);
        floatMap.set(el, span);
      }

      const toLeft = cx <= rect.left + rect.width * 0.56;
      const mt = Math.max(0, cy - ORB_R - rect.top);

      if (toLeft) {
        const ml = Math.max(0, cx - ORB_R - rect.left);
        span.style.cssText =
          `display:block;float:left;shape-outside:circle(50%);pointer-events:none;` +
          `width:${ORB_D}px;height:${ORB_D}px;margin:${mt}px 0.4em 0 ${ml}px;`;
      } else {
        const mr = Math.max(0, rect.right - cx - ORB_R);
        span.style.cssText =
          `display:block;float:right;shape-outside:circle(50%);pointer-events:none;` +
          `width:${ORB_D}px;height:${ORB_D}px;margin:${mt}px ${mr}px 0 0.4em;`;
      }
    }

    // Cleanup spans no longer needed
    for (const [el, span] of floatMap) {
      if (!active.has(el) || !el.isConnected) {
        span.remove();
        floatMap.delete(el);
      }
    }
  }

  function clearAll() {
    for (const span of floatMap.values()) span.remove();
    floatMap.clear();
  }

  // --- Event handlers ---

  function onMouseMove(e: MouseEvent) {
    orbX = e.clientX;
    orbY = e.clientY;
    if (rafPending !== null) cancelAnimationFrame(rafPending);
    rafPending = requestAnimationFrame(() => {
      tick(orbX, orbY);
      rafPending = null;
    });
  }

  function onMouseLeave() {
    orbX = -2000;
    orbY = -2000;
    clearAll();
  }

  // --- Lifecycle ---

  afterNavigate(() => {
    clearAll();
    requestAnimationFrame(() => buildCache());
  });

  onMount(() => {
    mounted = true;
    buildCache();
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

{#if mounted}
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

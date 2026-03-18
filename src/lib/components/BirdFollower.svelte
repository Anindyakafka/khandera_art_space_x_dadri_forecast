<script lang="ts">
  import { onMount } from 'svelte';

  export let perchTarget: HTMLElement | undefined;

  const IDLE_DELAY = 1500;
  const POSITION_EASE = 0.16;
  const ROTATION_EASE = 0.14;
  const CURSOR_OFFSET = { x: 18, y: -26 };

  let enabled = false;
  let visible = false;
  let perched = false;
  let currentPerch: 'cursor' | 'brand' | null = null;

  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let currentRotation = 0;
  let targetRotation = 0;

  let pointerX = 0;
  let pointerY = 0;
  let frameHandle = 0;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function clearIdleTimer() {
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = undefined;
    }
  }

  function cancelAnimation() {
    if (frameHandle) {
      cancelAnimationFrame(frameHandle);
      frameHandle = 0;
    }
  }

  function hideBird() {
    visible = false;
    perched = false;
    currentPerch = null;
    clearIdleTimer();
    cancelAnimation();
  }

  function positionForCursor() {
    targetX = clamp(pointerX + CURSOR_OFFSET.x, 12, window.innerWidth - 120);
    targetY = clamp(pointerY + CURSOR_OFFSET.y, 12, window.innerHeight - 120);
    targetRotation = 12;
  }

  function positionForBrand() {
    if (!perchTarget) {
      return;
    }

    const rect = perchTarget.getBoundingClientRect();

    targetX = clamp(rect.left + rect.width * 0.62, 12, window.innerWidth - 120);
    targetY = clamp(rect.top - 16, 10, window.innerHeight - 120);
    targetRotation = -8;
  }

  function animateBird() {
    frameHandle = requestAnimationFrame(() => {
      currentX += (targetX - currentX) * POSITION_EASE;
      currentY += (targetY - currentY) * POSITION_EASE;
      currentRotation += (targetRotation - currentRotation) * ROTATION_EASE;

      perched = Math.abs(currentX - targetX) < 0.6 && Math.abs(currentY - targetY) < 0.6;

      if (!visible) {
        cancelAnimation();
        return;
      }

      animateBird();
    });
  }

  function ensureAnimation() {
    if (!frameHandle) {
      animateBird();
    }
  }

  function revealBird() {
    visible = true;

    if (!currentX && !currentY) {
      currentX = targetX;
      currentY = targetY;
      currentRotation = targetRotation;
    }

    ensureAnimation();
  }

  function perchOnCursor() {
    currentPerch = 'cursor';
    perched = false;
    positionForCursor();
    revealBird();
  }

  function perchOnBrand() {
    if (!perchTarget) {
      return;
    }

    currentPerch = 'brand';
    perched = false;
    clearIdleTimer();
    positionForBrand();
    revealBird();
  }

  function scheduleIdlePerch() {
    clearIdleTimer();

    idleTimer = setTimeout(() => {
      if (enabled) {
        perchOnCursor();
      }
    }, IDLE_DELAY);
  }

  onMount(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    const syncCapability = () => {
      enabled = !motionQuery.matches && pointerQuery.matches;

      if (!enabled) {
        hideBird();
      }
    };

    const updatePointer = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!enabled) {
        return;
      }

      hideBird();
      scheduleIdlePerch();
    };

    const handlePointerDown = () => {
      if (!enabled) {
        return;
      }

      hideBird();
      scheduleIdlePerch();
    };

    const handleScroll = () => {
      if (!enabled) {
        return;
      }

      perchOnBrand();
    };

    const handleResize = () => {
      if (!enabled || !visible) {
        return;
      }

      if (currentPerch === 'brand') {
        positionForBrand();
      } else if (currentPerch === 'cursor') {
        positionForCursor();
      }
    };

    const handleKeydown = () => {
      if (!enabled) {
        return;
      }

      hideBird();
    };

    syncCapability();

    motionQuery.addEventListener('change', syncCapability);
    pointerQuery.addEventListener('change', syncCapability);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('keydown', handleKeydown);

    return () => {
      motionQuery.removeEventListener('change', syncCapability);
      pointerQuery.removeEventListener('change', syncCapability);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeydown);
      clearIdleTimer();
      cancelAnimation();
    };
  });

  $: if (visible && currentPerch === 'brand') {
    positionForBrand();
  }
</script>

<div
  class:visible
  class:perched
  class:flying={!perched}
  class="bird-layer"
  aria-hidden="true"
  style={`transform: translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentRotation}deg);`}
>
  <svg viewBox="0 0 120 96" class="bird" role="presentation">
    <g class="bird-mark">
      <path class="stroke body" d="M18 58C28 37 57 28 78 37C89 42 96 53 96 61C96 71 89 79 77 79C60 79 47 67 39 67C31 67 28 74 17 74C11 74 8 70 8 65C8 61 11 58 18 58Z" />
      <path class="stroke wing" d="M45 50C34 37 39 20 63 18C74 18 81 24 83 32C71 28 57 34 45 50Z" />
      <path class="stroke head" d="M82 38C91 31 102 31 108 38C113 44 112 53 105 58" />
      <path class="stroke beak" d="M108 38L118 35M108 42L117 43" />
      <path class="stroke tail" d="M17 59L4 52M17 64L3 62M19 68L7 72" />
      <path class="stroke legs" d="M56 78L54 90M66 78L67 89M51 90L59 90M63 89L72 89" />
      <circle class="eye" cx="95" cy="42" r="1.8" />
    </g>
  </svg>
</div>

<style>
  .bird-layer {
    position: fixed;
    left: 0;
    top: 0;
    width: 96px;
    height: 96px;
    pointer-events: none;
    opacity: 0;
    z-index: 40;
    transform-origin: 48px 58px;
    transition: opacity 180ms ease;
    will-change: transform, opacity;
  }

  .bird-layer.visible {
    opacity: 1;
  }

  .bird {
    width: 100%;
    height: 100%;
    overflow: visible;
    filter: drop-shadow(0 14px 18px rgba(0, 0, 0, 0.25));
  }

  .bird-mark {
    transform-origin: 54px 54px;
  }

  .bird-layer.flying .bird-mark {
    animation: bird-float 1.1s ease-in-out infinite alternate;
  }

  .bird-layer.flying .wing {
    transform-box: fill-box;
    transform-origin: 56px 48px;
    animation: flap 540ms ease-in-out infinite;
  }

  .bird-layer.perched .bird-mark {
    animation: settle 2.4s ease-in-out infinite;
  }

  .stroke {
    fill: none;
    stroke: rgba(255, 243, 214, 0.96);
    stroke-width: 2.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .body {
    fill: rgba(255, 243, 214, 0.08);
  }

  .eye {
    fill: rgba(255, 243, 214, 0.96);
  }

  @keyframes flap {
    0% {
      transform: rotate(-9deg) translateY(0);
    }

    100% {
      transform: rotate(11deg) translateY(-2px);
    }
  }

  @keyframes bird-float {
    0% {
      transform: translateY(-3px);
    }

    100% {
      transform: translateY(3px);
    }
  }

  @keyframes settle {
    0%,
    100% {
      transform: translateY(0) rotate(-2deg);
    }

    50% {
      transform: translateY(-2px) rotate(1deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .bird-layer,
    .bird-layer.flying .bird-mark,
    .bird-layer.flying .wing,
    .bird-layer.perched .bird-mark {
      animation: none;
      transition: none;
    }
  }
</style>
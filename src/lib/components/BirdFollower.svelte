<script lang="ts">
  import { onMount } from 'svelte';

  export let perchTarget: HTMLElement | undefined;

  const IDLE_DELAY = 1500;
  const POSITION_EASE = 0.16;
  const ROTATION_EASE = 0.14;
  const CURSOR_OFFSET = { x: 22, y: -44 };
  const BIRD_SIZE = 144;

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
    targetX = clamp(pointerX + CURSOR_OFFSET.x, 12, window.innerWidth - BIRD_SIZE);
    targetY = clamp(pointerY + CURSOR_OFFSET.y, 12, window.innerHeight - BIRD_SIZE);
    targetRotation = 12;
  }

  function positionForBrand() {
    if (!perchTarget) {
      return;
    }

    const rect = perchTarget.getBoundingClientRect();

    targetX = clamp(rect.left + rect.width * 0.56, 12, window.innerWidth - BIRD_SIZE);
    targetY = clamp(rect.top - 28, 10, window.innerHeight - BIRD_SIZE);
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

    const syncCapability = () => {
      enabled = true;
      scheduleIdlePerch();
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

    pointerX = window.innerWidth * 0.5;
    pointerY = window.innerHeight * 0.38;

    syncCapability();

    motionQuery.addEventListener('change', syncCapability);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('keydown', handleKeydown);

    return () => {
      motionQuery.removeEventListener('change', syncCapability);
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
  <img class="bird-image" src="/media/images/bird-sketch.svg" alt="" />
</div>

<style>
  .bird-layer {
    position: fixed;
    left: 0;
    top: 0;
    width: 144px;
    height: 144px;
    pointer-events: none;
    opacity: 0;
    z-index: 60;
    transform-origin: 48px 58px;
    transition: opacity 220ms ease, filter 220ms ease;
    will-change: transform, opacity;
    filter: blur(1px);
  }

  .bird-layer.visible {
    opacity: 1;
    filter: none;
  }

  .bird-image {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 18px 24px rgba(0, 0, 0, 0.28));
    object-fit: contain;
  }

  .bird-image {
    transform-origin: 54px 54px;
  }

  .bird-layer.flying .bird-image {
    animation: bird-float 1.1s ease-in-out infinite alternate, flap 540ms ease-in-out infinite;
  }

  .bird-layer.perched .bird-image {
    animation: settle 2.4s ease-in-out infinite;
  }

  @keyframes flap {
    0% {
      transform: rotate(-9deg) translateY(0) scaleX(0.995);
    }

    100% {
      transform: rotate(10deg) translateY(-2px) scaleX(1.005);
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
    .bird-layer.flying .bird-image,
    .bird-layer.perched .bird-image {
      animation: none;
      transition: none;
    }
  }
</style>
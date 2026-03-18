<script lang="ts">
  import { onMount } from 'svelte';

  export let perchTarget: HTMLElement | undefined;

  const IDLE_DELAY = 1400;
  const FLIGHT_DURATION = 760;
  const BIRD_SIZE = 102;
  const MIN_Y = -72;
  const CURSOR_ANCHOR = { x: 44, y: 86 };
  const BRAND_ANCHOR = { x: 50, y: 86 };

  let enabled = false;
  let visible = false;
  let flying = false;
  let perched = false;
  let currentPerch: 'cursor' | 'brand' | null = null;

  let currentX = 0;
  let currentY = 0;
  let currentRotation = 0;

  let pointerX = 0;
  let pointerY = 0;
  let frameHandle = 0;
  let reducedMotion = false;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  let scrollIdleTimer: ReturnType<typeof setTimeout> | undefined;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function clearTimer(timer: ReturnType<typeof setTimeout> | undefined) {
    if (timer) {
      clearTimeout(timer);
    }

    return undefined;
  }

  function cancelFlight() {
    if (frameHandle) {
      cancelAnimationFrame(frameHandle);
      frameHandle = 0;
    }
  }

  function fullyHideBird() {
    visible = false;
    flying = false;
    perched = false;
    currentPerch = null;
    idleTimer = clearTimer(idleTimer);
    scrollIdleTimer = clearTimer(scrollIdleTimer);
    cancelFlight();
  }

  function getCursorPerch() {
    return {
      x: clamp(pointerX - CURSOR_ANCHOR.x, -BIRD_SIZE * 0.34, window.innerWidth - BIRD_SIZE * 0.72),
      y: clamp(pointerY - CURSOR_ANCHOR.y, MIN_Y, window.innerHeight - BIRD_SIZE * 0.4),
      rotation: 8
    };
  }

  function getBrandPerch() {
    if (!perchTarget) {
      return getCursorPerch();
    }

    const rect = perchTarget.getBoundingClientRect();
    const perchPointX = rect.left + rect.width * 0.62;
    const perchPointY = rect.bottom + 3;

    return {
      x: clamp(perchPointX - BRAND_ANCHOR.x, -BIRD_SIZE * 0.4, window.innerWidth - BIRD_SIZE * 0.72),
      y: clamp(perchPointY - BRAND_ANCHOR.y, MIN_Y, window.innerHeight - BIRD_SIZE * 0.44),
      rotation: -7
    };
  }

  function moveToCurrentPerch() {
    if (!visible || flying) {
      return;
    }

    const target = currentPerch === 'brand' ? getBrandPerch() : getCursorPerch();

    currentX = target.x;
    currentY = target.y;
    currentRotation = target.rotation;
  }

  function initializeStartPosition(targetX: number, targetY: number, targetRotation: number) {
    const startFromLeft = targetX > window.innerWidth * 0.5;

    currentX = startFromLeft ? -BIRD_SIZE * 1.2 : window.innerWidth + BIRD_SIZE * 0.2;
    currentY = clamp(targetY + 50, MIN_Y, window.innerHeight - BIRD_SIZE * 0.35);
    currentRotation = targetRotation;
  }

  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function startFlight(options: {
    x: number;
    y: number;
    rotation: number;
    perch: 'cursor' | 'brand' | null;
    hideAfter?: boolean;
    duration?: number;
    arc?: number;
  }) {
    const { x, y, rotation, perch, hideAfter = false, duration = FLIGHT_DURATION, arc = 72 } = options;

    if (!visible) {
      initializeStartPosition(x, y, rotation);
      visible = true;
    }

    cancelFlight();

    perched = false;
    flying = true;
    currentPerch = null;

    const startX = currentX;
    const startY = currentY;
    const dx = x - startX;
    const direction = dx >= 0 ? 1 : -1;

    const controlX = (startX + x) / 2;
    const controlY = Math.min(startY, y) - arc;
    const animationDuration = reducedMotion ? 140 : duration;

    let startedAt = 0;

    const step = (timestamp: number) => {
      if (!startedAt) {
        startedAt = timestamp;
      }

      const elapsed = timestamp - startedAt;
      const rawT = clamp(elapsed / animationDuration, 0, 1);
      const t = easeInOutCubic(rawT);
      const oneMinus = 1 - t;

      // Quadratic bezier flight for a natural curved path.
      currentX = oneMinus * oneMinus * startX + 2 * oneMinus * t * controlX + t * t * x;
      currentY = oneMinus * oneMinus * startY + 2 * oneMinus * t * controlY + t * t * y;

      const tangentX = 2 * oneMinus * (controlX - startX) + 2 * t * (x - controlX);
      const tangentY = 2 * oneMinus * (controlY - startY) + 2 * t * (y - controlY);
      const tangentRotation = (Math.atan2(tangentY, tangentX) * 180) / Math.PI;
      currentRotation = clamp(tangentRotation * 0.45 + direction * 5, -20, 20);

      if (rawT < 1) {
        frameHandle = requestAnimationFrame(step);
        return;
      }

      frameHandle = 0;
      flying = false;
      currentX = x;
      currentY = y;
      currentRotation = rotation;

      if (hideAfter) {
        visible = false;
        perched = false;
        currentPerch = null;
        return;
      }

      perched = perch !== null;
      currentPerch = perch;
    };

    frameHandle = requestAnimationFrame(step);
  }

  function flyToCursor() {
    const target = getCursorPerch();

    startFlight({
      ...target,
      perch: 'cursor',
      arc: 66
    });
  }

  function flyToBrand() {
    const target = getBrandPerch();

    startFlight({
      ...target,
      perch: 'brand',
      arc: 58
    });
  }

  function flyOutToSideline() {
    if (!visible) {
      return;
    }

    const toRight = pointerX < window.innerWidth * 0.5;
    const sideX = toRight ? window.innerWidth + BIRD_SIZE * 0.35 : -BIRD_SIZE * 1.25;
    const sideY = clamp(currentY - 20, MIN_Y + 8, window.innerHeight - BIRD_SIZE * 0.45);

    startFlight({
      x: sideX,
      y: sideY,
      rotation: toRight ? 12 : -12,
      perch: null,
      hideAfter: true,
      arc: 88,
      duration: 700
    });
  }

  function scheduleIdlePerch() {
    idleTimer = clearTimer(idleTimer);

    idleTimer = setTimeout(() => {
      if (enabled) {
        flyToCursor();
      }
    }, IDLE_DELAY);
  }

  function handleActiveInput() {
    if (!enabled) {
      return;
    }

    if (visible && !flying) {
      flyOutToSideline();
    }

    scheduleIdlePerch();
  }

  onMount(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncMotionPreference = () => {
      reducedMotion = motionQuery.matches;
      enabled = true;
      scheduleIdlePerch();
    };

    const updatePointer = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      handleActiveInput();
    };

    const handlePointerDown = () => {
      handleActiveInput();
    };

    const handleScroll = () => {
      if (!enabled) {
        return;
      }

      idleTimer = clearTimer(idleTimer);
      scrollIdleTimer = clearTimer(scrollIdleTimer);

      if (currentPerch !== 'brand' || !visible || !perched) {
        flyToBrand();
      } else {
        moveToCurrentPerch();
      }

      scrollIdleTimer = setTimeout(() => {
        if (enabled) {
          scheduleIdlePerch();
        }
      }, 240);
    };

    const handleResize = () => {
      if (!enabled) {
        return;
      }

      pointerX = clamp(pointerX, 0, window.innerWidth);
      pointerY = clamp(pointerY, 0, window.innerHeight);
      moveToCurrentPerch();
    };

    const handleKeydown = () => {
      if (!enabled) {
        return;
      }

      if (visible && !flying) {
        flyOutToSideline();
      }

      scheduleIdlePerch();
    };

    pointerX = window.innerWidth * 0.5;
    pointerY = window.innerHeight * 0.36;

    syncMotionPreference();

    motionQuery.addEventListener('change', syncMotionPreference);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('keydown', handleKeydown);

    return () => {
      motionQuery.removeEventListener('change', syncMotionPreference);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeydown);
      fullyHideBird();
    };
  });
</script>

<div
  class:visible
  class:flying
  class:perched
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
    width: 102px;
    height: 102px;
    pointer-events: none;
    opacity: 0;
    z-index: 60;
    transform-origin: 50px 78px;
    transition: opacity 220ms ease, filter 220ms ease;
    will-change: transform, opacity;
    filter: blur(0.8px);
  }

  .bird-layer.visible {
    opacity: 1;
    filter: none;
  }

  .bird-image {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.3));
    object-fit: contain;
    transform-origin: 50px 78px;
  }

  .bird-layer.flying .bird-image {
    animation: bird-float 1s ease-in-out infinite alternate, flap 560ms ease-in-out infinite;
  }

  .bird-layer.perched .bird-image {
    animation: settle 2.2s ease-in-out infinite;
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

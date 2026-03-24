<script lang="ts">
  import { onMount } from 'svelte';

  export let perchTarget: HTMLElement | undefined;

  const IDLE_DELAY = 1450;
  const ACTIVATION_DELAY = 120000;
  const BIRD_SIZE = 102;
  const CURSOR_ANCHOR = { x: 44, y: 86 };
  const BRAND_ANCHOR = { x: 50, y: 86 };
  const EXIT_MARGIN = BIRD_SIZE * 1.4;
  const MIN_Y = -68;
  const MAX_SPEED = 180;
  const MAX_FORCE = 650;
  const SLOW_RADIUS = 85;
  const PERCH_DISTANCE = 10;
  const PERCH_SPEED = 14;
  const FIBONACCI_SPIRAL_RADIUS = 96;
  const FIBONACCI_REVOLVE_TIME = 3600;
  const SPIRAL_TIGHTEN_DISTANCE = 260;
  const RANDOM_SWAY_RADIUS = 20;

  type Mode = 'hidden' | 'to-cursor' | 'to-brand' | 'perched-cursor' | 'perched-brand' | 'exiting';

  let mode: Mode = 'hidden';
  let enabled = false;
  let visible = false;
  let flying = false;
  let perched = false;

  let currentX = 0;
  let currentY = 0;
  let currentRotation = 0;
  let velocityX = 0;
  let velocityY = 0;

  let pointerX = 0;
  let pointerY = 0;
  let exitTargetX = 0;
  let exitTargetY = 0;

  let frameHandle = 0;
  let lastFrameTime = 0;
  let reducedMotion = false;
  let lookAngle = 0;
  let wingDuration = 520;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  let scrollIdleTimer: ReturnType<typeof setTimeout> | undefined;
  let activationTimer: ReturnType<typeof setTimeout> | undefined;
  let fibonacciIndex = 0;
  let fibonacciSequence: number[] = [];
  let spiralPhase = 0;
  let spiralDirection = 1;
  let spiralTurnCount = 0;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function generateFibonacciSequence(count: number) {
    const fib = [1, 1];
    for (let i = 2; i < count; i++) {
      fib.push(fib[i - 1] + fib[i - 2]);
    }
    return fib;
  }

  function computeSpiralOffset(phase: number, spiralIndex: number, coreX: number, coreY: number, approachScale: number) {
    const normalized = coreX > window.innerWidth * 0.5 ? 1 : -1;
    const fibIndex = clamp(spiralIndex, 0, fibonacciSequence.length - 1);
    const fibValue = fibonacciSequence[fibIndex] || 34;
    const maxFib = fibonacciSequence[fibonacciSequence.length - 1] || 34;
    const fibScale = 0.55 + (fibValue / maxFib) * 0.85;
    const scaledRadius = FIBONACCI_SPIRAL_RADIUS * fibScale * approachScale;
    const angle = phase * spiralDirection * normalized + (spiralIndex * Math.PI) / 4.4;
    const noiseTime = performance.now() * 0.001;
    const noiseScale = RANDOM_SWAY_RADIUS * approachScale;
    const noiseX = Math.sin(noiseTime * 1.6 + spiralIndex * 0.37) * noiseScale
      + Math.sin(noiseTime * 3.05 + 1.3) * noiseScale * 0.35;
    const noiseY = Math.cos(noiseTime * 1.25 + spiralIndex * 0.41) * noiseScale * 0.75
      + Math.cos(noiseTime * 2.7 + 0.7) * noiseScale * 0.28;

    return {
      x: coreX + Math.cos(angle) * scaledRadius + noiseX,
      y: coreY + Math.sin(angle) * scaledRadius * 0.72 + noiseY
    };
  }

  function clearTimer(timer: ReturnType<typeof setTimeout> | undefined) {
    if (timer) {
      clearTimeout(timer);
    }

    return undefined;
  }

  function clearVectorIfTiny() {
    if (Math.abs(velocityX) < 0.01) {
      velocityX = 0;
    }

    if (Math.abs(velocityY) < 0.01) {
      velocityY = 0;
    }
  }

  function cancelLoop() {
    if (frameHandle) {
      cancelAnimationFrame(frameHandle);
      frameHandle = 0;
    }

    lastFrameTime = 0;
  }

  function startLoop() {
    if (!frameHandle) {
      frameHandle = requestAnimationFrame(tick);
    }
  }

  function hideBirdImmediately() {
    visible = false;
    flying = false;
    perched = false;
    mode = 'hidden';
    velocityX = 0;
    velocityY = 0;
    idleTimer = clearTimer(idleTimer);
    scrollIdleTimer = clearTimer(scrollIdleTimer);
    activationTimer = clearTimer(activationTimer);
    cancelLoop();
  }

  function vectorLength(x: number, y: number) {
    return Math.hypot(x, y);
  }

  function getCursorTarget() {
    return {
      x: clamp(pointerX - CURSOR_ANCHOR.x, -BIRD_SIZE * 0.4, window.innerWidth - BIRD_SIZE * 0.68),
      y: clamp(pointerY - CURSOR_ANCHOR.y, MIN_Y, window.innerHeight - BIRD_SIZE * 0.42),
      rotation: 9
    };
  }

  function getBrandTarget() {
    if (!perchTarget) {
      return getCursorTarget();
    }

    const rect = perchTarget.getBoundingClientRect();
    const perchPointX = rect.left + rect.width * 0.6;
    const perchPointY = rect.bottom + 4;

    return {
      x: clamp(perchPointX - BRAND_ANCHOR.x, -BIRD_SIZE * 0.42, window.innerWidth - BIRD_SIZE * 0.68),
      y: clamp(perchPointY - BRAND_ANCHOR.y, MIN_Y, window.innerHeight - BIRD_SIZE * 0.42),
      rotation: -8
    };
  }

  function placeSpawnNear(targetX: number, targetY: number) {
    const fromLeft = targetX > window.innerWidth * 0.5;

    currentX = fromLeft ? -BIRD_SIZE * 1.15 : window.innerWidth + BIRD_SIZE * 0.2;
    currentY = clamp(targetY + 24, MIN_Y, window.innerHeight - BIRD_SIZE * 0.4);

    velocityX = fromLeft ? 70 : -70;
    velocityY = -14;
    currentRotation = velocityX > 0 ? 8 : -8;
  }

  function setModeToCursor() {
    const target = getCursorTarget();

    if (!visible || mode === 'hidden') {
      placeSpawnNear(target.x, target.y);
      visible = true;
    }

    fibonacciSequence = generateFibonacciSequence(18);
    fibonacciIndex = 0;
    spiralPhase = 0;
    spiralDirection = 1;
    spiralTurnCount = 0;
    mode = 'to-cursor';
    startLoop();
  }

  function setModeToBrand() {
    const target = getBrandTarget();

    if (!visible || mode === 'hidden') {
      placeSpawnNear(target.x, target.y);
      visible = true;
    }

    fibonacciSequence = generateFibonacciSequence(18);
    fibonacciIndex = 0;
    spiralPhase = 0;
    spiralDirection = 1;
    spiralTurnCount = 0;
    mode = 'to-brand';
    startLoop();
  }

  function setModeToExit() {
    if (!visible || mode === 'hidden' || mode === 'exiting') {
      return;
    }

    const toRight = pointerX < window.innerWidth * 0.5;

    exitTargetX = toRight ? window.innerWidth + EXIT_MARGIN : -EXIT_MARGIN;
    exitTargetY = clamp(currentY - 24, MIN_Y + 8, window.innerHeight - BIRD_SIZE * 0.42);
    mode = 'exiting';
    startLoop();
  }

  function scheduleIdleToCursor() {
    idleTimer = clearTimer(idleTimer);

    idleTimer = setTimeout(() => {
      if (enabled) {
        setModeToCursor();
      }
    }, IDLE_DELAY);
  }

  function onActiveInput() {
    if (!enabled) {
      return;
    }

    setModeToExit();
    scheduleIdleToCursor();
  }

  function getDynamicTarget() {
    if (mode === 'to-cursor' || mode === 'perched-cursor') {
      return getCursorTarget();
    }

    if (mode === 'to-brand' || mode === 'perched-brand') {
      return getBrandTarget();
    }

    return { x: exitTargetX, y: exitTargetY, rotation: currentRotation };
  }

  function updateSteering(dt: number) {
    const target = getDynamicTarget();

    let effectiveTargetX = target.x;
    let effectiveTargetY = target.y;

    if ((mode === 'to-cursor' || mode === 'to-brand') && !perched) {
      spiralPhase += (dt / FIBONACCI_REVOLVE_TIME) * Math.PI * 2;
      const coreDistance = vectorLength(target.x - currentX, target.y - currentY);
      const approachScale = clamp(coreDistance / SPIRAL_TIGHTEN_DISTANCE, 0, 1);
      const spiralOffset = computeSpiralOffset(spiralPhase, fibonacciIndex, target.x, target.y, approachScale);
      effectiveTargetX = spiralOffset.x;
      effectiveTargetY = spiralOffset.y;

      const turns = Math.floor(Math.abs(spiralPhase) / (Math.PI * 2));

      if (turns > spiralTurnCount) {
        spiralTurnCount = turns;
        fibonacciIndex = (fibonacciIndex + 1) % fibonacciSequence.length;

        if ((fibonacciIndex + 1) % 10 === 0) {
          spiralDirection *= -1;
        }
      }
    }

    const deltaX = effectiveTargetX - currentX;
    const deltaY = effectiveTargetY - currentY;
    const distance = vectorLength(deltaX, deltaY);

    const modeMaxSpeed = mode === 'exiting' ? MAX_SPEED * 1.12 : MAX_SPEED;
    const slowRadius = mode === 'exiting' ? SLOW_RADIUS * 1.35 : SLOW_RADIUS;

    let desiredSpeed = modeMaxSpeed;

    if (distance < slowRadius) {
      desiredSpeed = clamp((modeMaxSpeed * distance) / slowRadius, 18, modeMaxSpeed);
    }

    const desiredVX = distance > 0 ? (deltaX / distance) * desiredSpeed : 0;
    const desiredVY = distance > 0 ? (deltaY / distance) * desiredSpeed : 0;

    let steerX = desiredVX - velocityX;
    let steerY = desiredVY - velocityY;

    const steerMagnitude = vectorLength(steerX, steerY);
    const maxSteerThisFrame = MAX_FORCE * dt;

    if (steerMagnitude > maxSteerThisFrame && steerMagnitude > 0) {
      steerX = (steerX / steerMagnitude) * maxSteerThisFrame;
      steerY = (steerY / steerMagnitude) * maxSteerThisFrame;
    }

    velocityX += steerX;
    velocityY += steerY;

    const velocityMagnitude = vectorLength(velocityX, velocityY);

    if (velocityMagnitude > modeMaxSpeed && velocityMagnitude > 0) {
      velocityX = (velocityX / velocityMagnitude) * modeMaxSpeed;
      velocityY = (velocityY / velocityMagnitude) * modeMaxSpeed;
    }

    currentX += velocityX * dt;
    currentY += velocityY * dt;

    const speed = vectorLength(velocityX, velocityY);
    const velocityAngle = speed > 1 ? (Math.atan2(velocityY, velocityX) * 180) / Math.PI : target.rotation;
    const baseRotation = clamp(velocityAngle * 0.4, -20, 20);
    const desiredRotation = mode === 'perched-brand' ? -8 : mode === 'perched-cursor' ? 9 : baseRotation;

    currentRotation += (desiredRotation - currentRotation) * (reducedMotion ? 0.28 : 0.16);

    const reachedPerch = distance < PERCH_DISTANCE && speed < PERCH_SPEED;

    if (mode === 'to-cursor' && reachedPerch) {
      mode = 'perched-cursor';
    }

    if (mode === 'to-brand' && reachedPerch) {
      mode = 'perched-brand';
    }

    if (mode === 'exiting') {
      const leftGone = exitTargetX < 0 && currentX < -EXIT_MARGIN * 0.95;
      const rightGone = exitTargetX > window.innerWidth && currentX > window.innerWidth + EXIT_MARGIN * 0.2;

      if (leftGone || rightGone) {
        hideBirdImmediately();
        return;
      }
    }

    flying = mode === 'to-cursor' || mode === 'to-brand' || mode === 'exiting';
    perched = mode === 'perched-cursor' || mode === 'perched-brand';

    const speedRatio = clamp(speed / (MAX_SPEED * 1.1), 0, 1);
    wingDuration = Math.round(620 - speedRatio * 270);

    if (perched) {
      lookAngle = Math.sin(performance.now() * 0.0014) * 2.2 + Math.sin(performance.now() * 0.0005 + 1) * 1.1;
    } else {
      lookAngle = Math.sin(performance.now() * 0.004) * 0.8;
    }

    clearVectorIfTiny();
  }

  function tick(timestamp: number) {
    if (!visible || !enabled) {
      cancelLoop();
      return;
    }

    const dt = lastFrameTime ? Math.min((timestamp - lastFrameTime) / 1000, 0.033) : 1 / 60;
    lastFrameTime = timestamp;

    updateSteering(dt);

    if (visible) {
      frameHandle = requestAnimationFrame(tick);
    }
  }

  onMount(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncMotionPreference = () => {
      reducedMotion = motionQuery.matches;
    };

    const updatePointer = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      onActiveInput();
    };

    const handlePointerDown = () => {
      onActiveInput();
    };

    const handleScroll = () => {
      if (!enabled) {
        return;
      }

      idleTimer = clearTimer(idleTimer);
      scrollIdleTimer = clearTimer(scrollIdleTimer);

      setModeToBrand();

      scrollIdleTimer = setTimeout(() => {
        if (enabled) {
          scheduleIdleToCursor();
        }
      }, 300);
    };

    const handleResize = () => {
      if (!enabled) {
        return;
      }

      pointerX = clamp(pointerX, 0, window.innerWidth);
      pointerY = clamp(pointerY, 0, window.innerHeight);
    };

    const handleKeydown = () => {
      onActiveInput();
    };

    pointerX = window.innerWidth * 0.5;
    pointerY = window.innerHeight * 0.38;

    syncMotionPreference();
    activationTimer = setTimeout(() => {
      enabled = true;
      setModeToCursor();
    }, ACTIVATION_DELAY);

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
      hideBirdImmediately();
    };
  });
</script>

<div
  class:visible
  class:flying
  class:perched
  class="bird-layer"
  aria-hidden="true"
  style={`transform: translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentRotation}deg); --wing-duration: ${wingDuration}ms; --look-angle: ${lookAngle}deg;`}
>
  <div class="bird-body">
    <img class="bird-image" src="/media/images/bird-sketch.svg" alt="" />
  </div>
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

  .bird-body {
    width: 100%;
    height: 100%;
  }

  .bird-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.3));
    transform: rotate(var(--look-angle));
    transform-origin: 50px 78px;
  }

  .bird-layer.flying .bird-body {
    animation: body-float 980ms ease-in-out infinite alternate;
  }

  .bird-layer.flying .bird-image {
    animation: wing-flutter var(--wing-duration) ease-in-out infinite;
  }

  .bird-layer.perched .bird-body {
    animation: perched-breathe 2400ms ease-in-out infinite;
  }

  .bird-layer.perched .bird-image {
    animation: perched-look 2600ms ease-in-out infinite;
  }

  @keyframes body-float {
    0% {
      transform: translateY(-2px);
    }

    100% {
      transform: translateY(2px);
    }
  }

  @keyframes wing-flutter {
    0% {
      transform: rotate(calc(var(--look-angle) - 7deg)) scaleX(0.992);
    }

    100% {
      transform: rotate(calc(var(--look-angle) + 9deg)) scaleX(1.008);
    }
  }

  @keyframes perched-breathe {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-1.5px);
    }
  }

  @keyframes perched-look {
    0%,
    100% {
      transform: rotate(calc(var(--look-angle) - 1deg));
    }

    50% {
      transform: rotate(calc(var(--look-angle) + 2.2deg));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .bird-layer,
    .bird-layer.flying .bird-body,
    .bird-layer.flying .bird-image,
    .bird-layer.perched .bird-body,
    .bird-layer.perched .bird-image {
      animation: none;
      transition: none;
    }
  }
</style>

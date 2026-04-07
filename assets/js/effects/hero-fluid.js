const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function initHeroFluid(prefersReducedMotion) {
  const hero = document.querySelector("[data-hero-fluid]");

  if (!hero || prefersReducedMotion) {
    return;
  }

  const hasFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  let targetX = 0.5;
  let targetY = 0.5;
  let currentX = 0.5;
  let currentY = 0.5;
  let velocityX = 0;
  let velocityY = 0;
  let pointerInfluence = 0;
  let frameId = 0;
  let lastTime = performance.now();

  const render = (time) => {
    const idleX =
      Math.sin(time * 0.00022) * 0.018 + Math.cos(time * 0.0001) * 0.012;
    const idleY =
      Math.cos(time * 0.00018) * 0.016 + Math.sin(time * 0.00012) * 0.01;

    currentX += velocityX;
    currentY += velocityY;

    velocityX += (targetX - currentX) * 0.016;
    velocityY += (targetY - currentY) * 0.016;

    velocityX *= 0.9;
    velocityY *= 0.9;

    currentX = clamp(currentX, 0.14, 0.86);
    currentY = clamp(currentY, 0.18, 0.82);

    const leadX = clamp(currentX + idleX, 0.14, 0.86);
    const leadY = clamp(currentY + idleY, 0.18, 0.82);
    const driftX = clamp(
      0.5 + (leadX - 0.5) * -0.54 + Math.cos(time * 0.00014) * 0.024,
      0.16,
      0.84,
    );
    const driftY = clamp(
      0.5 + (leadY - 0.5) * -0.36 + Math.sin(time * 0.00016) * 0.02,
      0.18,
      0.82,
    );
    const accentX = clamp(
      (leadX + driftX) / 2 + Math.sin(time * 0.00028) * 0.015,
      0.18,
      0.82,
    );
    const accentY = clamp(
      (leadY + driftY) / 2 + Math.cos(time * 0.00024) * 0.012,
      0.2,
      0.8,
    );
    const activity = Math.min(Math.hypot(velocityX, velocityY) * 32, 0.12);
    const opacity = 0.22 + pointerInfluence * 0.08 + activity;

    hero.style.setProperty("--hero-fluid-x", `${(leadX * 100).toFixed(2)}%`);
    hero.style.setProperty("--hero-fluid-y", `${(leadY * 100).toFixed(2)}%`);
    hero.style.setProperty(
      "--hero-fluid-drift-x",
      `${(driftX * 100).toFixed(2)}%`,
    );
    hero.style.setProperty(
      "--hero-fluid-drift-y",
      `${(driftY * 100).toFixed(2)}%`,
    );
    hero.style.setProperty(
      "--hero-fluid-accent-x",
      `${(accentX * 100).toFixed(2)}%`,
    );
    hero.style.setProperty(
      "--hero-fluid-accent-y",
      `${(accentY * 100).toFixed(2)}%`,
    );
    hero.style.setProperty("--hero-fluid-opacity", opacity.toFixed(3));
  };

  const tick = (time) => {
    const delta = Math.min((time - lastTime) / 16.667, 2);

    lastTime = time;
    pointerInfluence +=
      ((hasFinePointer ? 1 : 0) - pointerInfluence) * 0.02 * delta;

    render(time);
    frameId = requestAnimationFrame(tick);
  };

  if (hasFinePointer) {
    hero.addEventListener(
      "pointermove",
      (event) => {
        const rect = hero.getBoundingClientRect();

        if (!rect.width || !rect.height) {
          return;
        }

        targetX = clamp((event.clientX - rect.left) / rect.width, 0.14, 0.86);
        targetY = clamp((event.clientY - rect.top) / rect.height, 0.18, 0.82);
        pointerInfluence = 1;
      },
      { passive: true },
    );

    hero.addEventListener(
      "pointerleave",
      () => {
        targetX = 0.5;
        targetY = 0.5;
        pointerInfluence = 0.6;
      },
      { passive: true },
    );
  }

  frameId = requestAnimationFrame(tick);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
      return;
    }

    if (!frameId) {
      lastTime = performance.now();
      frameId = requestAnimationFrame(tick);
    }
  });
}

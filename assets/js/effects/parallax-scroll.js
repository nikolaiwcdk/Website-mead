const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function initParallaxScroll(prefersReducedMotion) {
  if (prefersReducedMotion) {
    return;
  }

  const elements = document.querySelectorAll("[data-parallax]");

  if (elements.length === 0) {
    return;
  }

  const items = Array.from(elements).map((element) => ({
    element,
    speed: Number.parseFloat(element.dataset.parallaxSpeed || "0.1"),
    limit: Number.parseFloat(element.dataset.parallaxLimit || "28"),
  }));

  let ticking = false;

  const update = () => {
    const viewportCenter = window.innerHeight / 2;

    items.forEach(({ element, speed, limit }) => {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const delta = viewportCenter - elementCenter;
      const translateY = clamp(delta * speed, -limit, limit);

      element.style.setProperty("--parallax-y", `${translateY.toFixed(2)}px`);
    });

    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  window.addEventListener("orientationchange", requestUpdate, {
    passive: true,
  });

  requestUpdate();
}

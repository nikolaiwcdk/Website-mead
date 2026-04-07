function animateNumber(element, target, suffix) {
  const duration = 1200;
  const start = performance.now();

  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    const value = Math.floor(eased * target);

    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
}

export function initStatsCounter(prefersReducedMotion) {
  const section = document.querySelector(".stats-section");
  const numbers = document.querySelectorAll(".stat-number");

  if (!section || numbers.length === 0) {
    return;
  }

  const run = () => {
    numbers.forEach((element) => {
      const raw = element.textContent.trim();
      const target = Number(raw.replace(/[^0-9]/g, ""));
      const suffix = raw.includes("%") ? "%" : "";

      if (!Number.isFinite(target) || target <= 0) {
        return;
      }

      if (prefersReducedMotion) {
        element.textContent = `${target}${suffix}`;
        return;
      }

      animateNumber(element, target, suffix);
    });
  };

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    run();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      run();
      observer.disconnect();
    },
    { threshold: 0.35 },
  );

  observer.observe(section);
}

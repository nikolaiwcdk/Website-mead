const immediateRevealSelectors = [".hero-content"];

const observerRevealSelectors = [
  ".variants-grid",
  ".collab-card",
  ".about-card",
  ".stat-item",
  ".footer-main",
];

export function initReveal(prefersReducedMotion) {
  const immediateTargets = document.querySelectorAll(
    immediateRevealSelectors.join(","),
  );

  const observerTargets = document.querySelectorAll(
    observerRevealSelectors.join(","),
  );

  const targets = [...immediateTargets, ...observerTargets];

  if (targets.length === 0) {
    return;
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((element) => element.classList.add("reveal-visible"));
    return;
  }

  targets.forEach((element) => element.classList.add("reveal-pending"));

  const revealElement = (element) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        element.classList.add("reveal-visible");
      });
    });
  };

  immediateTargets.forEach((element) => {
    revealElement(element);
  });

  if (observerTargets.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        revealElement(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  observerTargets.forEach((element) => observer.observe(element));
}

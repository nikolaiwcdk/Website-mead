const revealSelectors = [
  ".hero-content",
  ".variant-card",
  ".collab-card",
  ".about-card",
  ".stat-item",
  ".footer-main",
];

export function initReveal(prefersReducedMotion) {
  const targets = document.querySelectorAll(revealSelectors.join(","));

  if (targets.length === 0) {
    return;
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((element) => element.classList.add("reveal-visible"));
    return;
  }

  targets.forEach((element) => element.classList.add("reveal-pending"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  targets.forEach((element) => observer.observe(element));
}

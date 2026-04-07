export function initBackToTop(prefersReducedMotion) {
  const button = document.querySelector(".back-to-top");
  const triggerSection = document.querySelector(".variants-section");

  if (!button || !triggerSection) {
    return;
  }

  let triggerOffset = 0;

  const computeTriggerOffset = () => {
    triggerOffset =
      triggerSection.getBoundingClientRect().top +
      window.scrollY -
      window.innerHeight * 0.2;
  };

  const updateVisibility = () => {
    const shouldShow = window.scrollY >= triggerOffset;
    button.classList.toggle("is-visible", shouldShow);
  };

  computeTriggerOffset();
  updateVisibility();

  window.addEventListener("resize", () => {
    computeTriggerOffset();
    updateVisibility();
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });
}

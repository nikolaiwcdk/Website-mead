const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function initVariantsLift(prefersReducedMotion) {
  if (prefersReducedMotion) {
    return;
  }

  const cards = document.querySelectorAll(".variant-card");

  if (cards.length === 0) {
    return;
  }

  const hasFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  if (!hasFinePointer) {
    return;
  }

  cards.forEach((card) => {
    const setNeutral = () => {
      card.style.setProperty("--variant-tilt-x", "0deg");
      card.style.setProperty("--variant-tilt-y", "0deg");
      card.classList.remove("is-tilting");
    };

    card.addEventListener(
      "pointermove",
      (event) => {
        const rect = card.getBoundingClientRect();

        if (!rect.width || !rect.height) {
          return;
        }

        const normalizedX = (event.clientX - rect.left) / rect.width;
        const normalizedY = (event.clientY - rect.top) / rect.height;
        const offsetX = clamp((normalizedX - 0.5) * 2, -1, 1);
        const offsetY = clamp((normalizedY - 0.5) * 2, -1, 1);
        const tiltX = (-offsetY * 3.2).toFixed(2);
        const tiltY = (offsetX * 4.2).toFixed(2);

        card.style.setProperty("--variant-tilt-x", `${tiltX}deg`);
        card.style.setProperty("--variant-tilt-y", `${tiltY}deg`);
        card.classList.add("is-tilting");
      },
      { passive: true },
    );

    card.addEventListener("pointerleave", setNeutral, { passive: true });
    card.addEventListener("blur", setNeutral, { passive: true });
  });
}

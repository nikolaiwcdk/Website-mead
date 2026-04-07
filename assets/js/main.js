import { initReveal } from "./effects/reveal.js";
import { initStatsCounter } from "./effects/stats-counter.js";
import { initSmoothScroll } from "./navigation/smooth-scroll.js";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

document.addEventListener("DOMContentLoaded", () => {
  initReveal(prefersReducedMotion);
  initStatsCounter(prefersReducedMotion);
  initSmoothScroll(prefersReducedMotion);
});

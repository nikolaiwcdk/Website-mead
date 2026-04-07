import { initReveal } from "./effects/reveal.js";
import { initStatsCounter } from "./effects/stats-counter.js";
import { initSmoothScroll } from "./navigation/smooth-scroll.js";
import { initBackToTop } from "./navigation/back-to-top.js";
import { initAgeVerification } from "./navigation/age-verification.js";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

document.addEventListener("DOMContentLoaded", () => {
  initAgeVerification();
  initReveal(prefersReducedMotion);
  initStatsCounter(prefersReducedMotion);
  initSmoothScroll(prefersReducedMotion);
  initBackToTop(prefersReducedMotion);
});

export function initSmoothScroll(prefersReducedMotion) {
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  const menuToggle = document.querySelector("#menu-toggle");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const selector = link.getAttribute("href");
      const target = document.querySelector(selector);

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      if (menuToggle && menuToggle.checked) {
        menuToggle.checked = false;
      }
    });
  });
}

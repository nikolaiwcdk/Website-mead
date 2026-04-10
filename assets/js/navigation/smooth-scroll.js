export function initSmoothScroll(prefersReducedMotion) {
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  const menuToggle = document.querySelector("#menu-toggle");
  const menuButton = document.querySelector(".burger-btn");

  const updateMenuExpandedState = () => {
    if (!menuToggle || !menuButton) {
      return;
    }

    menuButton.setAttribute("aria-expanded", String(menuToggle.checked));
    menuButton.setAttribute(
      "aria-label",
      menuToggle.checked ? "Close menu" : "Open menu",
    );
  };

  updateMenuExpandedState();

  if (menuToggle && menuButton) {
    menuToggle.addEventListener("change", updateMenuExpandedState);

    menuButton.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      menuToggle.checked = !menuToggle.checked;
      menuToggle.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

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

      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }

      target.focus({ preventScroll: true });

      if (menuToggle && menuToggle.checked) {
        menuToggle.checked = false;
        menuToggle.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  });
}

export function initAgeVerification() {
  const modal = document.getElementById("age-verification-modal");
  const form = document.getElementById("age-verification-form");
  const errorMessage = document.getElementById("age-error");
  const birthdateInput = document.getElementById("birthdate");
  const modalContent = modal?.querySelector(".age-modal-content");
  const body = document.body;
  const root = document.documentElement;
  const LOCK_CLASS = "age-gate-locked";
  const getStoredValue = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const setStoredValue = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage errors and continue with an in-memory session only.
    }
  };

  if (!modal || !form || !errorMessage || !birthdateInput || !body) {
    return;
  }

  const setGateState = (isUnlocked) => {
    body.classList.toggle(LOCK_CLASS, !isUnlocked);
    modal.classList.toggle("hidden", isUnlocked);
    modal.setAttribute("aria-hidden", String(isUnlocked));
    root.classList.remove("age-gate-pending");

    if (isUnlocked) {
      modal.style.display = "";
      if (modalContent) {
        modalContent.style.display = "";
      }
    }
  };

  const enforceGate = () => {
    const verified = getStoredValue("ageVerified") === "true";
    if (verified) {
      return;
    }

    body.classList.add(LOCK_CLASS);
    modal.classList.remove("hidden");

    if (modal.style.display === "none") {
      modal.style.display = "";
    }

    if (modalContent && modalContent.style.display === "none") {
      modalContent.style.display = "";
    }
  };

  // Check if user has already verified age
  const isAgeVerified = getStoredValue("ageVerified") === "true";

  if (isAgeVerified) {
    setGateState(true);
    return;
  }

  setGateState(false);
  enforceGate();

  const restoreGate = () => {
    enforceGate();
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      restoreGate();
    }
  });

  window.addEventListener("focus", restoreGate);
  window.addEventListener("pageshow", restoreGate);

  // Prevent closing modal by clicking outside or pressing Escape
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      e.preventDefault();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      e.preventDefault();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const birthdate = new Date(birthdateInput.value);

    if (Number.isNaN(birthdate.getTime())) {
      errorMessage.style.display = "block";
      birthdateInput.focus();
      return;
    }

    const today = new Date();

    // Calculate age
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthdate.getDate())
    ) {
      age--;
    }

    if (age >= 18) {
      // Age verified - store in localStorage
      setStoredValue("ageVerified", "true");
      setStoredValue("ageVerifiedDate", today.toISOString());

      // Unlock site
      setGateState(true);

      // Clear form
      form.reset();
      errorMessage.style.display = "none";
    } else {
      // Too young
      errorMessage.style.display = "block";
      birthdateInput.focus();
    }
  });
}

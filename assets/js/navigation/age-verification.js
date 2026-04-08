export function initAgeVerification() {
  const modal = document.getElementById("age-verification-modal");
  const confirmButton = document.getElementById("age-confirm-btn");
  const denyButton = document.getElementById("age-deny-btn");
  const cookieAllowButton = document.getElementById("age-cookie-allow-btn");
  const cookieRejectButton = document.getElementById("age-cookie-reject-btn");
  const cookieManageButton = document.getElementById("age-cookie-manage-btn");
  const rememberCheckbox = document.getElementById("age-remember-device");
  const errorMessage = document.getElementById("age-error");
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
  const getSessionValue = (key) => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const setSessionValue = (key, value) => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Ignore storage errors.
    }
  };
  const isVerified = () =>
    getStoredValue("ageVerified") === "true" ||
    getSessionValue("ageVerifiedSession") === "true";
  let tamperObserver = null;
  let isRepairingGate = false;

  let cookieChoice =
    getStoredValue("cookieConsentChoice") ||
    getSessionValue("cookieConsentChoiceSession") ||
    "";

  if (
    !modal ||
    !confirmButton ||
    !denyButton ||
    !cookieAllowButton ||
    !cookieRejectButton ||
    !cookieManageButton ||
    !rememberCheckbox ||
    !errorMessage ||
    !body
  ) {
    return;
  }

  const updateCookieButtons = () => {
    cookieAllowButton.classList.toggle(
      "is-selected",
      cookieChoice === "accepted",
    );
    cookieRejectButton.classList.toggle(
      "is-selected",
      cookieChoice === "rejected-optional",
    );
    cookieManageButton.classList.toggle(
      "is-selected",
      cookieChoice === "managed",
    );
  };

  const updateAgeActionState = () => {
    const hasCookieChoice = Boolean(cookieChoice);

    confirmButton.disabled = !hasCookieChoice;
    confirmButton.setAttribute("aria-disabled", String(!hasCookieChoice));
    denyButton.disabled = !hasCookieChoice;
    denyButton.setAttribute("aria-disabled", String(!hasCookieChoice));
    rememberCheckbox.disabled = !hasCookieChoice;
    modal.classList.toggle("cookie-choice-required", !hasCookieChoice);
    modal.classList.toggle("cookie-choice-complete", hasCookieChoice);
  };

  updateCookieButtons();
  updateAgeActionState();

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
    if (isVerified()) {
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

  const installTamperGuard = () => {
    if (tamperObserver) {
      return;
    }

    tamperObserver = new MutationObserver(() => {
      if (isVerified() || isRepairingGate) {
        return;
      }

      isRepairingGate = true;
      window.requestAnimationFrame(() => {
        enforceGate();
        updateAgeActionState();
        isRepairingGate = false;
      });
    });

    const observerOptions = {
      attributes: true,
      attributeFilter: ["class", "style", "aria-hidden"],
    };

    tamperObserver.observe(modal, observerOptions);
    if (modalContent) {
      tamperObserver.observe(modalContent, observerOptions);
    }
    tamperObserver.observe(body, observerOptions);
    tamperObserver.observe(root, observerOptions);
  };

  const removeTamperGuard = () => {
    if (!tamperObserver) {
      return;
    }

    tamperObserver.disconnect();
    tamperObserver = null;
  };

  // Check if user has already verified age
  const isAgeVerified = isVerified();

  if (isAgeVerified) {
    removeTamperGuard();
    setGateState(true);
    return;
  }

  setGateState(false);
  enforceGate();
  installTamperGuard();

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

  confirmButton.addEventListener("click", () => {
    if (!cookieChoice) {
      errorMessage.textContent =
        "Please choose a cookie preference to continue.";
      errorMessage.style.display = "block";
      return;
    }

    if (rememberCheckbox.checked) {
      setStoredValue("ageVerified", "true");
      setStoredValue("ageVerifiedDate", new Date().toISOString());
      setStoredValue("cookieConsentChoice", cookieChoice);
    } else {
      setSessionValue("ageVerifiedSession", "true");
      setSessionValue("cookieConsentChoiceSession", cookieChoice);
    }
    errorMessage.textContent = "You must be 18 years or older to enter.";
    errorMessage.style.display = "none";
    removeTamperGuard();
    setGateState(true);
  });

  cookieAllowButton.addEventListener("click", () => {
    cookieChoice = "accepted";
    errorMessage.style.display = "none";
    updateCookieButtons();
    updateAgeActionState();
  });

  cookieRejectButton.addEventListener("click", () => {
    cookieChoice = "rejected-optional";
    errorMessage.style.display = "none";
    updateCookieButtons();
    updateAgeActionState();
  });

  cookieManageButton.addEventListener("click", () => {
    cookieChoice = "managed";
    errorMessage.style.display = "none";
    updateCookieButtons();
    updateAgeActionState();
  });

  denyButton.addEventListener("click", () => {
    errorMessage.textContent = "You must be 18 years or older to enter.";
    errorMessage.style.display = "block";
    setGateState(false);
  });
}

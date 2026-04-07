export function initAgeVerification() {
  const modal = document.getElementById("age-verification-modal");
  const form = document.getElementById("age-verification-form");
  const errorMessage = document.getElementById("age-error");
  const birthdateInput = document.getElementById("birthdate");

  // Check if user has already verified age
  const isAgeVerified = localStorage.getItem("ageVerified");

  if (isAgeVerified) {
    modal.classList.add("hidden");
    return;
  }

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
      localStorage.setItem("ageVerified", true);
      localStorage.setItem("ageVerifiedDate", today.toISOString());

      // Hide modal
      modal.classList.add("hidden");

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

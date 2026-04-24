const signupForm = document.getElementById("signupForm");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const signupMessage = document.getElementById("signupMessage");
const roleButtons = document.querySelectorAll(".role-btn");
const roleHint = document.getElementById("roleHint");
const accountTypeInput = document.getElementById("accountType");
const emailLabel = document.getElementById("emailLabel");
const submitBtn = document.getElementById("submitBtn");

function showMessage(text, type) {
  signupMessage.textContent = text;
  signupMessage.classList.remove("error", "success");
  if (type) {
    signupMessage.classList.add(type);
  }
}

function isEmailValid(email) {
  return /.+@.+\..+/.test(email);
}

function isUniversityEmail(email) {
  return /.+@.+\..+/.test(email) && (email.endsWith(".edu") || email.includes("ac."));
}

function getAccounts() {
  const raw = localStorage.getItem("micromateAccounts");
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem("micromateAccounts", JSON.stringify(accounts));
}

function applyRole(role) {
  accountTypeInput.value = role;

  roleButtons.forEach((button) => {
    const isCurrentRole = button.dataset.role === role;
    button.classList.toggle("active", isCurrentRole);
    button.setAttribute("aria-pressed", String(isCurrentRole));
  });

  if (role === "developer") {
    emailLabel.textContent = "Developer Email";
    emailInput.placeholder = "you@university.edu";
    roleHint.textContent = "Developers must use a valid university email.";
    submitBtn.textContent = "Create Developer Account";
  } else {
    emailLabel.textContent = "Email";
    emailInput.placeholder = "you@example.com";
    roleHint.textContent = "Customers can request services and manage orders.";
    submitBtn.textContent = "Create Customer Account";
  }
}

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyRole(button.dataset.role);
    showMessage("", "");
  });
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const role = accountTypeInput.value;

  if (!fullName) {
    showMessage("Please enter your full name.", "error");
    return;
  }

  if (!isEmailValid(email)) {
    showMessage("Please enter a valid email address.", "error");
    return;
  }

  if (role === "developer" && !isUniversityEmail(email)) {
    showMessage("Developer accounts require a university email.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.", "error");
    return;
  }

  const accounts = getAccounts();
  const existing = accounts.find((account) => account.email === email && account.role === role);

  if (existing) {
    showMessage("An account already exists for this email and role.", "error");
    return;
  }

  accounts.push({
    fullName,
    email,
    password,
    role
  });
  saveAccounts(accounts);

  showMessage("Account created successfully. Redirecting to login...", "success");

  setTimeout(() => {
    window.location.href = `login.html?role=${role}&email=${encodeURIComponent(email)}`;
  }, 1000);
});

applyRole("customer");

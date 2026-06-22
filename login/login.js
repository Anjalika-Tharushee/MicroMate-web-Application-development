const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMeInput = document.getElementById("rememberMe");
const loginMessage = document.getElementById("loginMessage");
const togglePasswordBtn = document.getElementById("togglePassword");
const roleButtons = document.querySelectorAll(".role-btn");
const roleHint = document.getElementById("roleHint");
const accountTypeInput = document.getElementById("accountType");
const emailLabel = document.getElementById("emailLabel");
const submitBtn = document.getElementById("submitBtn");

function showMessage(text, type) {
  loginMessage.textContent = text;
  loginMessage.classList.remove("error", "success");
  if (type) {
    loginMessage.classList.add(type);
  }
}

function isUniversityEmail(email) {
  return /.+@.+\..+/.test(email) && (email.endsWith(".edu") || email.includes("ac."));
}

function isEmailValid(email) {
  return /.+@.+\..+/.test(email);
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
    roleHint.textContent = "Developers can manage listings, proposals, and deliveries.";
    submitBtn.textContent = "Login as Developer";
  } else {
    emailLabel.textContent = "Email";
    emailInput.placeholder = "you@example.com";
    roleHint.textContent = "Customers can request services and track orders.";
    submitBtn.textContent = "Login as Customer";
  }
}

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyRole(button.dataset.role);
    showMessage("", "");
  });
});

togglePasswordBtn.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePasswordBtn.textContent = isHidden ? "Hide" : "Show";
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const role = accountTypeInput.value;

  if (!isEmailValid(email)) {
    showMessage("Please enter a valid email address.", "error");
    return;
  }

  if (role === "developer" && !isUniversityEmail(email)) {
    showMessage("Developer login requires a valid university email address.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.", "error");
    return;
  }

  if (rememberMeInput.checked) {
    localStorage.setItem("micromateRememberedLogin", JSON.stringify({ email, role }));
  } else {
    localStorage.removeItem("micromateRememberedLogin");
  }

  const roleLabel = role === "developer" ? "Developer" : "Customer";
  showMessage(`${roleLabel} login successful. Redirecting to marketplace...`, "success");
  setTimeout(() => {
    window.location.href = `index.html?role=${role}`;
  }, 1000);
});

const remembered = localStorage.getItem("micromateRememberedLogin");
if (remembered) {
  try {
    const parsed = JSON.parse(remembered);
    if (parsed && parsed.email) {
      emailInput.value = parsed.email;
      rememberMeInput.checked = true;
    }
    if (parsed && parsed.role) {
      applyRole(parsed.role);
    }
  } catch {
    localStorage.removeItem("micromateRememberedLogin");
  }
}

const query = new URLSearchParams(window.location.search);
const queryRole = query.get("role");
const queryEmail = query.get("email");

if (queryRole === "customer" || queryRole === "developer") {
  applyRole(queryRole);
}

if (queryEmail) {
  emailInput.value = queryEmail;
}

if (!remembered) {
  applyRole("customer");
}

// 1. Firebase Configuration Matrix
const firebaseConfig = {
  apiKey: "AIzaSyDIrpzFWq5SMUaVIhdVC9mV9Uq5ORiIT_k",
  authDomain: "micromate-25a16.firebaseapp.com",
  projectId: "micromate-25a16",
  storageBucket: "micromate-25a16.firebasestorage.app",
  messagingSenderId: "297225820043",
  appId: "1:297225820043:web:6f9d5c3d81be425b03818e"
};

// Initialize Firebase Application Context
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Capture HTML Document Object Elements
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const accountTypeInput = document.getElementById("accountType");
const roleBtns = document.querySelectorAll(".role-btn");
const roleHint = document.getElementById("roleHint");
const submitBtn = document.getElementById("submitBtn");
const googleBtn = document.getElementById("googleBtn");
const microsoftBtn = document.getElementById("microsoftBtn");

function updateLoginRole(selectedRole) {
  if (accountTypeInput) {
    accountTypeInput.value = selectedRole;
  }

  if (selectedRole === "customer") {
    if (roleHint) roleHint.textContent = "Customers can request services and track orders.";
    if (submitBtn) submitBtn.textContent = "Login as Customer";
  } else {
    if (roleHint) roleHint.textContent = "Service providers can offer services and view customer requests.";
    if (submitBtn) submitBtn.textContent = "Login as Service Provider";
  }
}

// CUSTOMER / SERVICE PROVIDER BUTTON TOGGLE LOGIC FOR LOGIN
if (roleBtns.length > 0) {
  roleBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      roleBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });

      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      const selectedRole = btn.getAttribute("data-role");
      updateLoginRole(selectedRole);
    });
  });

  const requestedRole = new URLSearchParams(window.location.search).get("role");
  if (requestedRole === "provider") {
    const providerBtn = document.querySelector(".role-btn[data-role='developer']");
    const customerBtn = document.querySelector(".role-btn[data-role='customer']");
    if (providerBtn) {
      roleBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      providerBtn.classList.add("active");
      providerBtn.setAttribute("aria-pressed", "true");
      updateLoginRole("developer");
    }
    if (customerBtn) {
      customerBtn.setAttribute("aria-pressed", "false");
    }
  }
}

// standard email/password login form submission logic
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    if (!email || !password) {
      loginMessage.style.color = "red";
      loginMessage.textContent = "Please fill in all fields.";
      return;
    }

    loginMessage.style.color = "orange";
    loginMessage.textContent = "Logging in...";

    // 1. Authenticate credentials via Firebase Auth
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // 2. Fetch the logged in user profile document from Firestore 'users' collection
        return db.collection("users").doc(user.uid).get();
      })
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          loginMessage.style.color = "green";
          loginMessage.textContent = `Welcome back, ${userData.fullName || 'User'}! Redirecting...`;

          // 💡 3. DYNAMIC REDIRECT CHECK: Read the role saved in database and send to correct dashboard
          setTimeout(() => {
            if (userData.role === "developer") {
              window.location.href = "../developer-dashboard.html"; // Developer Dashboard එකට
            } else {
              window.location.href = "../customer-dashboard.html"; // Customer Dashboard එකට
            }
          }, 1500);
        } else {
          loginMessage.style.color = "red";
          loginMessage.textContent = "User role data not found in database.";
        }
      })
      .catch((error) => {
        console.error("Login Error:", error);
        loginMessage.style.color = "red";
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
          loginMessage.textContent = "Invalid email or password. Please try again.";
        } else {
          loginMessage.textContent = error.message;
        }
      });
  });
}

// google login button click logic
if (googleBtn) {
  googleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    googleBtn.disabled = true;

    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        return db.collection("users").doc(user.uid).get().then((doc) => {
            if (!doc.exists) {
                const chosenRole = accountTypeInput ? accountTypeInput.value : "customer";
                return db.collection("users").doc(user.uid).set({
                    fullName: user.displayName,
                    email: user.email,
                    role: chosenRole,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => { return db.collection("users").doc(user.uid).get(); });
            }
            return doc;
        });
      })
      .then((doc) => {
        if (doc && doc.exists) {
          const userData = doc.data();
          loginMessage.style.color = "green";
          loginMessage.textContent = "Google Login Successful! Redirecting...";
          
          // 💡 DYNAMIC REDIRECT CHECK: For Google Users
          setTimeout(() => {
            if (userData.role === "developer") {
              window.location.href = "../developer-dashboard.html";
            } else {
              window.location.href = "../customer-dashboard.html";
            }
          }, 1500);
        }
      })
      .catch((error) => {
        console.error("Google Auth Error:", error);
        googleBtn.disabled = false;
        if (error.code !== "auth/popup-closed-by-user") {
          alert("Google Login failed: " + error.message);
        }
      });
  });
}

// microsoft login button click logic
if (microsoftBtn) {
  microsoftBtn.addEventListener("click", (e) => {
    e.preventDefault();
    microsoftBtn.disabled = true;

    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    provider.addScope('mail.read');
    provider.addScope('user.read');

    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        return db.collection("users").doc(user.uid).get().then((doc) => {
            if (!doc.exists) {
                const chosenRole = accountTypeInput ? accountTypeInput.value : "customer";
                return db.collection("users").doc(user.uid).set({
                    fullName: user.displayName || "Microsoft User",
                    email: user.email,
                    role: chosenRole,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => { return db.collection("users").doc(user.uid).get(); });
            }
            return doc;
        });
      })
      .then((doc) => {
        if (doc && doc.exists) {
          const userData = doc.data();
          loginMessage.style.color = "green";
          loginMessage.textContent = "Microsoft Login Successful! Redirecting...";
          
          // 💡 DYNAMIC REDIRECT CHECK: For Microsoft Users
          setTimeout(() => {
            if (userData.role === "developer") {
              window.location.href = "../developer-dashboard.html";
            } else {
              window.location.href = "../customer-dashboard.html";
            }
          }, 1500);
        }
      })
      .catch((error) => {
        console.error("Microsoft Auth Error:", error);
        microsoftBtn.disabled = false;
        if (error.code !== "auth/popup-closed-by-user") {
          alert("Microsoft Login failed: " + error.message);
        }
      });
  });
}
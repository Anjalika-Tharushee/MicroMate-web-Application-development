// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIrpzFWq5SMUaVIhdVC9mV9Uq5ORiIT_k",
  authDomain: "micromate-25a16.firebaseapp.com",
  projectId: "micromate-25a16",
  storageBucket: "micromate-25a16.firebasestorage.app",
  messagingSenderId: "297225820043",
  appId: "1:297225820043:web:6f9d5c3d81be425b03818e"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// HTML Elements
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const accountTypeInput = document.getElementById("accountType");
const roleBtns = document.querySelectorAll(".role-btn");
const roleHint = document.getElementById("roleHint");
const submitBtn = document.getElementById("submitBtn");
const googleBtn = document.getElementById("googleBtn");

// customer developer logic 
if (roleBtns.length > 0) {
  roleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all role buttons
      roleBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });

      // Add active class to the clicked button
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      // Update hidden input value ('customer' or 'developer')
      const selectedRole = btn.getAttribute("data-role");
      if (accountTypeInput) {
        accountTypeInput.value = selectedRole;
      }

      // Update helper text and action button name dynamically
      if (selectedRole === "customer") {
        if (roleHint) roleHint.textContent = "Customers can request services and track orders.";
        if (submitBtn) submitBtn.textContent = "Login as Customer";
      } else {
        if (roleHint) roleHint.textContent = "Developers can offer services and view customer requests.";
        if (submitBtn) submitBtn.textContent = "Login as Developer";
      }
    });
  });
}


// Form Submit - Email & Password Sign In
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

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Fetch user data from the "users" collection
        return db.collection("users").doc(user.uid).get();
      })
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          loginMessage.style.color = "green";
          loginMessage.textContent = `Welcome back, ${userData.fullName || 'User'}! Redirecting...`;

          // Redirect to home.html since login is now the main landing page (index.html)
          setTimeout(() => {
            window.location.href = "home.html"; 
          }, 1500);
        } else {
          loginMessage.style.color = "red";
          loginMessage.textContent = "User role data not found.";
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

// Google Login Logic (Popup Method with Multiple Overlay Request Fix)
if (googleBtn) {
  googleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    // Disable the button to prevent multiple concurrent popup overlay requests
    googleBtn.disabled = true;

    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        
        // Fetch or establish user profile record in Firestore
        return db.collection("users").doc(user.uid).get().then((doc) => {
            if (!doc.exists) {
                // If it's a first-time Google sign-in, default role to 'customer'
                return db.collection("users").doc(user.uid).set({
                    fullName: user.displayName,
                    email: user.email,
                    role: "customer",
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    return db.collection("users").doc(user.uid).get();
                });
            }
            return doc;
        });
      })
      .then((doc) => {
        if (doc && doc.exists) {
          loginMessage.style.color = "green";
          loginMessage.textContent = "Google Login Successful! Redirecting...";
          
          // Redirect to home.html after successful Google authentication
          setTimeout(() => {
              window.location.href = "home.html"; 
          }, 1500);
        }
      })
      .catch((error) => {
        console.error("Google Auth Error:", error);
        // Re-enable button on error so user can attempt to click again
        googleBtn.disabled = false;
        
        if (error.code !== "auth/popup-closed-by-user") {
          alert("Google Login failed: " + error.message);
        }
      });
  });
}
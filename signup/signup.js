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
const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");
const accountTypeInput = document.getElementById("accountType");
const roleBtns = document.querySelectorAll(".role-btn");
const roleHint = document.getElementById("roleHint");
const submitBtn = document.getElementById("submitBtn");
const googleBtn = document.getElementById("googleBtn");

// logic for role selection buttons (customer/developer) to update hidden input and helper text dynamically
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
        if (roleHint) roleHint.textContent = "Customers can request services and manage orders.";
        if (submitBtn) submitBtn.textContent = "Create Customer Account";
      } else {
        if (roleHint) roleHint.textContent = "Developers can offer services and view customer requests.";
        if (submitBtn) submitBtn.textContent = "Create Developer Account";
      }
    });
  });
}

// Form Submit - Email & Password Sign Up
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = signupForm.fullName.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value;
    const confirmPassword = signupForm.confirmPassword.value;
    const role = accountTypeInput ? accountTypeInput.value : "customer"; 

    if (password !== confirmPassword) {
      signupMessage.style.color = "red";
      signupMessage.textContent = "Passwords do not match!";
      return;
    }

    if (password.length < 6) {
      signupMessage.style.color = "red";
      signupMessage.textContent = "Password should be at least 6 characters.";
      return;
    }

    signupMessage.style.color = "orange";
    signupMessage.textContent = "Creating account...";

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Save user details to Firestore record
        return db.collection("users").doc(user.uid).set({
          fullName: fullName,
          email: email,
          role: role, 
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .then(() => {
        signupMessage.style.color = "green";
        signupMessage.textContent = "Account created successfully! Redirecting to login...";
        signupForm.reset();
        
        // 💡 FIXED ROUTING: Redirect smoothly to the root landing page (index.html)
        setTimeout(() => {
          window.location.href = "../index.html"; 
        }, 2000);
      })
      .catch((error) => {
        console.error("Signup Error:", error);
        signupMessage.style.color = "red";
        if (error.code === "auth/email-already-in-use") {
          signupMessage.textContent = "The email address is already in use by another account.";
        } else {
          signupMessage.textContent = error.message;
        }
      });
  });
}

// Google Sign-Up Logic (Popup Method with Multiple Overlay Request Fix)
if (googleBtn) {
  googleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    // Disable button state to prevent dual popup invocation conflicts
    googleBtn.disabled = true;

    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        const role = accountTypeInput ? accountTypeInput.value : "customer"; 

        // Check if user already has an active record in Firestore
        return db.collection("users").doc(user.uid).get().then((doc) => {
            if (!doc.exists) {
                // Provision a new user profile with selected structural role
                return db.collection("users").doc(user.uid).set({
                    fullName: user.displayName,
                    email: user.email,
                    role: role,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        });
      })
      .then(() => {
        signupMessage.style.color = "green";
        signupMessage.textContent = "Google Sign-Up Successful! Redirecting...";
        
        // Redirect directly to the workspace homepage after validation
        setTimeout(() => {
            window.location.href = "../home.html"; 
        }, 1500);
      })
      .catch((error) => {
        console.error("Google Auth Error:", error);
        googleBtn.disabled = false;
        
        if (error.code !== "auth/popup-closed-by-user") {
          alert("Google Sign-In failed: " + error.message);
        }
      });
  });
}
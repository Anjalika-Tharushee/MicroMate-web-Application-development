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
const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");
const accountTypeInput = document.getElementById("accountType");
const roleBtns = document.querySelectorAll(".role-btn");
const roleHint = document.getElementById("roleHint");
const submitBtn = document.getElementById("submitBtn");
const googleBtn = document.getElementById("googleBtn");
const microsoftBtn = document.getElementById("microsoftBtn");

// select logic for role selection buttons
if (roleBtns.length > 0) {
  roleBtns.forEach((btn) => {
    btn.addEventListener("click", function(e) {
      e.preventDefault(); // Prevent page refresh or implicit form dispatch behavior

      // 1. Remove active visual identifier states from all elements
      roleBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });

      // 2. Establish active visual identifier state on clicked context element instance
      this.classList.add("active");
      this.setAttribute("aria-pressed", "true");

      // 3. Inject selected metadata value state tracking placeholder parameter
      const selectedRole = this.getAttribute("data-role");
      if (accountTypeInput) {
        accountTypeInput.value = selectedRole;
      }

      // 4. Update structural contextual text instructions dynamically
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


// Form Submit - Standard Email & Password Sign Up Flow Execution Interceptor
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
        // Construct and establish profile collection mapping structural parameters record inside Firestore
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
        
        // Form redirection sequence pipeline down to identity gateway checkpoint
        setTimeout(() => {
          window.location.href = "../index.html"; 
        }, 2000);
      })
      .catch((error) => {
        console.error("Signup Error Event Context:", error);
        signupMessage.style.color = "red";
        if (error.code === "auth/email-already-in-use") {
          signupMessage.textContent = "The email address is already in use by another account.";
        } else {
          signupMessage.textContent = error.message;
        }
      });
  });
}

// Federated Identity Provider Access Interceptors: Google Sign-Up
if (googleBtn) {
  googleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    googleBtn.disabled = true;

    const provider = new firebase.auth.GoogleAuthProvider();
    const role = accountTypeInput ? accountTypeInput.value : "customer"; 

    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        return db.collection("users").doc(user.uid).get().then((doc) => {
            if (!doc.exists) {
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
        
        // Execute instant workspace structural routing rules criteria based on user account type properties
        setTimeout(() => {
            if (role === "developer") {
                window.location.href = "../developer-dashboard.html";
            } else {
                window.location.href = "../customer-dashboard.html";
            }
        }, 1500);
      })
      .catch((error) => {
        console.error("Google Authentication Stack Frame Failure:", error);
        googleBtn.disabled = false;
        if (error.code !== "auth/popup-closed-by-user") {
          alert("Google Sign-In failed: " + error.message);
        }
      });
  });
}

// Federated Identity Provider Access Interceptors: Microsoft Sign-Up
if (microsoftBtn) {
  microsoftBtn.addEventListener("click", (e) => {
    e.preventDefault();
    microsoftBtn.disabled = true;

    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    const role = accountTypeInput ? accountTypeInput.value : "customer"; 

    provider.addScope('mail.read');
    provider.addScope('user.read');

    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        return db.collection("users").doc(user.uid).get().then((doc) => {
            if (!doc.exists) {
                return db.collection("users").doc(user.uid).set({
                    fullName: user.displayName || "Microsoft User",
                    email: user.email,
                    role: role,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        });
      })
      .then(() => {
        signupMessage.style.color = "green";
        signupMessage.textContent = "Microsoft Sign-Up Successful! Redirecting...";
        
        // Execute instant workspace structural routing rules criteria based on user account type properties
        setTimeout(() => {
            if (role === "developer") {
                window.location.href = "../developer-dashboard.html";
            } else {
                window.location.href = "../customer-dashboard.html";
            }
        }, 1500);
      })
      .catch((error) => {
        console.error("Microsoft Authentication Stack Frame Failure:", error);
        microsoftBtn.disabled = false;
        if (error.code !== "auth/popup-closed-by-user") {
          alert("Microsoft Sign-In failed: " + error.message);
        }
      });
  });
}
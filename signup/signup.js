// 1. Firebase Configuration 
const firebaseConfig = {
  apiKey: "AIzaSyDIrpzFWq5SMUaVIhdVC9mV9Uq5ORiIT_k",
  authDomain: "micromate-25a16.firebaseapp.com",
  projectId: "micromate-25a16",
  storageBucket: "micromate-25a16.firebasestorage.app",
  messagingSenderId: "297225820043",
  appId: "1:297225820043:web:6f9d5c3d81be425b03818e"
};

// Firebase Initialize 
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// HTML elements include ID
const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // get input from the form
    const fullName = signupForm.fullName.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value;
    const confirmPassword = signupForm.confirmPassword.value;

  //logic for role selection
const accountTypeInput = document.getElementById("accountType");
const roleBtns = document.querySelectorAll(".role-btn");
const roleHint = document.getElementById("roleHint");
const submitBtn = document.getElementById("submitBtn");

roleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
  
    roleBtns.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });

    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");

    
    const selectedRole = btn.getAttribute("data-role");
    accountTypeInput.value = selectedRole;

  
    if (selectedRole === "customer") {
      roleHint.textContent = "Customers can request services and manage orders.";
      submitBtn.textContent = "Create Customer Account";
    } else {
      roleHint.textContent = "Developers can offer services and view customer requests.";
      submitBtn.textContent = "Create Developer Account";
    }
  });
});
    
    //  get (customer/developer) 
    const role = document.getElementById("accountType").value; 

    // 2. Client-side Validation 
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

    // 3. Firebase Auth create UserWithEmailAndPassword method to create a new user
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        //  (Name, Role) save the user data in Firestore
        return db.collection("users").doc(user.uid).set({
          fullName: fullName,
          email: email,
          role: role, // 'customer' or'developer'
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .then(() => {
        // move to login page after successful signup
        signupMessage.style.color = "green";
        signupMessage.textContent = "Account created successfully! Redirecting to login...";
        signupForm.reset();
        
        setTimeout(() => {
          window.location.href = "../login/login.html"; // Login පිටුවට මාරු කිරීම
        }, 2000);
      })
      .catch((error) => {
        console.error("Signup Error:", error);
        signupMessage.style.color = "red";
        
        // Display specific error message for email already in use
        if (error.code === "auth/email-already-in-use") {
          signupMessage.textContent = "The email address is already in use by another account.";
        } else {
          signupMessage.textContent = error.message;
        }
      });
  });
}
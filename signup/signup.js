// 1. Firebase Configuration (ඔයාගේ Firebase Project එකේ Keys ටික)
const firebaseConfig = {
  apiKey: "AIzaSyDIrpzFWq5SMUaVIhdVC9mV9Uq5ORiIT_k",
  authDomain: "micromate-25a16.firebaseapp.com",
  projectId: "micromate-25a16",
  storageBucket: "micromate-25a16.firebasestorage.app",
  messagingSenderId: "297225820043",
  appId: "1:297225820043:web:6f9d5c3d81be425b03818e"
};

// Firebase Initialize කිරීම
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// HTML Elements (HTML එකේ තියෙන IDs/Classes අනුව)
const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");
const accountTypeInput = document.getElementById("accountType");
const roleBtns = document.querySelectorAll(".role-btn");
const roleHint = document.getElementById("roleHint");
const submitBtn = document.getElementById("submitBtn");


roleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // remove active class from all buttons and set aria-pressed to false
    roleBtns.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });

    // click botton active
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");

    // Hidden Input
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


// 2. Form submit 
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = signupForm.fullName.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value;
    const confirmPassword = signupForm.confirmPassword.value;
    
    
    const role = accountTypeInput.value; 

    // checking passwords match and length
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

    // Firebase Auth Create Account 
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

      
        return db.collection("users").doc(user.uid).set({
          fullName: fullName,
          email: email,
          role: role, // 'customer' හෝ 'developer' ලෙස Firestore එකට සේව් වේ
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .then(() => {
        signupMessage.style.color = "green";
        signupMessage.textContent = "Account created successfully! Redirecting to login...";
        signupForm.reset();
        
        setTimeout(() => {
          window.location.href = "../login/login.html";
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


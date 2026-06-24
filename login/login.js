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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// HTML Form Elements
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Form එක refresh වීම වැළැක්වීම

    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;

    if (!email || !password) {
      loginMessage.style.color = "red";
      loginMessage.textContent = "Please fill in all fields.";
      return;
    }

    loginMessage.style.color = "orange";
    loginMessage.textContent = "Logging in...";

    // 2. Firebase Auth මගින් Sign In කිරීම
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // 3. Firestore එකෙන් මේ පරිශීලකයාගේ Role එක (Customer/Developer) කියවා ගැනීම
        return db.collection("users").doc(user.uid).get();
      })
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          
          loginMessage.style.color = "green";
          loginMessage.textContent = `Welcome back, ${userData.fullName || 'User'}! Redirecting...`;

          // Home (index.html) එකට පරිශීලකයා පිටත් කිරීම
          setTimeout(() => {
            window.location.href = "../index.html"; 
          }, 1500);
        } else {
          loginMessage.style.color = "red";
          loginMessage.textContent = "User role data not found.";
        }
      })
      .catch((error) => {
        console.error("Login Error:", error);
        loginMessage.style.color = "red";
        
        // මුලින්ම එකවුන්ට් එකක් හදලා නැත්නම් මේ error එක පෙන්වයි
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
          loginMessage.textContent = "Invalid email or password. Please try again.";
        } else {
          loginMessage.textContent = error.message;
        }
      });
  });
}



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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// HTML Elements
const loggedOutLinks = document.getElementById("loggedOutLinks");
const loggedInLinks = document.getElementById("loggedInLinks");
const userDisplayName = document.getElementById("userDisplayName");
const logoutBtn = document.getElementById("logoutBtn");

// 2. checking the authentication status of the user
auth.onAuthStateChanged((user) => {
    if (user) {
        // user is logged in: Hide the login button and show the logout button
        loggedOutLinks.style.display = "none";
        loggedInLinks.style.display = "flex";

        // Firestore to get the user's full name from the "users" collection
        db.collection("users").doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    // Navbar displaying the user's full name or a default message if not available
                    userDisplayName.textContent = `Hi, ${userData.fullName || 'User'}`;
                } else {
                    userDisplayName.textContent = "Hi, User";
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                userDisplayName.textContent = "Hi, User";
            });

    } else {
        // user is not logged in: Show the login button and hide the logout button
        loggedOutLinks.style.display = "flex";
        loggedInLinks.style.display = "none";
    }
});

// 3.click  Logout 
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        auth.signOut()
            .then(() => {
                console.log("User signed out successfully.");
            
                window.location.reload();
            })
            .catch((error) => {
                console.error("Logout Error:", error);
                alert("Something went wrong while logging out.");
            });
    });
}
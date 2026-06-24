// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIrpzFWq5SMUaVIhdVC9mV9Uq5ORiIT_k",
  authDomain: "micromate-25a16.firebaseapp.com",
  projectId: "micromate-25a16",
  storageBucket: "micromate-25a16.firebasestorage.app",
  messagingSenderId: "297225820043",
  appId: "1:297225820043:web:6f9d5c3d81be425b03818e"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// HTML Navbar Elements
const loggedOutLinks = document.getElementById("loggedOutLinks");
const loggedInLinks = document.getElementById("loggedInLinks");
const userDisplayName = document.getElementById("userDisplayName");
const logoutBtn = document.getElementById("logoutBtn");

// 2. Real-time Authentication State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        // --- USER IS LOGGED IN ---
        if (loggedOutLinks) loggedOutLinks.style.display = "none";
        if (loggedInLinks) loggedInLinks.style.display = "flex";

        // Fetch user data from Firestore
        if (userDisplayName) {
            db.collection("users").doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        userDisplayName.textContent = `Hi, ${userData.fullName || 'User'}`;
                    } else {
                        userDisplayName.textContent = "Hi, User";
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    userDisplayName.textContent = "Hi, User";
                });
        }
    } else {
        // --- USER IS NOT LOGGED IN (AUTH GUARD) ---
        // If the user tries to access internal pages without logging in, boot them to index.html
        const currentPath = window.location.pathname;
        if (!currentPath.endsWith("index.html") && !currentPath.endsWith("/")) {
            alert("Access Denied! Please sign in to view this page.");
            
            // Redirect smoothly based on directory layer depth
            if (currentPath.includes("/post-request/") || currentPath.includes("/signup/")) {
                window.location.href = "../index.html";
            } else {
                window.location.href = "index.html";
            }
        }
    }
});

// 💡 3. FIX: LOGOUT BUTTON EVENT TRIGGER
if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default link or button behaviors
        
        auth.signOut()
            .then(() => {
                console.log("User signed out successfully.");
                
                // Clear any leftover local data if necessary
                localStorage.removeItem("micromateUserToken"); 

                // Dynamic routing back to the main login landing page (index.html)
                const currentPath = window.location.pathname;
                if (currentPath.includes("/post-request/") || currentPath.includes("/signup/")) {
                    window.location.href = "../index.html";
                } else {
                    window.location.href = "index.html";
                }
            })
            .catch((error) => {
                console.error("Logout Error:", error);
                alert("Something went wrong while logging out.");
            });
    });
}
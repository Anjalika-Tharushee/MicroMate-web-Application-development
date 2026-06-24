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

// HTML Form & Message Elements
const postRequestForm = document.getElementById("postRequestForm");
const requestMessage = document.getElementById("requestMessage");
const detailsTextArea = document.getElementById("details");
const detailCount = document.getElementById("detailCount");

// Preview Elements
const previewTitle = document.getElementById("previewTitle");
const previewCategory = document.getElementById("previewCategory");
const previewDetails = document.getElementById("previewDetails");
const previewBudget = document.getElementById("previewBudget");
const previewDeadline = document.getElementById("previewDeadline");
const previewContact = document.getElementById("previewContact");

let currentUser = null;

// checking if user is logged in or not, and auto-filling the form with user's email and name if logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        
        
        if(postRequestForm.contactEmail) {
            postRequestForm.contactEmail.value = user.email;
            if(previewContact) previewContact.textContent = user.email;
        }

        // Firestore auto fill for contact name
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists && postRequestForm.contactName) {
                postRequestForm.contactName.value = doc.data().fullName || "";
            }
        });

    } else {
        // not logged in, redirect to login page
        alert("Please login first to post a request!");
        window.location.href = "../login/login.html";
    }
});

// 3. Live Preview & Character Count Logic
if (postRequestForm) {
    postRequestForm.addEventListener("input", () => {
        if (previewTitle) previewTitle.textContent = postRequestForm.requestTitle.value || "Need a React landing page";
        if (previewCategory) previewCategory.textContent = postRequestForm.category.value || "Development";
        if (previewDetails) previewDetails.textContent = postRequestForm.details.value || "Tell sellers exactly what you need...";
        if (previewBudget) previewBudget.textContent = postRequestForm.budget.value ? `$${postRequestForm.budget.value}` : "$75";
        if (previewDeadline) previewDeadline.textContent = postRequestForm.deadline.value || "Select a date";
        if (previewContact) previewContact.textContent = postRequestForm.contactEmail.value || "you@example.com";
        
        // Character count update for details textarea
        if (detailsTextArea && detailCount) {
            detailCount.textContent = `${detailsTextArea.value.length}/500`;
        }
    });

    // 
    postRequestForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!currentUser) {
            alert("You must be logged in to submit a request.");
            return;
        }

        // Form Inputs read and trimmed
        const title = postRequestForm.requestTitle.value.trim();
        const category = postRequestForm.category.value;
        const budget = Number(postRequestForm.budget.value);
        const deadline = postRequestForm.deadline.value;
        const details = postRequestForm.details.value.trim();
        const contactName = postRequestForm.contactName.value.trim();
        const contactEmail = postRequestForm.contactEmail.value.trim();
        const urgent = postRequestForm.urgent.checked;
        const allowMessages = postRequestForm.allowMessages.checked;

        // Validation
        if (!title || !category || !budget || !deadline || !details || !contactName || !contactEmail) {
            requestMessage.style.color = "red";
            requestMessage.textContent = "Please fill in all required fields.";
            return;
        }

        requestMessage.style.color = "orange";
        requestMessage.textContent = "Publishing your request...";

        // Firestore data structure for the request
        const requestData = {
            userId: currentUser.uid,
            title: title,
            category: category,
            budget: budget,
            deadline: deadline,
            details: details,
            contactName: contactName,
            contactEmail: contactEmail,
            isUrgent: urgent,
            allowMessages: allowMessages,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        
        db.collection("requests").add(requestData)
            .then(() => {
                requestMessage.style.color = "green";
                requestMessage.textContent = "Request published successfully! Redirecting...";
                
                postRequestForm.reset();

                setTimeout(() => {
                    window.location.href = "../index.html"; // සාර්ථක වූ පසු හෝම් පේජ් එකට යැවීම
                }, 2000);
            })
            .catch((error) => {
                console.error("Error adding request: ", error);
                requestMessage.style.color = "red";
                requestMessage.textContent = "Something went wrong. Please try again.";
            });
    });
}
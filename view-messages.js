// Inside main folder -> view-messages.js

// Firebase Initialization check
if (!firebase.apps.length) {
    const firebaseConfig = {
      apiKey: "AIzaSyDIrpzFWq5SMUaVIhdVC9mV9Uq5ORiIT_k",
      authDomain: "micromate-25a16.firebaseapp.com",
      projectId: "micromate-25a16",
      storageBucket: "micromate-25a16.firebasestorage.app",
      messagingSenderId: "297225820043",
      appId: "1:297225820043:web:6f9d5c3d81be425b03818e"
    };
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Capture UI DOM Elements
const loadingStatus = document.getElementById("loadingStatus");
const messagesTable = document.getElementById("messagesTable");
const messagesTableBody = document.getElementById("messagesTableBody");

// 1. Preserve your Card Click Option Router Matrix
const optionCards = document.querySelectorAll(".option-card");
optionCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      return;
    }
    const requestLink = card.querySelector("a[href*='post-request/post-request.html']");
    if (requestLink) {
      window.location.href = requestLink.href;
    }
  });
});

// 2. Fetch data from Firebase 'requests' collection on login authorization state change
auth.onAuthStateChanged((user) => {
    if (user) {
        loadTableInquiries();
    } else {
        // Fallback guard mechanism
        if (loadingStatus) loadingStatus.textContent = "Please login to view active requests.";
    }
});

function loadTableInquiries() {
    // 💡 Fetching from unified 'requests' collection
    db.collection("requests")
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
            if (loadingStatus) loadingStatus.style.display = "none";

            if (querySnapshot.empty) {
                if (loadingStatus) {
                    loadingStatus.style.display = "block";
                    loadingStatus.style.color = "gray";
                    loadingStatus.textContent = "No active customer requests found.";
                }
                return;
            }

            // Expose table grid layout frame
            if (messagesTable) messagesTable.style.display = "table";
            if (messagesTableBody) messagesTableBody.innerHTML = ""; 

            // Inject Firebase documents parameters inside table records structurally
            querySnapshot.forEach((doc) => {
                const req = doc.data();
                
                const trHTML = `
                    <tr style="border-bottom: 1px solid var(--border); transition: background 0.2s;">
                        <td style="padding: 12px; font-weight: 600; color: #3b82f6;">${req.title}</td>
                        <td style="padding: 12px;"><span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 4px 8px; border-radius: 6px; font-size: 0.85rem;">${req.category}</span></td>
                        <td style="padding: 12px; font-weight: 700; color: #10b981;">Rs. ${req.budget}</td>
                        <td style="padding: 12px; font-size: 0.9rem;">
                            <strong>${req.contactName}</strong><br>
                            <a href="mailto:${req.contactEmail}" style="color: gray; font-size: 0.8rem;">${req.contactEmail}</a>
                        </td>
                        <td style="padding: 12px; font-size: 0.9rem; color: #ef4444; font-weight: 500;">${req.deadline}</td>
                    </tr>
                `;
                if (messagesTableBody) messagesTableBody.innerHTML += trHTML;
            });
        })
        .catch((error) => {
            console.error("Error synchronizing customer data rows:", error);
            if (loadingStatus) {
                loadingStatus.style.color = "red";
                loadingStatus.textContent = "Error reading data records from database server.";
            }
        });
}
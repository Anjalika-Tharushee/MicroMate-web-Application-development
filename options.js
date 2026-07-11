// 1. Firebase Configuration Matrix
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

// 💡 HTML get elements
const loadingMessages = document.getElementById("loadingMessages") || document.querySelector("p[style*='orange']");
let messagesGrid = document.getElementById("messagesGrid");

//  Option Card Click Logic 
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

// 2.  Firebase 'requests' get data and display in the grid
auth.onAuthStateChanged((user) => {
    if (user) {
        loadInquiries();
    } else {
        window.location.href = "login/login.html";
    }
});

function loadInquiries() {
    //  FIXED: 'requests' 
    db.collection("requests")
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
            
            if (loadingMessages) {
                loadingMessages.style.display = "none";
            }

            // massege grid 
            if (!messagesGrid) {
                messagesGrid = document.createElement("div");
                messagesGrid.id = "messagesGrid";
                messagesGrid.style.display = "grid";
                messagesGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(300px, 1fr))";
                messagesGrid.style.gap = "20px";
                messagesGrid.style.marginTop = "20px";
                if (loadingMessages) loadingMessages.parentNode.appendChild(messagesGrid);
            }

            messagesGrid.innerHTML = ""; //Clear old data

            if (querySnapshot.empty) {
                if (loadingMessages) {
                    loadingMessages.style.display = "block";
                    loadingMessages.style.color = "gray";
                    loadingMessages.textContent = "No active inquiries found.";
                }
                return;
            }

            // view screen all firebase data
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const cardHTML = `
                    <div class="message-card" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; margin-bottom: 15px;">
                        <h4 style="color: #3b82f6; margin: 0 0 5px 0;">${data.title || 'Project Request'}</h4>
                        <span style="font-size: 0.8rem; background: rgba(59, 130, 246, 0.2); color: #3b82f6; padding: 2px 8px; border-radius: 6px;">${data.category}</span>
                        <p style="margin: 10px 0; font-size: 0.95rem; line-height: 1.4;">${data.details}</p>
                        <div style="font-size: 0.85rem; color: #a0aec0;">
                            <strong>By:</strong> ${data.contactName} | <strong>Budget:</strong> Rs. ${data.budget}
                        </div>
                    </div>
                `;
                messagesGrid.innerHTML += cardHTML;
            });
        })
        .catch((error) => {
            console.error("Error fetching documents: ", error);
            if (loadingMessages) {
                loadingMessages.style.color = "red";
                loadingMessages.textContent = "Error loading data from server.";
            }
        });
}
// HTML UI Elements
const requestsGrid = document.getElementById("requestsGrid");
const loadingRequests = document.getElementById("loadingRequests");
const developerName = document.getElementById("developerName");

// Verify login and double-check user role boundary conditions
auth.onAuthStateChanged((user) => {
    if (user) {
        // Fetch specific user document meta fields from Firestore users collection
        db.collection("users").doc(user.uid).get()
            .then((doc) => {
                if (doc.exists && doc.data().role === "developer") {
                    developerName.textContent = doc.data().fullName || "Developer";
                    loadCustomerRequests(); // 💡 Trigger unified data loading function
                } else if (doc.exists && doc.data().role === "customer") {
                    // Security fallback: If a customer tries to sneak in, redirect them immediately
                    window.location.href = "customer-dashboard.html";
                }
            })
            .catch((error) => {
                console.error("User verification failure:", error);
            });
    } else {
        // Handled by global auth routers
        window.location.href = "index.html";
    }
});

// Fetch all project inquiries posted by customers via unified "requests" collection
function loadCustomerRequests() {
    // 💡 FIXED: Unified mapping to look into "requests" ordered by newest timestamp
    db.collection("requests")
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
            loadingRequests.style.display = "none";
            requestsGrid.innerHTML = ""; // Clear visual layout engine cache

            if (querySnapshot.empty) {
                loadingRequests.style.display = "block";
                loadingRequests.style.color = "gray";
                loadingRequests.textContent = "No pending customer requests found in the system.";
                return;
            }

            // Loop through each document and append grid cards safely
            querySnapshot.forEach((doc) => {
                const req = doc.data();
                
                // Formulate legible dates from object elements safely
                const dateString = req.timestamp ? req.timestamp.toDate().toLocaleDateString() : "Recent";
                
                // Construct clean responsive grid cards layouts template injection
                const cardHTML = `
                    <div class="request-card" style="border: 1px solid var(--border); padding: 25px; border-radius: 16px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(8px); display: flex; flex-direction: column; gap: 12px; box-shadow: var(--shadow);">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted, #64748b);">
                            <span>📅 Posted: ${dateString}</span>
                            ${req.isUrgent ? '<span style="background: #ef4444; color: white; padding: 2px 8px; border-radius: 20px; font-weight: 600; font-size: 0.75rem;">URGENT</span>' : ''}
                        </div>
                        
                        <h4 style="margin: 0; color: #3b82f6; font-size: 1.2rem; font-weight: 600;">${req.title}</h4>
                        <span style="font-size: 0.8rem; background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 4px 10px; border-radius: 8px; width: fit-content; font-weight: 500;">${req.category || 'General'}</span>
                        
                        <p style="font-size: 0.95rem; margin: 8px 0; line-height: 1.5; flex-grow: 1; color: var(--text);">${req.details}</p>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px; font-size: 0.9rem;">
                            <span style="font-weight: 700; color: #10b981;">Budget: Rs. ${req.budget}</span>
                            <span style="color: var(--text-muted);">Deadline: ${req.deadline}</span>
                        </div>
                        
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">
                            <strong>Client:</strong> ${req.contactName || 'Anonymous'}
                        </div>
                        
                        <hr style="border: 0; border-top: 1px solid var(--border); margin: 5px 0;">
                        
                        <a href="mailto:${req.contactEmail}" class="btn-primary" style="text-decoration: none; text-align: center; padding: 12px; border-radius: 10px; font-weight: 600; font-size: 0.95rem; background: #2563eb; color: white; display: block; transition: background 0.2s;">Apply & Contact Client</a>
                    </div>
                `;
                requestsGrid.innerHTML += cardHTML;
            });
        })
        .catch((error) => {
            console.error("Firestore request loading exception context:", error);
            loadingRequests.style.color = "red";
            loadingRequests.textContent = "Error synchronization from server database directory: " + error.message;
        });
}
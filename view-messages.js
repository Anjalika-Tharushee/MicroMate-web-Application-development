// HTML Dashboard Table Elements
const messagesTable = document.getElementById("messagesTable");
const messagesTableBody = document.getElementById("messagesTableBody");
const loadingStatus = document.getElementById("loadingStatus");

// 💡 Auth Listeners: Uses the globally initialized 'auth' and 'db' from auth-status.js
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Logged in user UID:", user.uid);
        
        // Fetch current user document meta from Firestore users collection
        db.collection("users").doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    console.log("User role verified:", userData.role);

                    // Allow access ONLY if the structural account role is 'developer'
                    if (userData.role === "developer") {
                        fetchCustomerMessages();
                    } else {
                        // --- USER IS A CUSTOMER: Access Denied to sensitive developer database logs ---
                        loadingStatus.style.color = "red";
                        loadingStatus.textContent = "Access Denied! Only registered Developers can view these messages.";
                    }
                } else {
                    loadingStatus.style.color = "red";
                    loadingStatus.textContent = "User profile record not found in database.";
                }
            })
            .catch((error) => {
                console.error("Authorization check failure:", error);
                loadingStatus.textContent = "Error verifying security permissions.";
            });
    } else {
        // Handled globally by auth-status.js router rules
        loadingStatus.textContent = "Please sign in to fetch messages.";
    }
});

// Fetch all input records from the "contact_messages" collection
function fetchCustomerMessages() {
    // 💡 REMOVED .orderBy() momentarily to guarantee immediate data fetching without requiring Firestore Custom Indexes
    db.collection("contact_messages").get()
        .then((querySnapshot) => {
            // Clear current loading notification engine state
            loadingStatus.style.display = "none";
            messagesTableBody.innerHTML = ""; // Clear old visual table cache

            if (querySnapshot.empty) {
                loadingStatus.style.display = "block";
                loadingStatus.style.color = "var(--text-muted)";
                loadingStatus.textContent = "No messages found in the database directory.";
                return;
            }

            // Render table grid layouts
            messagesTable.style.display = "table";

            // Loop through each document and append data structure elements to HTML view
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                
                // Formulate legible localized timestamp strings safely
                const dateString = data.timestamp ? data.timestamp.toDate().toLocaleString() : "Just now";

                // Construct clean table rows string buffers safely
                const rowHTML = `
                    <tr style="border-bottom: 1px solid var(--border); text-align: left;">
                        <td style="padding: 12px; font-weight: 500; color: var(--text);">${data.name || 'Anonymous'}</td>
                        <td style="padding: 12px;"><a href="mailto:${data.email}" style="color: #3b82f6; text-decoration: none;">${data.email || 'N/A'}</a></td>
                        <td style="padding: 12px; max-width: 400px; word-wrap: break-word; color: var(--text);">${data.message || ''}</td>
                        <td style="padding: 12px; color: var(--text-muted); font-size: 0.9rem;">${dateString}</td>
                    </tr>
                `;
                messagesTableBody.innerHTML += rowHTML;
            });
        })
        .catch((error) => {
            console.error("Firestore message retrieval error:", error);
            loadingStatus.style.color = "red";
            loadingStatus.textContent = "Failed to load database logs: " + error.message;
        });
}
// HTML UI Elements
const servicesGrid = document.getElementById("servicesGrid");
const loadingServices = document.getElementById("loadingServices");
const customerName = document.getElementById("customerName");

// Check login status and update customer profile name
auth.onAuthStateChanged((user) => {
    if (user) {
        db.collection("users").doc(user.uid).get()
            .then((doc) => {
                if (doc.exists && doc.data().role === "customer") {
                    customerName.textContent = doc.data().fullName || "Customer";
                    loadDeveloperServices();
                } else if (doc.exists && doc.data().role === "developer") {
                    // Security fallback: If a developer tries to open customer dashboard, redirect them
                    window.location.href = "developer-dashboard.html";
                }
            })
            .catch((error) => {
                console.error("User validation failure:", error);
            });
    } else {
        // Redirect to login if not authenticated
        window.location.href = "login/login.html";
    }
});

// Fetch all service gigs posted by developers
function loadDeveloperServices() {
    db.collection("services").get()
        .then((querySnapshot) => {
            loadingServices.style.display = "none";
            servicesGrid.innerHTML = "";

            if (querySnapshot.empty) {
                loadingServices.style.display = "block";
                loadingServices.style.color = "gray";
                loadingServices.textContent = "No active developer services found at the moment.";
                return;
            }

            querySnapshot.forEach((doc) => {
                const service = doc.data();

                // 💡 Constructing a direct web Gmail URL with encoded parameters for quick matching
                const emailSubject = encodeURIComponent(`MicroMate Inquiry - Interested in your service: ${service.title}`);
                // Fallback email if developerEmail field is missing in document
                const developerEmail = service.developerEmail || "support@micromate.com"; 
                const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${developerEmail}&su=${emailSubject}`;

                // Construct clean responsive service cards layouts template injection
                const cardHTML = `
                    <div class="service-card" style="border: 1px solid var(--border); padding: 25px; border-radius: 16px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(8px); display: flex; flex-direction: column; gap: 12px; box-shadow: var(--shadow);">
                        <h4 style="margin: 0; color: #3b82f6; font-size: 1.2rem; font-weight: 600;">${service.title}</h4>
                        <p style="font-size: 0.95rem; margin: 8px 0; line-height: 1.5; flex-grow: 1; color: var(--text);">${service.description}</p>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px; font-size: 0.9rem;">
                            <span style="font-weight: 700; color: #10b981;">Rs. ${service.price}</span>
                            <span style="color: var(--text-muted); font-size: 0.8rem;">By: ${service.developerName || 'Developer'}</span>
                        </div>

                        <hr style="border: 0; border-top: 1px solid var(--border); margin: 5px 0;">

                        <!-- 💡 ENHANCED ACTION BUTTON: Direct redirect route inside Gmail web framework securely -->
                        <a href="${gmailWebUrl}" target="_blank" class="btn-primary" style="text-decoration: none; text-align: center; padding: 12px; border-radius: 10px; font-weight: 600; font-size: 0.95rem; background: #2563eb; color: white; display: block; transition: background 0.2s;">Order Now & Contact</a>
                    </div>
                `;
                servicesGrid.innerHTML += cardHTML;
            });
        })
        .catch((error) => {
            console.error("Error loading services:", error);
            loadingServices.style.color = "red";
            loadingServices.textContent = "Failed to load services.";
        });
}
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
            });
    }
});

// Fetch all service gigs posted by developers
function loadDeveloperServices() {
    // Assuming developers will add services to a "services" collection later
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
                const cardHTML = `
                    <div class="service-card">
                        <h4 style="margin: 0 0 10px 0; color: var(--primary);">${service.title}</h4>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 15px;">${service.description}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 700; color: #10b981;">Rs. ${service.price}</span>
                            <span style="font-size: 0.8rem; color: gray;">By: ${service.developerName || 'Developer'}</span>
                        </div>
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
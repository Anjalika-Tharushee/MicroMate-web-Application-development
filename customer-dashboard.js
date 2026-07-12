// HTML UI Elements
const servicesGrid = document.getElementById("servicesGrid");
const loadingServices = document.getElementById("loadingServices");
const customerName = document.getElementById("customerName");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const maxPriceFilter = document.getElementById("maxPriceFilter");
const sortBy = document.getElementById("sortBy");
const searchSummary = document.getElementById("searchSummary");

let allServices = [];

function initialiseDashboardSearch() {
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("search") || "";

    if (searchInput && initialSearch) {
        searchInput.value = initialSearch;
    }
}

function getExpandedSearchTerms(query) {
    const aliasMap = {
        coding: ["coding", "code", "development", "programming", "web", "frontend", "backend"],
        writing: ["writing", "content", "copy", "article", "blog", "editorial"],
        tutoring: ["tutoring", "teach", "teaching", "lesson", "learning", "mentor"],
        photography: ["photography", "photo", "camera", "visual"],
        editing: ["editing", "edit", "video", "post", "production"],
        design: ["design", "designing", "ui", "ux", "figma", "branding"],
        marketing: ["marketing", "seo", "social", "ads", "campaign", "digital"],
        "web development": ["web", "development", "website", "landing", "frontend", "backend", "react", "html", "css", "javascript"],
        "mobile app": ["mobile", "app", "android", "ios", "flutter", "react native", "java", "kotlin"],
        "uiux": ["ui", "ux", "design", "figma", "prototype", "wireframe", "branding"],
        "content writing": ["content", "writing", "copy", "article", "blog", "seo", "editorial"],
        "video editing": ["video", "editing", "reel", "short", "promo", "production", "post"],
        "data": ["data", "analysis", "analytics", "ai", "machine learning", "sql", "dashboard"],
        "business": ["business", "support", "admin", "operations", "research", "documentation"],
    };

    const terms = query
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

    const expanded = terms.flatMap((term) => aliasMap[term] || [term]);
    return [...new Set(expanded)];
}

function getFilteredServices() {
    const query = (searchInput ? searchInput.value.trim().toLowerCase() : "");
    const category = categoryFilter ? categoryFilter.value : "all";
    const maxPrice = Number(maxPriceFilter ? maxPriceFilter.value : 0);
    const sort = sortBy ? sortBy.value : "rating";

    const words = getExpandedSearchTerms(query);

    let filtered = allServices.filter((service) => {
        const searchableText = [
            service.title,
            service.description,
            service.category,
            service.skills ? service.skills.join(" ") : "",
            service.developerName || ""
        ].join(" ").toLowerCase();

        const matchesQuery = words.length === 0 || words.every((word) => searchableText.includes(word));
        const matchesCategory = category === "all" || service.category === category;
        const matchesPrice = !maxPrice || Number(service.price) <= maxPrice;

        return matchesQuery && matchesCategory && matchesPrice;
    });

    if (sort === "price-low") {
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-high") {
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "delivery") {
        filtered.sort((a, b) => Number(a.deliveryDays || 0) - Number(b.deliveryDays || 0));
    } else {
        filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return filtered;
}

function renderServices() {
    if (!servicesGrid) return;

    const filtered = getFilteredServices();
    servicesGrid.innerHTML = "";

    if (filtered.length === 0) {
        loadingServices.style.display = "block";
        loadingServices.style.color = "gray";
        loadingServices.textContent = "No matching services found. Try a different keyword or price filter.";
        if (searchSummary) {
            searchSummary.textContent = "No services match your current search.";
        }
        return;
    }

    loadingServices.style.display = "none";

    filtered.forEach((service) => {
        const emailSubject = encodeURIComponent(`MicroMate Inquiry - Interested in your service: ${service.title}`);
        const developerEmail = service.developerEmail || "support@micromate.com";
        const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${developerEmail}&su=${emailSubject}`;

        const cardHTML = `
            <div class="service-card" style="border: 1px solid var(--border); padding: 25px; border-radius: 16px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(8px); display: flex; flex-direction: column; gap: 12px; box-shadow: var(--shadow);">
                <h4 style="margin: 0; color: #3b82f6; font-size: 1.2rem; font-weight: 600;">${service.title}</h4>
                <p style="font-size: 0.95rem; margin: 8px 0; line-height: 1.5; flex-grow: 1; color: var(--text);">${service.description}</p>
                
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px; font-size: 0.9rem;">
                    <span style="font-weight: 700; color: #10b981;">Rs. ${service.price}</span>
                    <span style="color: var(--text-muted); font-size: 0.8rem;">By: ${service.developerName || 'Service Provider'}</span>
                </div>

                <hr style="border: 0; border-top: 1px solid var(--border); margin: 5px 0;">
                <a href="${gmailWebUrl}" target="_blank" class="btn-primary" style="text-decoration: none; text-align: center; padding: 12px; border-radius: 10px; font-weight: 600; font-size: 0.95rem; background: #2563eb; color: white; display: block; transition: background 0.2s;">Order Now & Contact</a>
            </div>
        `;

        servicesGrid.innerHTML += cardHTML;
    });

    if (searchSummary) {
        searchSummary.textContent = `Showing ${filtered.length} matching service${filtered.length === 1 ? "" : "s"}`;
    }
}

// Check login status and update customer profile name
auth.onAuthStateChanged((user) => {
    if (user) {
        db.collection("users").doc(user.uid).get()
            .then((doc) => {
                if (doc.exists && doc.data().role === "customer") {
                    customerName.textContent = doc.data().fullName || "Customer";
                    initialiseDashboardSearch();
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
        // Redirect to login if not authenticated and preserve the browse-services destination.
        const redirectPath = `${window.location.pathname}${window.location.search}`;
        window.location.href = `login/login.html?redirect=${encodeURIComponent(redirectPath)}`;
    }
});

// Fetch all service gigs posted by developers
function loadDeveloperServices() {
    db.collection("services").get()
        .then((querySnapshot) => {
            allServices = [];
            querySnapshot.forEach((doc) => {
                allServices.push({ id: doc.id, ...doc.data() });
            });

            renderServices();
        })
        .catch((error) => {
            console.error("Error loading services:", error);
            loadingServices.style.color = "red";
            loadingServices.textContent = "Failed to load services.";
        });
}

[searchInput, categoryFilter, maxPriceFilter, sortBy].forEach((element) => {
    if (element) {
        element.addEventListener("input", renderServices);
        element.addEventListener("change", renderServices);
    }
});
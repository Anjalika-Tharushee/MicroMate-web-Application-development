// Firebase Configuration 
const firebaseConfig = {
  apiKey: "AIzaSyDIrpzFWq5SMUaVIhdVC9mV9Uq5ORiIT_k",
  authDomain: "micromate-25a16.firebaseapp.com",
  projectId: "micromate-25a16",
  storageBucket: "micromate-25a16.firebasestorage.app",
  messagingSenderId: "297225820043",
  appId: "1:297225820043:web:6f9d5c3d81be425b03818e"
};

// Firebase Initialize 
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Array of Store data in DataBase
let services = [];

const serviceGrid = document.getElementById("serviceGrid");
const serviceCount = document.getElementById("serviceCount");
const template = document.getElementById("serviceCardTemplate");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const maxPriceFilter = document.getElementById("maxPriceFilter");
const sortBy = document.getElementById("sortBy");

const requestPanel = document.getElementById("requestPanel");
const backdrop = document.getElementById("backdrop");
const openRequestBtn = document.getElementById("openRequestBtn");
const quickRequestBtn = document.getElementById("quickRequestBtn");
const closePanelBtn = document.getElementById("closePanelBtn");
const requestForm = document.getElementById("requestForm");
const formMessage = document.getElementById("formMessage");

// 2. Real-time Database Read Services Data 
function fetchServices() {
  db.collection("services").onSnapshot((snapshot) => {
    services = [];
    snapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() });
    });
    
    updateStats();
    renderServices();
  }, (error) => {
    console.error("Error fetching services: ", error);
  });
}

function updateStats() {
  const activeSellers = document.getElementById("activeSellers");
  const avgPrice = document.getElementById("avgPrice");
  const avgRating = document.getElementById("avgRating");

  if (!activeSellers || !avgPrice || !avgRating) return;

  const sellerCount = new Set(services.map((service) => service.seller)).size;
  const price = services.length ? services.reduce((sum, service) => sum + service.price, 0) / services.length : 0;
  const rating = services.length ? services.reduce((sum, service) => sum + service.rating, 0) / services.length : 0;

  activeSellers.textContent = String(sellerCount);
  avgPrice.textContent = `$${Math.round(price)}`;
  avgRating.textContent = rating.toFixed(1);
}

function getFilteredServices() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const category = categoryFilter ? categoryFilter.value : "all";
  const maxPrice = Number(maxPriceFilter ? maxPriceFilter.value : 0);
  const sort = sortBy ? sortBy.value : "rating";

  let result = services.filter((service) => {
    const matchesText =
      service.title.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      (service.skills && service.skills.join(" ").toLowerCase().includes(query));

    const matchesCategory = category === "all" || service.category === category;
    const matchesPrice = maxPrice <= 0 || service.price <= maxPrice;

    return matchesText && matchesCategory && matchesPrice;
  });

  if (sort === "price-low") {
    result = result.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    result = result.sort((a, b) => b.price - a.price);
  } else if (sort === "delivery") {
    result = result.sort((a, b) => a.deliveryDays - b.deliveryDays);
  } else {
    result = result.sort((a, b) => b.rating - a.rating);
  }

  return result;
}

function renderServices() {
  if (!serviceGrid || !template) return;
  
  const items = getFilteredServices();
  serviceGrid.innerHTML = "";

  items.forEach((service, index) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".service-card");

    if (card) card.style.animationDelay = `${Math.min(index * 40, 220)}ms`;
    
    node.querySelector(".tag").textContent = service.category;
    node.querySelector(".rating").textContent = `⭐ ${Number(service.rating).toFixed(1)}`;
    node.querySelector("h3").textContent = service.title;
    node.querySelector(".description").textContent = service.description;
    node.querySelector(".price").textContent = `$${service.price}`;

    const meta = node.querySelector(".meta");
    meta.innerHTML = `
      <li>Seller: ${service.seller}</li>
      <li>Delivery: ${service.deliveryDays} day(s)</li>
      <li>Skills: ${service.skills ? service.skills.join(", ") : ""}</li>
    `;

    const button = node.querySelector("button");
    button.addEventListener("click", () => {
      openPanel();
      requestForm.title.value = `Interested in: ${service.title}`;
      requestForm.category.value = service.category;
      requestForm.budget.value = service.price;
      requestForm.details.value = `Hi ${service.seller}, I would like to request this service.`; 
    });

    serviceGrid.appendChild(node);
  });

  if (serviceCount) serviceCount.textContent = `${items.length} service(s) found`;
}

function openPanel() {
  if (!requestPanel || !backdrop) return;
  requestPanel.classList.add("open");
  requestPanel.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
}

function closePanel() {
  if (!requestPanel || !backdrop) return;
  requestPanel.classList.remove("open");
  requestPanel.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
}

// Event Listeners
[searchInput, categoryFilter, maxPriceFilter, sortBy].forEach((element) => {
  if (element) {
    element.addEventListener("input", renderServices);
    element.addEventListener("change", renderServices);
  }
});

if (openRequestBtn) openRequestBtn.addEventListener("click", openPanel);
if (quickRequestBtn) quickRequestBtn.addEventListener("click", openPanel);
if (closePanelBtn) closePanelBtn.addEventListener("click", closePanel);
if (backdrop) backdrop.addEventListener("click", closePanel);

// Request Form it Submit and Save Data to Database
if (requestForm) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const newRequest = {
      title: requestForm.title.value,
      category: requestForm.category.value,
      budget: Number(requestForm.budget.value),
      details: requestForm.details.value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection("requests").add(newRequest)
      .then(() => {
        formMessage.textContent = "Request published! Sellers can now respond to your post.";
        requestForm.reset();
        setTimeout(() => {
          formMessage.textContent = "";
          closePanel();
        }, 1500);
      })
      .catch((error) => {
        console.error("Error adding request: ", error);
        formMessage.textContent = "Something went wrong. Try again.";
      });
  });
}

// Initial Fetch Services Data
fetchServices();
const services = [
  {
    id: 1,
    title: "React Landing Page Build",
    category: "Development",
    price: 95,
    rating: 4.9,
    deliveryDays: 2,
    seller: "Ishara P.",
    description: "Pixel-perfect landing page with responsive sections and reusable components.",
    skills: ["React", "CSS", "Figma to Code"]
  },
  {
    id: 2,
    title: "UI/UX Wireframe + Prototype",
    category: "Design",
    price: 70,
    rating: 4.8,
    deliveryDays: 3,
    seller: "Nethmi R.",
    description: "Clean mobile-first wireframes and clickable prototype for your app idea.",
    skills: ["Figma", "UX", "Design Systems"]
  },
  {
    id: 3,
    title: "Data Structures Tutoring",
    category: "Tutoring",
    price: 25,
    rating: 4.7,
    deliveryDays: 1,
    seller: "Hasindu J.",
    description: "Focused sessions for linked lists, trees, recursion, and algorithm practice.",
    skills: ["DSA", "Python", "Problem Solving"]
  },
  {
    id: 4,
    title: "SEO Blog Writing",
    category: "Content",
    price: 40,
    rating: 4.6,
    deliveryDays: 2,
    seller: "Dinithi S.",
    description: "Search-optimized blog posts with keyword strategy and engaging structure.",
    skills: ["SEO", "Copywriting", "Research"]
  },
  {
    id: 5,
    title: "Instagram Campaign Setup",
    category: "Marketing",
    price: 60,
    rating: 4.8,
    deliveryDays: 3,
    seller: "Kavin M.",
    description: "Campaign concept, audience setup, and launch checklist for student startups.",
    skills: ["Social Media", "Ads", "Analytics"]
  },
  {
    id: 6,
    title: "Node API Endpoint Fix",
    category: "Development",
    price: 55,
    rating: 4.9,
    deliveryDays: 1,
    seller: "Sahan K.",
    description: "Debug and improve REST API routes with validation and cleaner responses.",
    skills: ["Node.js", "Express", "Debugging"]
  }
];

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

function updateStats() {
  const activeSellers = document.getElementById("activeSellers");
  const avgPrice = document.getElementById("avgPrice");
  const avgRating = document.getElementById("avgRating");

  const sellerCount = new Set(services.map((service) => service.seller)).size;
  const price = services.reduce((sum, service) => sum + service.price, 0) / services.length;
  const rating = services.reduce((sum, service) => sum + service.rating, 0) / services.length;

  activeSellers.textContent = String(sellerCount);
  avgPrice.textContent = `$${Math.round(price)}`;
  avgRating.textContent = rating.toFixed(1);
}

function getFilteredServices() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const maxPrice = Number(maxPriceFilter.value || 0);
  const sort = sortBy.value;

  let result = services.filter((service) => {
    const matchesText =
      service.title.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.skills.join(" ").toLowerCase().includes(query);

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
  const items = getFilteredServices();
  serviceGrid.innerHTML = "";

  items.forEach((service, index) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".service-card");

    card.style.animationDelay = `${Math.min(index * 40, 220)}ms`;
    node.querySelector(".tag").textContent = service.category;
    node.querySelector(".rating").textContent = `⭐ ${service.rating.toFixed(1)}`;
    node.querySelector("h3").textContent = service.title;
    node.querySelector(".description").textContent = service.description;
    node.querySelector(".price").textContent = `$${service.price}`;

    const meta = node.querySelector(".meta");
    meta.innerHTML = `
      <li>Seller: ${service.seller}</li>
      <li>Delivery: ${service.deliveryDays} day(s)</li>
      <li>Skills: ${service.skills.join(", ")}</li>
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

  serviceCount.textContent = `${items.length} service(s) found`;
}

function openPanel() {
  requestPanel.classList.add("open");
  requestPanel.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
}

function closePanel() {
  requestPanel.classList.remove("open");
  requestPanel.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
}

[searchInput, categoryFilter, maxPriceFilter, sortBy].forEach((element) => {
  element.addEventListener("input", renderServices);
  element.addEventListener("change", renderServices);
});

openRequestBtn.addEventListener("click", openPanel);
quickRequestBtn.addEventListener("click", openPanel);
closePanelBtn.addEventListener("click", closePanel);
backdrop.addEventListener("click", closePanel);

requestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "Request published! Sellers can now respond to your post.";
  requestForm.reset();
  setTimeout(() => {
    formMessage.textContent = "";
    closePanel();
  }, 1500);
});

updateStats();
renderServices();

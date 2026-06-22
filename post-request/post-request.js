const postRequestForm = document.getElementById("postRequestForm");
const requestTitleInput = document.getElementById("requestTitle");
const categoryInput = document.getElementById("category");
const budgetInput = document.getElementById("budget");
const deadlineInput = document.getElementById("deadline");
const detailsInput = document.getElementById("details");
const contactNameInput = document.getElementById("contactName");
const contactEmailInput = document.getElementById("contactEmail");
const urgentInput = document.getElementById("urgent");
const allowMessagesInput = document.getElementById("allowMessages");
const detailCount = document.getElementById("detailCount");
const requestMessage = document.getElementById("requestMessage");

const previewTitle = document.getElementById("previewTitle");
const previewCategory = document.getElementById("previewCategory");
const previewDetails = document.getElementById("previewDetails");
const previewBudget = document.getElementById("previewBudget");
const previewDeadline = document.getElementById("previewDeadline");
const previewContact = document.getElementById("previewContact");

function showMessage(text, type) {
  requestMessage.textContent = text;
  requestMessage.classList.remove("error", "success");
  if (type) {
    requestMessage.classList.add(type);
  }
}

function getRequests() {
  const raw = localStorage.getItem("micromateRequests");
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRequests(requests) {
  localStorage.setItem("micromateRequests", JSON.stringify(requests));
}

function updatePreview() {
  const title = requestTitleInput.value.trim() || "Need a React landing page";
  const category = categoryInput.value || "Development";
  const details = detailsInput.value.trim() || "Tell sellers exactly what you need, your target audience, and the deadline.";
  const budget = budgetInput.value ? `$${budgetInput.value}` : "$75";
  const deadline = deadlineInput.value || "Select a date";
  const contact = contactEmailInput.value.trim() || "you@example.com";

  previewTitle.textContent = title;
  previewCategory.textContent = category;
  previewDetails.textContent = details;
  previewBudget.textContent = budget;
  previewDeadline.textContent = deadline;
  previewContact.textContent = contact;
  detailCount.textContent = `${detailsInput.value.length}/500`;
}

[requestTitleInput, categoryInput, budgetInput, deadlineInput, detailsInput, contactNameInput, contactEmailInput].forEach((element) => {
  element.addEventListener("input", updatePreview);
  element.addEventListener("change", updatePreview);
});

detailsInput.addEventListener("input", updatePreview);
updatePreview();

postRequestForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = requestTitleInput.value.trim();
  const category = categoryInput.value;
  const budget = Number(budgetInput.value);
  const deadline = deadlineInput.value;
  const details = detailsInput.value.trim();
  const contactName = contactNameInput.value.trim();
  const contactEmail = contactEmailInput.value.trim();

  if (!title || !category || !budget || !deadline || !details || !contactName || !contactEmail) {
    showMessage("Please fill in all required fields.", "error");
    return;
  }

  if (!/.+@.+\..+/.test(contactEmail)) {
    showMessage("Please enter a valid contact email.", "error");
    return;
  }

  const requests = getRequests();
  requests.unshift({
    title,
    category,
    budget,
    deadline,
    details,
    contactName,
    contactEmail,
    urgent: urgentInput.checked,
    allowMessages: allowMessagesInput.checked,
    createdAt: new Date().toISOString()
  });
  saveRequests(requests);

  showMessage("Request posted successfully. Students can now review it.", "success");
  postRequestForm.reset();
  updatePreview();
});
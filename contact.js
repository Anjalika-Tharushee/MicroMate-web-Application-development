// HTML Form Elements
const contactForm = document.getElementById("contactForm");
const contactStatusMessage = document.getElementById("contactStatusMessage");
const contactSubmitBtn = document.getElementById("contactSubmitBtn");

// Handle Contact Form Submission
if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        // Basic fields validation
        if (!name || !email || !message) {
            contactStatusMessage.style.color = "red";
            contactStatusMessage.textContent = "Please fill in all fields.";
            return;
        }

        // Change button state during database write operations
        contactSubmitBtn.disabled = true;
        contactStatusMessage.style.color = "orange";
        contactStatusMessage.textContent = "Sending your message...";

        // Store contact inquiry within Firestore "contact_messages" collection
        db.collection("contact_messages").add({
            name: name,
            email: email,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            // 1. Update the UI message to show success
            contactStatusMessage.style.color = "green";
            contactStatusMessage.textContent = "Message sent successfully!";
            
            // 2. Reset the form fields
            contactForm.reset();
            contactSubmitBtn.disabled = false;

            // 💡 3. FIX: Show a clear success alert pop-up to the user before redirecting
            alert("Thank you " + name + "! Your message has been sent successfully to the MicroMate service providers.");

            // 4. Redirect the user back to the home page after they click 'OK' on the alert
            window.location.href = "home.html"; 
        })
        .catch((error) => {
            console.error("Contact Form Database Error:", error);
            contactStatusMessage.style.color = "red";
            contactStatusMessage.textContent = "Failed to send message: " + error.message;
            contactSubmitBtn.disabled = false;
        });
    });
}
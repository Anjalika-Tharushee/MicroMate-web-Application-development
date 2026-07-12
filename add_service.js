// Firebase Config Matrix
const firebaseConfig = {
  apiKey: "AIzaSyDIrpzFWq5SMUaVIhdVC9mV9Uq5ORiIT_k",
  authDomain: "micromate-25a16.firebaseapp.com",
  projectId: "micromate-25a16",
  storageBucket: "micromate-25a16.firebasestorage.app",
  messagingSenderId: "297225820043",
  appId: "1:297225820043:web:6f9d5c3d81be425b03818e"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

const serviceForm = document.getElementById("serviceForm");
const responseMessage = document.getElementById("responseMessage");

let currentDevName = "Service Provider";

// Guard Rule: Check identity profile role
auth.onAuthStateChanged((user) => {
    if (user) {
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists && doc.data().role === "developer") {
                currentDevName = doc.data().fullName || "Service Provider";
            } else {
                alert("Access Denied! Only service providers can offer services.");
                window.location.href = "customer-dashboard.html";
            }
        });
    } else {
        window.location.href = "login/login.html";
    }
});

// Form submission handler
if (serviceForm) {
    serviceForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("serviceTitle").value.trim();
        const category = document.getElementById("serviceCategory").value;
        const price = Number(document.getElementById("servicePrice").value);
        const description = document.getElementById("serviceDetails").value.trim();

        if (!title || !category || !price || !description) {
            responseMessage.style.color = "red";
            responseMessage.textContent = "Please fill in all fields.";
            return;
        }

        responseMessage.style.color = "orange";
        responseMessage.textContent = "Publishing your service gig...";

        // Construct service object structure
        const serviceData = {
            developerId: auth.currentUser.uid,
            developerName: currentDevName,
            title: title,
            category: category,
            price: price,
            description: description,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Write directly to unified services collection
        db.collection("services").add(serviceData)
            .then(() => {
                responseMessage.style.color = "green";
                responseMessage.textContent = "Service Gig published successfully! Redirecting...";
                serviceForm.reset();

                setTimeout(() => {
                    window.location.href = "developer-dashboard.html";
                }, 2000);
            })
            .catch((error) => {
                console.error("Error publishing service:", error);
                responseMessage.style.color = "red";
                responseMessage.textContent = "Error saving service to cloud database.";
            });
    });
}
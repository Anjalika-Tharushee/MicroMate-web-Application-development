# MicroMate Web Application

MicroMate is a student-focused marketplace prototype that helps university students discover, request, and deliver small digital services in one place. The platform is designed to connect students who need fast help with student freelancers who can handle design, development, tutoring, writing, and marketing work. It includes a polished landing page, login and signup flows, a post request page, and a theme switcher for light and dark mode.

The project is built as a front-end demo with a clean, responsive interface and client-side interactions. It focuses on a realistic campus service workflow where users can browse the marketplace, create an account, sign in, and post a service request. The UI is styled to feel modern and approachable while keeping the code simple enough to extend into a full backend-powered application later.

## What is included

- A responsive, modern landing page for the student marketplace
- A dedicated student login page with client-side validation
- A role-based signup page for Customer and Developer accounts
- A dedicated post request page with live preview and localStorage saving
- A shared dark and light mode theme toggle across pages
- Service browsing with search, category, max-price, and sorting filters
- Dynamic service cards (development, design, tutoring, content, marketing)
- Project request side panel with a working submission flow
- Marketplace stats section (active sellers, average price, average rating)

## Team members

- Anjalika Wickramasinghe
- Denuka Jayasundara
- Dineth Sewmina

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6)

## Project structure

- `index.html` - Main page and UI layout
- `styles.css` - Theme, responsive design, and animations
- `theme.js` - Shared light/dark mode behavior
- `app.js` - Service data, filtering logic, stats, and form interactions
- `login.html` - Student login page layout
- `login.css` - Login page styling and responsive behavior
- `login.js` - Login validation, remember-me, and password toggle logic
- `signup.html` - Account creation page with role selection
- `signup.css` - Signup page styling and responsive behavior
- `signup.js` - Signup validation and localStorage account persistence
- `post-request.html` - Service request form with live preview
- `post-request.css` - Styling for the post request page
- `post-request.js` - Request form validation, preview updates, and localStorage saving

## How to run

1. Open the project folder in VS Code.
2. Open `index.html` in a browser.
3. Use the filters and request form to test the core marketplace workflow.
4. Open `login.html` to test student login page behavior.
5. Open `signup.html` to create a Customer or Developer account, then log in.
6. Open `post-request.html` to submit and preview a service request.

Optional (recommended): install the VS Code Live Server extension and run the page with live reload.

## Next development steps

- Connect the request form to a backend API
- Add authentication and role-based views (buyer/seller/admin)
- Add database persistence for services and requests
- Split backend into microservices: auth, user, marketplace, order, payment, notification

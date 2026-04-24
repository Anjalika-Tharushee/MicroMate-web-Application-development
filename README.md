# MicroMate Web Application

MicroMate is a student-focused marketplace prototype for connecting university students who need quick services with student freelancers who can deliver them.

## What is included

- A responsive, modern landing page for the student marketplace
- A dedicated student login page with client-side validation
- A role-based signup page for Customer and Developer accounts
- Service browsing with search, category, max-price, and sorting filters
- Dynamic service cards (development, design, tutoring, content, marketing)
- Project request side panel with a working submission flow
- Marketplace stats section (active sellers, average price, average rating)

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6)

## Project structure

- `index.html` - Main page and UI layout
- `styles.css` - Theme, responsive design, and animations
- `app.js` - Service data, filtering logic, stats, and form interactions
- `login.html` - Student login page layout
- `login.css` - Login page styling and responsive behavior
- `login.js` - Login validation, remember-me, and password toggle logic
- `signup.html` - Account creation page with role selection
- `signup.css` - Signup page styling and responsive behavior
- `signup.js` - Signup validation and localStorage account persistence

## How to run

1. Open the project folder in VS Code.
2. Open `index.html` in a browser.
3. Use the filters and request form to test the core marketplace workflow.
4. Open `login.html` to test student login page behavior.
5. Open `signup.html` to create a Customer or Developer account, then log in.

Optional (recommended): install the VS Code Live Server extension and run the page with live reload.

## Next development steps

- Connect the request form to a backend API
- Add authentication and role-based views (buyer/seller/admin)
- Add database persistence for services and requests
- Split backend into microservices: auth, user, marketplace, order, payment, notification

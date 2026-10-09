# 🏗️ FoodNest: Architecture & Technology Overview

FoodNest is a modern, full-stack web application built using the industry-standard **MERN Stack**. This document provides a complete explanation of the technologies used and exactly how they work together to power the platform.

---

## 1. The Technology Stack (MERN)

The MERN stack allows us to use **JavaScript** across the entire application—both on the frontend (browser) and the backend (server).

### 🖥️ Frontend (The User Interface)
* **React.js**: The core library used to build the user interface. It allows us to create interactive, reusable components (like the Navbar, Cart Drawer, and Dashboards). 
* **Vite**: The build tool used to run the React application. It is significantly faster than traditional tools (like Create React App).
* **Vanilla CSS**: Used for styling the application with a focus on modern design, flexbox, grid, and responsive layouts.

### ⚙️ Backend (The Server & Logic)
* **Node.js**: The JavaScript runtime that allows us to run JavaScript on the server.
* **Express.js**: A lightweight web framework for Node.js. It handles the API routes, HTTP requests (GET, POST, PUT, DELETE), and middleware.

### 🗄️ Database (Data Storage)
* **MongoDB**: A NoSQL database that stores data in flexible, JSON-like documents. It is highly scalable and perfect for a dynamic food delivery app.
* **Mongoose**: An Object Data Modeling (ODM) library for MongoDB. It allows us to define strict schemas (blueprints) for our data (e.g., `User`, `Order`, `Menu`).

### 🔒 Security & Authentication
* **JWT (JSON Web Tokens)**: Used to securely identify logged-in users without storing session data on the server.
* **Bcrypt.js**: A cryptographic library used to safely hash (encrypt) user passwords before storing them in the database.

---

## 2. How The Application Works (The Flow)

When a user interacts with FoodNest, data flows in a continuous cycle between the Frontend, Backend, and Database.

### Step 1: The Client (Frontend)
When a user opens FoodNest, their browser downloads the React code. React manages the "State" (e.g., what items are in the cart, who is logged in). 
* *Example:* A user clicks "Log In" and enters their email and password. React captures this data.

### Step 2: The API Request (The Bridge)
React uses the native `fetch` API to send an HTTP POST request containing the email and password to the Express Backend (`http://localhost:5000/api/auth/login`).

### Step 3: The Server (Backend)
Express receives the request. It uses Mongoose to ask the MongoDB database: *"Is there a user with this email?"*
* If yes, it uses Bcrypt to compare the password.
* If the password matches, the backend generates a secure **JWT Token** and sends it back to the Frontend.

### Step 4: The Client Reaction
React receives the token, saves it in the browser's `localStorage`, and updates the UI to show the user's specific Dashboard based on their **Role**.

---

## 3. Core Features & Role-Based Access

FoodNest is a **multi-tenant platform**, meaning different types of users see completely different interfaces and have different permissions. This is handled by **Role-Based Access Control (RBAC)**.

### 👤 Customers (`role: 'customer'`)
* **Features**: Browse restaurants, view menus, add items to the cart, apply promo codes, and place orders.
* **How it works**: They interact with the public routes. When they checkout, an `Order` document is created in the database.

### 🏪 Business Partners (`role: 'restaurant' | 'cloud_kitchen' | 'caterings'`)
* **Registration**: They sign up through a special "Partner Registration" page and must provide business details (e.g., FSSAI License). Their account is created with `status: 'pending'`.
* **Features**: Once approved, they get access to a private Dashboard where they can manage their live menu inventory and update the status of incoming orders (Preparing -> Ready -> Delivered).

### 👑 Master Admin (`role: 'admin'`)
* **Features**: The supreme controller of the platform. The admin bypasses the normal app and gets a specialized Control Center.
* **Capabilities**: 
  1. **Verifications**: Approves or rejects pending business partners.
  2. **User Management**: Can view and permanently delete any user on the platform.
  3. **Global Oversight**: Can view every single order placed across the entire platform and track Total Revenue.
* **Security**: Admin routes are protected by a `requireAdmin` middleware. Even if a regular user tries to access `/api/admin/...`, the backend will reject them.

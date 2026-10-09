# 🍽️ FoodNest - Unified Food Discovery & Delivery Platform

Welcome to **FoodNest**, a comprehensive web application built to unify the fragmented food service industry. FoodNest brings local restaurants, home-based cloud kitchens, and bulk catering services together under one seamless, role-based platform.

---

## 🚀 Features of the Project

- **Unified Global Cart:** Customers can add items from various restaurants and cloud kitchens into a single shopping cart, calculate totals instantly (including promo codes), and place orders.
- **Role-Based Dashboards:** Dedicated, secure interfaces for each partner type (Restaurant, Cloud Kitchen, Caterer, and Admin).
- **Dynamic Menu Management:** Partners can add, edit, and delete their menu items in real-time. Changes immediately reflect on the customer-facing pages.
- **Smart Catering Inquiry Builder:** Customers can browse catering packages, select quantities, and submit a consolidated bulk-order inquiry directly to catering partners.
- **Live Order Tracking (Admin/Partners):** Partners can update order statuses (Pending ➔ Preparing ➔ Delivered), while Caterers can track event calendars.
- **Responsive & Modern UI:** Built with clean, vanilla CSS focusing on glassmorphism, micro-animations, and mobile-responsive layouts.

---

## 💻 Technology Stack

FoodNest is built using the **MERN** Stack, ensuring a robust, scalable, and fully JavaScript-driven ecosystem.

### Frontend
- **React.js (Vite):** Fast, modern frontend framework for building the user interface.
- **React Hooks:** Extensive use of `useState` and `useEffect` for state management and API data fetching.
- **Vanilla CSS:** Custom styling without heavy frameworks, utilizing CSS variables, Flexbox, and Grid for pixel-perfect designs.

### Backend
- **Node.js & Express.js:** RESTful API architecture handling routing, logic, and middleware.
- **JWT (JSON Web Tokens):** Secure user authentication and session management.
- **Bcrypt:** Password hashing and security.

### Database
- **MongoDB:** NoSQL database for flexible and scalable data storage.
- **Mongoose ORM:** Schema-based data modeling for structured collections (Users, Orders, Items, Inquiries).

---

## 🧩 Modules and Sub-Modules

FoodNest is logically divided into several key modules based on user roles and features:

### 1. Customer Module (Public Frontend)
- **Home / Landing:** Introduces the platform, features a search bar, and highlights top categories.
- **Restaurant Discovery:** Lists established local eateries and their dynamic menus.
- **Cloud Kitchen Hub:** Promotes "Ghar Ka Khana" (homemade food) from local home chefs.
- **Catering Menu:** Allows users to browse bulk event packages, adjust quantities, and submit a specialized inquiry cart.
- **Global Checkout Cart:** Manages selected food items, calculates delivery fees (Free delivery over ₹199), applies promo codes (e.g., `WELCOME50`), and processes the final checkout.

### 2. Partner Dashboards Module (Protected)
- **Restaurant Partner Dashboard:**
  - *Order Manager:* Accept and update live delivery orders.
  - *Menu Manager:* Add dishes, update prices, and upload images.
- **Cloud Kitchen Partner Dashboard:**
  - Specialized dashboard tailored for home chefs with daily capacity tracking.
- **Catering Partner Dashboard:**
  - *Inquiry Manager:* View incoming bulk requests and send custom price quotes.
  - *Event Calendar:* Track confirmed bookings, guest counts, and delivery dates.
  - *Package Manager:* Create and edit catering bundles (e.g., "Premium Veg Thali").

### 3. Admin Module (Superuser)
- **Admin Dashboard:** Centralized command center.
- *User Management:* Approve new partners and manage existing customers.
- *System Analytics:* Track total orders, revenue, and platform usage.

### 4. Authentication Module
- **User / Partner Signup:** Handles registration and role assignment (`restaurant`, `cloud_kitchen`, `caterings`, `admin`).
- **Secure Login:** Validates credentials and distributes JWT access tokens.

---

## 🔮 Future Scope

While FoodNest is already a fully functional platform, the architecture is designed to support several high-impact future enhancements:

1. **Real-Time WebSockets (Socket.io):** 
   - Implementing live GPS tracking for delivery drivers on a map.
   - Instant push notifications for restaurants when a new order arrives (without refreshing the page).
2. **Payment Gateway Integration:** 
   - Integrating Stripe or Razorpay to move beyond UPI/COD and process credit/debit card payments directly in the cart.
3. **AI-Powered Recommendations:** 
   - Analyzing past order history to suggest dishes or cloud kitchens the user might like.
4. **Mobile Application:** 
   - Porting the React frontend to **React Native** to launch dedicated iOS and Android apps.
5. **Review & Rating System:** 
   - Allowing customers to rate specific dishes and leave verified reviews for home chefs to build community trust.

---
*Developed with ❤️ using the MERN Stack.*

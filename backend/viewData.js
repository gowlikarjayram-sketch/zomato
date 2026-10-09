const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

const viewData = async () => {
  try {
    // Connect to the DB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodnest');
    console.log('✅ Connected to MongoDB (FoodNest)\n');

    // 1. Fetch Users
    console.log('--- 👤 REGISTERED USERS ---');
    const users = await User.find().select('-password'); // Hide password for security
    if (users.length === 0) {
      console.log('No users found.');
    } else {
      users.forEach((u, i) => {
        console.log(`${i + 1}. Name: ${u.name} | Role: ${u.role} | Email: ${u.email}`);
      });
    }
    console.log('\n');

    // 2. Fetch Menu Items (Limit to first 3 for brevity)
    console.log('--- 🍛 MENU ITEMS (First 3) ---');
    const menu = await MenuItem.find().limit(3);
    if (menu.length === 0) {
      console.log('No menu items found.');
    } else {
      menu.forEach((m, i) => {
        console.log(`${i + 1}. Dish: ${m.name} | Price: ₹${m.price} | Category: ${m.category}`);
      });
    }
    console.log('\n');

    // 3. Fetch Orders
    console.log('--- 🍳 LIVE ORDERS ---');
    const orders = await Order.find();
    if (orders.length === 0) {
      console.log('No active orders.');
    } else {
      orders.forEach((o, i) => {
        console.log(`${i + 1}. Order ID: ${o._id} | Items: ${o.items} | Status: ${o.status}`);
      });
    }
    console.log('\n');

    console.log('✨ End of Database View ✨');
    process.exit(0);
  } catch (err) {
    console.error('Error fetching data:', err);
    process.exit(1);
  }
};

viewData();

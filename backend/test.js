const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

const runTest = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodnest');
    console.log('✅ Connected to DB');

    // 1. Create a dummy test user
    const email = `testuser_${Date.now()}@example.com`;
    const user = new User({ name: 'Test User', email, password: 'password123', role: 'restaurant' });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    console.log('✅ Created test user:', user.email);

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: 3600 });
    console.log('✅ Generated JWT Token');

    // 2. Test Menu creation via function call instead of HTTP to ensure models work
    const newDish = new MenuItem({
      name: 'Test Biryani',
      price: '₹200',
      category: 'Main Course'
    });
    await newDish.save();
    console.log('✅ Created new MenuItem:', newDish.name);

    // 3. Test Order creation
    const newOrder = new Order({
      restaurant: user.id,
      items: '1x Test Biryani',
      amount: '₹200',
      status: 'Preparing'
    });
    await newOrder.save();
    console.log('✅ Created new Order:', newOrder.items);

    // Cleanup
    await User.findByIdAndDelete(user.id);
    await MenuItem.findByIdAndDelete(newDish.id);
    await Order.findByIdAndDelete(newOrder.id);
    console.log('✅ Cleanup successful');

    console.log('🎉 All backend tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

runTest();

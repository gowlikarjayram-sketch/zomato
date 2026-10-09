const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodnest');
    console.log('✅ Connected to MongoDB');

    const email = 'admin@foodnest.com';
    const password = 'AdminPassword123!';

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('⚠️ Master Admin already exists! You can log in with:');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminUser = new User({
      name: 'Master Admin',
      email: email,
      password: hashedPassword,
      phone: '0000000000',
      role: 'admin',
      status: 'active'
    });

    await adminUser.save();
    console.log('🎉 SUCCESS: Master Admin Account Created!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
};

createAdmin();

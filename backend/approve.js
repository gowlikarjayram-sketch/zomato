const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const approvePartner = async (email) => {
  if (!email) {
    console.error('Usage: node approve.js <email>');
    process.exit(1);
  }

  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodnest');
    console.log('✅ Connected to MongoDB');

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
      process.exit(1);
    }

    if (user.role === 'customer') {
      console.error(`❌ User ${email} is a customer, not a partner.`);
      process.exit(1);
    }

    if (user.status === 'active') {
      console.log(`⚠️ Partner ${email} is already verified and active!`);
      process.exit(0);
    }

    // Approve user
    user.status = 'active';
    await user.save();

    console.log(`🎉 SUCCESS: Partner account for ${user.businessDetails?.businessName || user.name} (${email}) has been APPROVED!`);
    console.log(`They can now log in to the ${user.role} dashboard.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

const emailArg = process.argv[2];
approvePartner(emailArg);

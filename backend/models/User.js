const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    enum: ['customer', 'restaurant', 'cloud_kitchen', 'caterings', 'admin'],
    default: 'customer',
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected'],
    default: 'active'
  },
  businessDetails: {
    businessName: String,
    fssaiNumber: String,
    address: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

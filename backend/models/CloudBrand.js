const mongoose = require('mongoose');

const cloudBrandSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  orders: { type: Number, default: 0 },
  revenue: { type: String, default: '₹0' },
  status: { type: String, default: 'Active' }, // Active, Paused
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CloudBrand', cloudBrandSchema);

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: String, required: true },
  amount: { type: String, required: true },
  status: { type: String, default: 'Preparing' }, // Preparing, Ready, Delivered
  time: { type: String, default: 'Just now' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);

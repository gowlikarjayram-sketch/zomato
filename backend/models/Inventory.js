const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: String, required: true },
  quantity: { type: String, required: true },
  status: { type: String, default: 'In Stock' }, // In Stock, Low Stock, Critical
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', inventorySchema);

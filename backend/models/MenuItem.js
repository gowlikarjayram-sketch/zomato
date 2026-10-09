const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  id: { type: Number, unique: true, sparse: true }, // sparse allows nulls without unique constraint errors
  name: { type: String, required: true },
  price: { type: mongoose.Schema.Types.Mixed, required: true }, // Mixed supports Number or String ('₹250')
  image: { type: String },
  category: { type: String, required: true },
  diet: { type: String, enum: ['veg', 'non_veg'] },
  rating: { type: String },
  time: { type: String },
  spicy: { type: Boolean, default: false },
  calories: { type: String },
  description: { type: String },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inStock: { type: Boolean, default: true } // Added for Dashboard
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);

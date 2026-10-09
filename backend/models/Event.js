const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventName: { type: String, required: true },
  guests: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Confirmed, Preparing
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);

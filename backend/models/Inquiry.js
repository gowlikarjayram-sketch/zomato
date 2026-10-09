const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  client: { 
    type: String, 
    required: true,
    trim: true,
    minlength: [2, 'Client name must be at least 2 characters long']
  },
  phone: { 
    type: String, 
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  event: { 
    type: String, 
    required: true,
    trim: true
  },
  guests: { 
    type: Number, 
    required: true,
    min: [1, 'Must have at least 1 guest']
  },
  items: {
    type: String, // E.g., "Premium Veg Thali Setup, Live Dosa Counter"
  },
  status: { 
    type: String, 
    default: 'New',
    enum: ['New', 'Quoted', 'Declined'] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Inquiry', inquirySchema);

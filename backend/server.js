const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodnest';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB (FoodNest)');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });

// Basic Route for Testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'FoodNest API is running' });
});

// Import Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/restaurant', require('./routes/restaurant'));
app.use('/api/cloudkitchen', require('./routes/cloudkitchen'));
app.use('/api/catering', require('./routes/catering'));
app.use('/api/admin', require('./routes/admin'));

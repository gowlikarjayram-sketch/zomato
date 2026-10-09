const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// --- PUBLIC ROUTES ---
router.get('/public/list', async (req, res) => {
  try {
    const User = require('../models/User');
    const activeRestaurants = await User.find({ 
      role: 'restaurant',
      $or: [{ status: 'active' }, { status: { $exists: false } }]
    }).select('-password'); // Exclude passwords
    res.json(activeRestaurants);
  } catch (err) {
    console.error('Error fetching public restaurants:', err);
    res.status(500).send('Server Error');
  }
});

// --- ORDERS ---
router.post('/public/orders', async (req, res) => {
  try {
    const User = require('../models/User');
    // Find the first registered restaurant partner to assign the order to
    const restaurant = await User.findOne({ role: 'restaurant' });
    if (!restaurant) {
      return res.status(404).json({ error: 'No restaurant partner available to receive this order' });
    }

    const newOrder = new Order({
      restaurant: restaurant._id,
      items: req.body.items,
      amount: req.body.amount,
      status: 'Preparing',
      time: 'Just now'
    });
    
    await newOrder.save();
    res.json(newOrder);
  } catch (err) {
    console.error('Error saving public order:', err);
    res.status(500).send('Server Error');
  }
});

router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/orders/:id/status', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/orders', auth, async (req, res) => {
  try {
    const newOrder = new Order({
      restaurant: req.user.id,
      items: req.body.items,
      amount: req.body.amount,
      status: req.body.status || 'Preparing'
    });
    await newOrder.save();
    res.json(newOrder);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- MENU ---
router.get('/menu', auth, async (req, res) => {
  try {
    const menu = await MenuItem.find({ restaurant: req.user.id });
    res.json(menu);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/menu', auth, async (req, res) => {
  try {
    const newItem = new MenuItem({
      ...req.body,
      restaurant: req.user.id
    });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/menu/:id', auth, async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;

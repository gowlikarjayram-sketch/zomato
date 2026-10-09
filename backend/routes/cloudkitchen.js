const express = require('express');
const router = express.Router();
const CloudBrand = require('../models/CloudBrand');
const Inventory = require('../models/Inventory');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
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

// --- CLOUD BRANDS ---
router.get('/brands', auth, async (req, res) => {
  try {
    const brands = await CloudBrand.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(brands);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/brands', auth, async (req, res) => {
  try {
    const newBrand = new CloudBrand({ ...req.body, user: req.user.id });
    await newBrand.save();
    res.json(newBrand);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/brands/:id', auth, async (req, res) => {
  try {
    const updated = await CloudBrand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- INVENTORY ---
router.get('/inventory', auth, async (req, res) => {
  try {
    const inventory = await Inventory.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(inventory);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/inventory', auth, async (req, res) => {
  try {
    const newItem = new Inventory({ ...req.body, user: req.user.id });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/inventory/:id', auth, async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- CLOUD KITCHEN PUBLIC ROUTES ---
router.get('/public/list', async (req, res) => {
  try {
    const activeKitchens = await User.find({
      role: 'cloud_kitchen',
      $or: [{ status: 'active' }, { status: { $exists: false } }]
    }).select('-password');
    res.json(activeKitchens);
  } catch (err) {
    console.error('Error fetching public cloud kitchens:', err.message);
    res.status(500).send('Server Error');
  }
});

// --- DISHES / MENU ---
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
    console.error('Menu save error:', err);
    res.status(500).json({ error: err.message || 'Server Error' });
  }
});

module.exports = router;

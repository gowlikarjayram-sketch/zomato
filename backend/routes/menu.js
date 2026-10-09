const express = require('express');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// GET all menu items (populated with restaurant info)
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find().populate('restaurant', 'name businessDetails role');
    res.json(items);
  } catch (err) {
    console.error('Error fetching menu:', err.message);
    res.status(500).send('Server error');
  }
});

// POST to add a new menu item (For admin/restaurant dashboard)
router.post('/', async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error('Error saving menu item:', err.message);
    res.status(500).send('Server error');
  }
});

// POST to seed initial data
router.post('/seed', async (req, res) => {
  try {
    const count = await MenuItem.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Database already seeded' });
    }
    
    // Expecting array of items in req.body
    await MenuItem.insertMany(req.body);
    res.json({ message: 'Menu items seeded successfully' });
  } catch (err) {
    console.error('Error seeding data:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Package = require('../models/Package');
const Inquiry = require('../models/Inquiry');
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

// --- EVENTS ---
router.get('/events', auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/events', auth, async (req, res) => {
  try {
    const newEvent = new Event({ ...req.body, user: req.user.id });
    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/events/:id', auth, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- PACKAGES ---
router.get('/packages', auth, async (req, res) => {
  try {
    const packages = await Package.find({ user: req.user.id });
    res.json(packages);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/packages', auth, async (req, res) => {
  try {
    const newPackage = new Package({ ...req.body, user: req.user.id });
    await newPackage.save();
    res.json(newPackage);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/packages/:id', auth, async (req, res) => {
  try {
    const updated = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- PUBLIC INQUIRIES (From Customer Form) ---
router.post('/public/inquiries', async (req, res) => {
  try {
    const User = require('../models/User');
    // Find a catering partner to assign this inquiry to
    const caterer = await User.findOne({ role: 'caterings' });
    if (!caterer) {
      return res.status(404).json({ error: 'No catering partner available to receive this inquiry' });
    }

    const newInquiry = new Inquiry({ ...req.body, user: caterer._id });
    await newInquiry.save();
    res.json(newInquiry);
  } catch (err) {
    console.error('Error saving public inquiry:', err);
    res.status(500).send('Server Error');
  }
});

// --- INQUIRIES (For Dashboard) ---
router.get('/inquiries', auth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/inquiries', auth, async (req, res) => {
  try {
    const newInquiry = new Inquiry({ ...req.body, user: req.user.id });
    await newInquiry.save();
    res.json(newInquiry);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.put('/inquiries/:id', auth, async (req, res) => {
  try {
    const updated = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- CATERING PUBLIC ROUTES ---
router.get('/public/list', async (req, res) => {
  try {
    const User = require('../models/User');
    const activeCaterers = await User.find({
      role: 'caterings',
      $or: [{ status: 'active' }, { status: { $exists: false } }]
    }).select('-password');
    res.json(activeCaterers);
  } catch (err) {
    console.error('Error fetching public caterers:', err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/public/packages', async (req, res) => {
  try {
    const packages = await Package.find().populate('user', 'name businessDetails role');
    res.json(packages);
  } catch (err) {
    console.error('Error fetching public packages:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

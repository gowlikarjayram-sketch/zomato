const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');

// Middleware to authenticate and authorize admin
const requireAdmin = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.user.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Master Admin only.' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// @route   GET /api/admin/partners/pending
// @desc    Get all pending partner applications
router.get('/partners/pending', requireAdmin, async (req, res) => {
  try {
    const pendingPartners = await User.find({ status: 'pending', role: { $ne: 'customer' } }).select('-password');
    res.json(pendingPartners);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/partners/:id/approve
// @desc    Approve a pending partner
router.put('/partners/:id/approve', requireAdmin, async (req, res) => {
  try {
    const partner = await User.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    partner.status = 'active';
    await partner.save();

    res.json({ message: 'Partner approved successfully', partner });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/partners/:id/reject
// @desc    Reject a pending partner
router.put('/partners/:id/reject', requireAdmin, async (req, res) => {
  try {
    const partner = await User.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    partner.status = 'rejected';
    await partner.save();

    res.json({ message: 'Partner rejected', partner });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/metrics
// @desc    Get dashboard metrics
router.get('/metrics', requireAdmin, async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    
    // Count active partners, including legacy users who don't have a status field yet (Mongoose default is active but countDocuments checks raw DB)
    const activePartners = await User.countDocuments({
      $or: [{ status: 'active' }, { status: { $exists: false } }],
      role: { $in: ['restaurant', 'cloud_kitchen', 'caterings'] }
    });

    const pendingPartners = await User.countDocuments({ status: 'pending' });

    // Calculate Orders and Revenue
    const orders = await Order.find();
    const totalOrders = orders.length;
    let totalRevenue = 0;
    orders.forEach(order => {
      const amtStr = order.amount || '0';
      const num = parseFloat(amtStr.replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) totalRevenue += num;
    });

    res.json({ totalCustomers, activePartners, pendingPartners, totalOrders, totalRevenue });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/orders
// @desc    Get all platform orders
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('restaurant', 'name businessDetails.businessName').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;

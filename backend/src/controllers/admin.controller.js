const User = require('../models/User');
const Device = require('../models/Device');
const Recommendation = require('../models/Recommendation');
const Notification = require('../models/Notification');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const { sendBulkSMS } = require('../services/smsService');

exports.dashboard = async (req, res, next) => {
  try {
    const [farmers, experts, devices, recs, crops, alerts] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'expert' }),
      Device.countDocuments({ status: 'active' }),
      Recommendation.countDocuments(),
      Crop.aggregate([{ $group: { _id: '$name', count: { $sum: 1 } } }]),
      Notification.countDocuments(),
    ]);
    res.json({
      counts: { farmers, experts, devices, recommendations: recs, alerts },
      cropDistribution: crops,
    });
  } catch (err) { next(err); }
};

exports.listUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ users });
  } catch (err) { next(err); }
};

exports.createUser = async (req, res, next) => {
  try {
    const u = await User.create(req.body);
    const safe = u.toObject(); delete safe.password;
    res.status(201).json({ user: safe });
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // require dedicated endpoint to change password
    const u = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!u) return res.status(404).json({ error: 'NotFound' });
    res.json({ user: u });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
};

exports.listDevices = async (_req, res, next) => {
  try { res.json({ devices: await Device.find().sort('-createdAt') }); } catch (e) { next(e); }
};

exports.createDevice = async (req, res, next) => {
  try { res.status(201).json({ device: await Device.create(req.body) }); } catch (e) { next(e); }
};

exports.analytics = async (_req, res, next) => {
  try {
    const recsByType = await Recommendation.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);
    const farms = await Farm.countDocuments();
    res.json({ recsByType, farms });
  } catch (err) { next(err); }
};

exports.systemHealth = async (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    ts: Date.now(),
  });
};

exports.listNotifications = async (_req, res, next) => {
  try { res.json({ notifications: await Notification.find().sort('-createdAt').limit(200) }); }
  catch (e) { next(e); }
};

exports.sendNotification = async (req, res, next) => {
  try {
    const { title, message, channel = 'inapp', userIds = [], severity = 'info' } = req.body;
    const targets = userIds.length ? userIds : [null]; // null = broadcast
    const created = await Notification.insertMany(
      targets.map((u) => ({ user: u, title, message, channel, severity }))
    );
    if (channel === 'sms' && userIds.length) {
      const users = await User.find({ _id: { $in: userIds } }).select('phone');
      await sendBulkSMS(users.map((u) => u.phone).filter(Boolean), `${title}: ${message}`);
    }
    res.status(201).json({ notifications: created });
  } catch (err) { next(err); }
};

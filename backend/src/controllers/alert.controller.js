const Notification = require('../models/Notification');

exports.userAlerts = async (req, res, next) => {
  try {
    const items = await Notification.find({
      $or: [{ user: req.user._id }, { user: null }],
    }).sort('-createdAt').limit(100);
    res.json({ alerts: items });
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    await Notification.updateOne({ _id: req.params.id, user: req.user._id }, { read: true });
    res.json({ ok: true });
  } catch (err) { next(err); }
};

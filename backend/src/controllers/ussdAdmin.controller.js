const USSDSession = require('../models/USSDSession');

exports.list = async (_req, res, next) => {
  try {
    const sessions = await USSDSession.find().sort('-updatedAt').limit(100);
    res.json({ sessions });
  } catch (e) { next(e); }
};

exports.stats = async (_req, res, next) => {
  try {
    const total = await USSDSession.countDocuments();
    const byLang = await USSDSession.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } },
    ]);
    const last24h = await USSDSession.countDocuments({
      updatedAt: { $gte: new Date(Date.now() - 24 * 3600 * 1000) },
    });
    res.json({ total, last24h, byLang });
  } catch (e) { next(e); }
};

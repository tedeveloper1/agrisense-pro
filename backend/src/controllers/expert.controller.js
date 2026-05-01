const Recommendation = require('../models/Recommendation');
const Farm = require('../models/Farm');
const IoTData = require('../models/IoTData');

exports.dashboard = async (_req, res, next) => {
  try {
    const pending = await Recommendation.countDocuments({ status: 'pending' });
    const recent = await Recommendation.find().sort('-createdAt').limit(10).populate('user', 'name email');
    res.json({ pending, recent });
  } catch (err) { next(err); }
};

exports.reviews = async (_req, res, next) => {
  try {
    const items = await Recommendation.find({ status: 'pending' })
      .sort('-createdAt').populate('user', 'name email').populate('farm', 'name');
    res.json({ reviews: items });
  } catch (err) { next(err); }
};

exports.override = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, status = 'approved' } = req.body;
    const rec = await Recommendation.findByIdAndUpdate(
      id,
      { overriddenBy: req.user._id, overrideMessage: message, status, source: 'expert' },
      { new: true }
    );
    if (!rec) return res.status(404).json({ error: 'NotFound' });
    res.json({ recommendation: rec });
  } catch (err) { next(err); }
};

exports.intervention = async (req, res, next) => {
  try {
    const rec = await Recommendation.create({
      user: req.body.userId,
      farm: req.body.farmId,
      type: req.body.type || 'general',
      title: req.body.title,
      message: req.body.message,
      severity: req.body.severity || 'medium',
      source: 'expert',
      status: 'approved',
    });
    res.status(201).json({ recommendation: rec });
  } catch (err) { next(err); }
};

exports.farmData = async (_req, res, next) => {
  try {
    const farms = await Farm.find().populate('owner', 'name email');
    const latestByFarm = await Promise.all(
      farms.map(async (f) => ({
        farm: f,
        latest: await IoTData.findOne({ farm: f._id }).sort('-timestamp'),
      }))
    );
    res.json({ farms: latestByFarm });
  } catch (err) { next(err); }
};

exports.advisories = async (_req, res, next) => {
  try {
    const items = await Recommendation.find({ source: 'expert' }).sort('-createdAt').limit(50);
    res.json({ advisories: items });
  } catch (err) { next(err); }
};

const Recommendation = require('../models/Recommendation');
const IoTData = require('../models/IoTData');
const Farm = require('../models/Farm');

exports.userHistory = async (req, res, next) => {
  try {
    const farms = await Farm.find({ owner: req.user._id }).select('_id');
    const farmIds = farms.map((f) => f._id);
    const [recs, iot] = await Promise.all([
      Recommendation.find({ user: req.user._id }).sort('-createdAt').limit(50),
      IoTData.find({ farm: { $in: farmIds } }).sort('-timestamp').limit(100),
    ]);
    res.json({ recommendations: recs, iot });
  } catch (err) { next(err); }
};

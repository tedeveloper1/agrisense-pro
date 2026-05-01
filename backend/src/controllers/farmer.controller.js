const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const IoTData = require('../models/IoTData');
const Recommendation = require('../models/Recommendation');
const Notification = require('../models/Notification');

exports.dashboard = async (req, res, next) => {
  try {
    const farms = await Farm.find({ owner: req.user._id });
    const farmIds = farms.map((f) => f._id);
    const [crops, latestIot, recs, alerts] = await Promise.all([
      Crop.countDocuments({ farm: { $in: farmIds } }),
      IoTData.findOne({ farm: { $in: farmIds } }).sort('-timestamp'),
      Recommendation.find({ user: req.user._id }).sort('-createdAt').limit(5),
      Notification.find({ $or: [{ user: req.user._id }, { user: null }] })
        .sort('-createdAt').limit(5),
    ]);
    res.json({
      summary: { farms: farms.length, crops, hasSensorData: !!latestIot },
      latestIot,
      recommendations: recs,
      alerts,
    });
  } catch (err) { next(err); }
};

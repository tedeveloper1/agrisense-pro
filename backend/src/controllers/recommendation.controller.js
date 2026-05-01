const Recommendation = require('../models/Recommendation');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const IoTData = require('../models/IoTData');
const engine = require('../services/recommendationEngine');
const { predictPest } = require('../services/pestPredictionService');

exports.userRecommendations = async (req, res, next) => {
  try {
    const recs = await Recommendation.find({ user: req.user._id })
      .sort('-createdAt')
      .limit(100);
    res.json({ recommendations: recs });
  } catch (err) { next(err); }
};

exports.generateForUser = async (req, res, next) => {
  try {
    const farms = await Farm.find({ owner: req.user._id });
    const created = [];
    for (const farm of farms) {
      const crops = await Crop.find({ farm: farm._id });
      const latest = await IoTData.findOne({ farm: farm._id }).sort('-timestamp');
      if (!latest) continue;

      for (const crop of crops) {
        const irrig = engine.irrigationRecommendation({
          soilMoisture: latest.soilMoisture,
          rainfall: latest.rainfall,
          temperature: latest.temperature,
          cropStage: crop.stage,
        });
        const fert = engine.fertilizationRecommendation({ cropStage: crop.stage, crop: crop.name });
        const pestPred = await predictPest({
          crop: crop.name,
          temperature: latest.temperature,
          humidity: latest.humidity,
          rainfall: latest.rainfall,
        });
        const pest = engine.pestRecommendation(pestPred);

        for (const r of [irrig, fert, pest].filter(Boolean)) {
          const doc = await Recommendation.create({
            user: req.user._id,
            farm: farm._id,
            crop: crop._id,
            type: r.title.toLowerCase().includes('pest') ? 'pest'
              : r.title.toLowerCase().includes('irrig') ? 'irrigation'
              : 'fertilization',
            title: r.title,
            message: r.message,
            severity: r.severity,
            source: 'rule',
          });
          created.push(doc);
        }
      }
    }
    res.json({ created: created.length, recommendations: created });
  } catch (err) { next(err); }
};

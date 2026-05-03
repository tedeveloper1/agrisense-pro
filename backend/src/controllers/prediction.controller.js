const Prediction = require('../models/Prediction');
const { predictDisease } = require('../services/diseasePredictionService');

exports.diagnose = async (req, res, next) => {
  try {
    const { crop, symptoms = [], imageUrl, notes, farm, cropId } = req.body || {};
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'At least one symptom is required.' });
    }
    const result = await predictDisease({ crop, symptoms, imageUrl, notes });
    const doc = await Prediction.create({
      farm: farm || undefined,
      crop: cropId || undefined,
      type: 'disease',
      label: result.label,
      confidence: result.confidence,
      payload: { crop, symptoms, imageUrl, notes, ...result, user: req.user._id },
    });
    res.status(201).json({ prediction: { _id: doc._id, ...result, createdAt: doc.createdAt } });
  } catch (err) { next(err); }
};

exports.history = async (req, res, next) => {
  try {
    const items = await Prediction.find({ type: 'disease', 'payload.user': req.user._id })
      .sort('-createdAt')
      .limit(50);
    res.json({ predictions: items });
  } catch (err) { next(err); }
};

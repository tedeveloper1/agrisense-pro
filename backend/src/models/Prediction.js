const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', index: true },
    crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
    type: { type: String, enum: ['pest', 'disease', 'yield'], required: true },
    label: String,            // e.g. 'fall_armyworm'
    confidence: Number,       // 0..1
    payload: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prediction', PredictionSchema);

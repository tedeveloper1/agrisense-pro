const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', index: true },
    crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
    type: { type: String, enum: ['irrigation', 'fertilization', 'pest', 'general'], required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ['info', 'low', 'medium', 'high'], default: 'info' },
    source: { type: String, enum: ['ai', 'expert', 'rule'], default: 'rule' },
    overriddenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    overrideMessage: String,
    status: { type: String, enum: ['pending', 'approved', 'dismissed'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recommendation', RecommendationSchema);

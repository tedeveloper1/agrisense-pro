const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema(
  {
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    name: { type: String, required: true, trim: true }, // e.g. maize, tomato
    variety: { type: String, trim: true },
    plantingDate: Date,
    expectedHarvestDate: Date,
    stage: {
      type: String,
      enum: ['planning', 'planted', 'germination', 'vegetative', 'flowering', 'harvest', 'completed'],
      default: 'planning',
    },
    areaHa: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', CropSchema);

const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    location: {
      district: String,
      sector: String,
      cell: String,
      lat: Number,
      lng: Number,
    },
    sizeHa: { type: Number, default: 0, min: 0 },
    soilType: { type: String, enum: ['clay', 'loam', 'sandy', 'silt', 'unknown'], default: 'unknown' },
    notes: String,
  },
  { timestamps: true }
);

FarmSchema.index({ owner: 1, name: 1 });

module.exports = mongoose.model('Farm', FarmSchema);

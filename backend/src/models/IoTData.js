const mongoose = require('mongoose');

const IoTDataSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, index: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', index: true },
    soilMoisture: Number,    // %
    temperature: Number,     // °C
    humidity: Number,        // %
    rainfall: Number,        // mm
    lightIntensity: Number,  // lux
    ph: Number,              // soil pH (0–14, ideal 6.0–7.0 for most crops)
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

IoTDataSchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('IoTData', IoTDataSchema);

const mongoose = require('mongoose');

const WeatherLogSchema = new mongoose.Schema(
  {
    region: { type: String, index: true },
    lat: Number,
    lng: Number,
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    windSpeed: Number,
    condition: String,
    forecastFor: Date,
    raw: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('WeatherLog', WeatherLogSchema);

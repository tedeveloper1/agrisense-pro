const mongoose = require('mongoose');

const USSDSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    phoneNumber: { type: String, required: true, index: true },
    state: { type: String, default: 'menu' },
    language: { type: String, enum: ['en', 'rw', 'fr'], default: 'en' },
    context: { type: mongoose.Schema.Types.Mixed, default: {} },
    lastInput: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('USSDSession', USSDSessionSchema);

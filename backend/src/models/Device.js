const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
    label: String,
    type: { type: String, default: 'sensor-node' },
    status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active', index: true },
    lastSeenAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Device', DeviceSchema);

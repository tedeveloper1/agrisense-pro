const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // null = broadcast
    title: { type: String, required: true },
    message: { type: String, required: true },
    channel: { type: String, enum: ['inapp', 'sms', 'email'], default: 'inapp' },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);

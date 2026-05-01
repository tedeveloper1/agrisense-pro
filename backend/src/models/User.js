const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['admin', 'farmer', 'expert'];

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true, index: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ROLES, default: 'farmer', index: true },
    language: { type: String, enum: ['en', 'rw', 'fr'], default: 'en' },
    region: { type: String, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

UserSchema.statics.ROLES = ROLES;

module.exports = mongoose.model('User', UserSchema);

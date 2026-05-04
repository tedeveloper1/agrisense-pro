const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');

function signToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function makeVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, language, region } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Conflict', message: 'Email already in use' });

    const allowedRole = ['farmer', 'expert'].includes(role) ? role : 'farmer';
    const token = makeVerificationToken();
    const user = await User.create({
      name, email, password, phone, role: allowedRole, language, region,
      emailVerified: false,
      emailVerificationToken: token,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    try { await sendVerificationEmail(user, token); } catch (e) { console.error('[auth] email send failed', e.message); }

    res.status(201).json({
      message: 'Account created. Please check your email to verify your address before signing in.',
      requiresVerification: true,
      email: user.email,
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.active) return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    if (!user.emailVerified) {
      return res.status(403).json({
        error: 'EmailNotVerified',
        message: 'Please verify your email before signing in.',
        email: user.email,
      });
    }
    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, language: user.language },
    });
  } catch (err) { next(err); }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'BadRequest', message: 'Missing token' });
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) return res.status(400).json({ error: 'Invalid', message: 'Invalid or expired verification link.' });
    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      return res.status(400).json({ error: 'Expired', message: 'Verification link expired. Please request a new one.' });
    }
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    const jwtToken = signToken(user);
    res.json({
      message: 'Email verified successfully.',
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, language: user.language },
    });
  } catch (err) { next(err); }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Always respond ok to avoid email enumeration
    if (user && !user.emailVerified) {
      const token = makeVerificationToken();
      user.emailVerificationToken = token;
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();
      try { await sendVerificationEmail(user, token); } catch (e) { console.error(e.message); }
    }
    res.json({ ok: true, message: 'If an account exists, a verification email has been sent.' });
  } catch (err) { next(err); }
};

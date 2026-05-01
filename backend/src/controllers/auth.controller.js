const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, language, region } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Conflict', message: 'Email already in use' });

    const allowedRole = ['farmer', 'expert'].includes(role) ? role : 'farmer';
    const user = await User.create({ name, email, password, phone, role: allowedRole, language, region });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, language: user.language },
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

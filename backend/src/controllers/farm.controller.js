const Farm = require('../models/Farm');

exports.list = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { owner: req.user._id };
    const farms = await Farm.find(filter).sort('-createdAt');
    res.json({ farms });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const farm = await Farm.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ farm });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') filter.owner = req.user._id;
    const farm = await Farm.findOneAndUpdate(filter, req.body, { new: true });
    if (!farm) return res.status(404).json({ error: 'NotFound' });
    res.json({ farm });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') filter.owner = req.user._id;
    const farm = await Farm.findOneAndDelete(filter);
    if (!farm) return res.status(404).json({ error: 'NotFound' });
    res.json({ ok: true });
  } catch (err) { next(err); }
};

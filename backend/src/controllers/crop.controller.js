const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

async function userOwnsFarm(user, farmId) {
  if (user.role === 'admin') return true;
  const f = await Farm.findOne({ _id: farmId, owner: user._id });
  return !!f;
}

exports.list = async (req, res, next) => {
  try {
    const farms = await Farm.find(req.user.role === 'admin' ? {} : { owner: req.user._id }).select('_id');
    const crops = await Crop.find({ farm: { $in: farms.map((f) => f._id) } }).populate('farm', 'name');
    res.json({ crops });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { farm } = req.body;
    if (!(await userOwnsFarm(req.user, farm))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const crop = await Crop.create(req.body);
    res.status(201).json({ crop });
  } catch (err) { next(err); }
};

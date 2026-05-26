const IoTData = require('../models/IoTData');
const Device = require('../models/Device');

exports.ingest = async (req, res, next) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId) return res.status(400).json({ error: 'ValidationError', message: 'deviceId is required' });

    const device = await Device.findOneAndUpdate(
      { deviceId },
      { $set: { lastSeenAt: new Date() }, $setOnInsert: { status: 'active' } },
      { upsert: true, new: true }
    );

    const reading = await IoTData.create({
      ...req.body,
      farm: device.farm,
      timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date(),
    });
    res.status(201).json({ reading });
  } catch (err) { next(err); }
};
exports.ingestData = async (req, res) => {
  try {
    const {
      deviceId, soilMoisture, temperature,
      humidity, pH, irrigationActive, pesticideActive
    } = req.body;

    const entry = await IoTData.create({
      deviceId, soilMoisture, temperature,
      humidity, pH, irrigationActive, pesticideActive
    });

    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.latest = async (req, res, next) => {
  try {
    const { deviceId } = req.query;
    const filter = deviceId ? { deviceId } : {};
    const latest = await IoTData.findOne(filter).sort('-timestamp');
    res.json({ latest });
  } catch (err) { next(err); }
};

exports.history = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '100', 10), 500);
    const data = await IoTData.find({ deviceId: req.params.deviceId })
      .sort('-timestamp')
      .limit(limit);
    res.json({ data });
  } catch (err) { next(err); }
};
// Paste this new controller function:
exports.getPumpStatus = async (req, res) => {
  try {
    const { deviceId } = req.query;
    const latest = await IoTData.findOne({ deviceId })
      .sort({ createdAt: -1 });

    res.json({
      pesticidePump: latest ? latest.pesticideActive : false,
      irrigation:    latest ? latest.irrigationActive : false,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

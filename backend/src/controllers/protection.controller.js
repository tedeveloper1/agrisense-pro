const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const IoTData = require('../models/IoTData');
const Notification = require('../models/Notification');
const User = require('../models/User');
const {
  detectHazards,
  computeRiskScore,
  buildPreventiveCalendar,
  predictLikelyDiseases,
} = require('../services/protectionService');
const { getCurrentWeather, getForecast, getSeason } = require('../services/weatherService');
const { sendBulkEmail } = require('../services/emailService');

/**
 * GET /api/protection/overview
 * Per-crop risk scores, hazards, AND likely diseases pulled directly from
 * live sensor data + Open-Meteo + Rwanda season.
 */
exports.overview = async (req, res, next) => {
  try {
    const farms = await Farm.find({ owner: req.user._id });
    const farmIds = farms.map((f) => f._id);
    const crops = await Crop.find({ farm: { $in: farmIds } });

    const result = [];
    for (const farm of farms) {
      const weather = await getCurrentWeather({
        region: farm.location?.district || 'Kigali',
        lat: farm.location?.lat,
        lng: farm.location?.lng,
      });
      const forecast = await getForecast({
        region: farm.location?.district || 'Kigali',
        lat: farm.location?.lat, lng: farm.location?.lng, days: 5,
      });
      const iot = (await IoTData.findOne({ farm: farm._id }).sort('-timestamp')) || {};
      const merged = {
        ...weather,
        humidity: iot.humidity ?? weather.humidity,
        temperature: iot.temperature ?? weather.temperature,
        ph: iot.ph,
      };
      const hazards = detectHazards(merged);
      const farmCrops = crops.filter((c) => String(c.farm) === String(farm._id));
      const cropList = farmCrops.length ? farmCrops : [{ name: 'maize', stage: 'vegetative' }];

      const cropRisks = cropList.map((c) =>
        computeRiskScore({
          crop: c.name, stage: c.stage,
          weather,
          iot: { humidity: iot.humidity, temperature: iot.temperature, soilMoisture: iot.soilMoisture, ph: iot.ph },
        })
      );
      const diseases = cropList.flatMap((c) =>
        predictLikelyDiseases({ crop: c.name, stage: c.stage, weather, iot })
          .slice(0, 3)
          .map((d) => ({ ...d, crop: c.name, stage: c.stage }))
      );

      result.push({
        farm: { _id: farm._id, name: farm.name, location: farm.location },
        weather, forecast,
        iot: {
          deviceId: iot.deviceId, timestamp: iot.timestamp,
          soilMoisture: iot.soilMoisture, temperature: iot.temperature,
          humidity: iot.humidity, rainfall: iot.rainfall, ph: iot.ph,
        },
        hazards,
        risks: cropRisks,
        diseases,
        overallScore: cropRisks.length
          ? Math.round(cropRisks.reduce((s, r) => s + r.score, 0) / cropRisks.length)
          : 0,
      });
    }
    res.json({ farms: result, season: getSeason() });
  } catch (err) { next(err); }
};

exports.calendar = async (req, res, next) => {
  try {
    const { crop, stage } = req.query;
    if (crop && stage) {
      return res.json({ tasks: buildPreventiveCalendar({ crop, stage }) });
    }
    const farms = await Farm.find({ owner: req.user._id }).select('_id');
    const crops = await Crop.find({ farm: { $in: farms.map((f) => f._id) } });
    const all = crops.flatMap((c) =>
      buildPreventiveCalendar({ crop: c.name, stage: c.stage || 'vegetative' }).map((t) => ({
        ...t, farm: c.farm, cropId: c._id,
      }))
    ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    res.json({ tasks: all });
  } catch (err) { next(err); }
};

exports.scanAndAlert = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const onlyMe = !isAdmin;
    const userQuery = onlyMe ? { _id: req.user._id } : { active: true, emailVerified: true };
    const users = await User.find(userQuery).select('email name _id');

    let totalAlerts = 0; let totalEmails = 0;
    for (const u of users) {
      const farms = await Farm.find({ owner: u._id });
      if (!farms.length) continue;
      const hazards = [];
      for (const f of farms) {
        const w = await getCurrentWeather({
          region: f.location?.district || 'Kigali',
          lat: f.location?.lat, lng: f.location?.lng,
        });
        const iot = (await IoTData.findOne({ farm: f._id }).sort('-timestamp')) || {};
        const h = detectHazards({
          ...w,
          humidity: iot.humidity ?? w.humidity,
          temperature: iot.temperature ?? w.temperature,
          ph: iot.ph,
        });
        h.forEach((x) => hazards.push({ ...x, farm: f.name }));
      }
      const critical = hazards.filter((h) => h.severity === 'critical' || h.severity === 'warning');
      if (!critical.length) continue;

      const message = critical
        .map((h) => `• [${h.farm}] ${h.title}\n  Actions: ${h.actions.slice(0, 2).join('; ')}`)
        .join('\n');
      await Notification.create({
        user: u._id,
        title: 'Crop protection alert',
        message,
        channel: 'email',
        severity: critical.some((c) => c.severity === 'critical') ? 'critical' : 'warning',
      });
      totalAlerts += 1;

      if (u.email) {
        const r = await sendBulkEmail([u.email], {
          title: '🛡️ Crop protection alert',
          message: message.replace(/\n/g, '<br/>'),
          severity: critical.some((c) => c.severity === 'critical') ? 'critical' : 'warning',
        });
        totalEmails += r.sent || 0;
      }
    }
    res.json({ ok: true, scannedUsers: users.length, alerts: totalAlerts, emailsSent: totalEmails });
  } catch (err) { next(err); }
};

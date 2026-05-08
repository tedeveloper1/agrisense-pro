require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Device = require('../models/Device');
const IoTData = require('../models/IoTData');

(async () => {
  await connectDB();
  console.log('[seed] clearing existing demo data...');
  await Promise.all([
    User.deleteMany({ email: { $in: ['admin@demo.rw', 'farmer@demo.rw', 'expert@demo.rw'] } }),
  ]);

  const admin = await User.create({ name: 'Admin', email: 'admin@demo.rw', password: 'password123', role: 'admin', language: 'en', emailVerified: true });
  const farmer = await User.create({ name: 'Jean Farmer', email: 'farmer@demo.rw', password: 'password123', role: 'farmer', language: 'rw', region: 'Musanze', phone: '+250788000001', emailVerified: true });
  const expert = await User.create({ name: 'Aline Expert', email: 'expert@demo.rw', password: 'password123', role: 'expert', language: 'fr', region: 'Kigali', emailVerified: true });

  const farm = await Farm.create({
    owner: farmer._id, name: 'Demo Maize Farm',
    location: { district: 'Musanze', sector: 'Kinigi', lat: -1.5, lng: 29.6 },
    sizeHa: 1.5, soilType: 'loam',
  });

  await Crop.create({ farm: farm._id, name: 'maize', variety: 'H629', stage: 'vegetative', areaHa: 1.0, plantingDate: new Date(Date.now() - 30 * 86400000) });
  await Crop.create({ farm: farm._id, name: 'tomato', variety: 'Roma', stage: 'flowering', areaHa: 0.5 });

  await Device.create({ deviceId: 'demo-node-001', farm: farm._id, label: 'Field A node', status: 'active', lastSeenAt: new Date() });
  await IoTData.create({
    deviceId: 'demo-node-001', farm: farm._id,
    soilMoisture: 22, temperature: 29, humidity: 78, rainfall: 0, lightIntensity: 18000, ph: 6.2,
  });

  console.log('[seed] done. Logins:');
  console.log('  admin@demo.rw / password123');
  console.log('  farmer@demo.rw / password123');
  console.log('  expert@demo.rw / password123');

  await mongoose.disconnect();
  process.exit(0);
})();

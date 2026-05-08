/**
 * USSD Controller — Africa's Talking compatible.
 * Body: { sessionId, serviceCode, phoneNumber, text }
 * Response: plain text starting with "CON " (continue) or "END " (terminate).
 *
 * The full menu state lives in `text` (Africa's Talking convention) — a
 * "*"-separated string of every input the user has entered so far. We
 * also persist a USSDSession record so the admin console can replay it.
 */
const USSDSession = require('../models/USSDSession');
const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const IoTData = require('../models/IoTData');
const Recommendation = require('../models/Recommendation');
const { getCurrentWeather, getForecast } = require('../services/weatherService');
const { detectHazards, predictLikelyDiseases } = require('../services/protectionService');

const T = {
  en: {
    welcome: 'Rwanda Beyond\n1. Weather\n2. Recommendations\n3. Crop protection\n4. Disease forecast\n5. Soil pH\n6. Register phone\n7. Language',
    chooseLang: 'Choose language\n1. English\n2. Kinyarwanda\n3. Francais',
    chooseCrop: 'Choose crop\n1. Maize\n2. Tomato\n3. Beans\n4. Potato',
    invalid: 'Invalid choice. Please try again.',
    weatherIntro: 'Today',
    forecastIntro: 'Next 3 days',
    noRecs: 'No recommendations yet. Visit the app.',
    noFarm: 'No farm linked. Register on the app first.',
    bye: 'Murakoze. Goodbye.',
    askPhoneCode: 'Reply with your account email to link this phone.',
    linked: 'Phone linked successfully!',
    linkFail: 'Email not found. Sign up on the app first.',
    protectOk: 'No active hazards. Conditions are favourable.',
    phNoSensor: 'No pH sensor reading yet.',
  },
  rw: {
    welcome: 'Rwanda Beyond\n1. Iteganyagihe\n2. Inama\n3. Kurinda imyaka\n4. Iteganya indwara\n5. pH y\'ubutaka\n6. Iyandikishe\n7. Ururimi',
    chooseLang: 'Hitamo ururimi\n1. Icyongereza\n2. Ikinyarwanda\n3. Igifaransa',
    chooseCrop: 'Hitamo igihingwa\n1. Ibigori\n2. Inyanya\n3. Ibishyimbo\n4. Ibirayi',
    invalid: 'Hitamo nabi. Ongera ugerageze.',
    weatherIntro: 'Uyu munsi',
    forecastIntro: 'Iminsi 3 itaha',
    noRecs: 'Nta nama irahari. Sura porogaramu.',
    noFarm: 'Nta murima ufitanye. Iyandikishe kuri porogaramu.',
    bye: 'Murakoze.',
    askPhoneCode: 'Subiza imeli yawe kugirango duhuze iyi telefoni.',
    linked: 'Telefoni yawe yahujwe!',
    linkFail: 'Imeli ntibonetse. Iyandikishe ku rubuga banza.',
    protectOk: 'Nta byago bihari. Ibihe biri byiza.',
    phNoSensor: 'Nta gipimo cya pH kibonetse.',
  },
  fr: {
    welcome: 'Rwanda Beyond\n1. Meteo\n2. Recommandations\n3. Protection cultures\n4. Maladies probables\n5. pH du sol\n6. Enregistrer telephone\n7. Langue',
    chooseLang: 'Choisir la langue\n1. Anglais\n2. Kinyarwanda\n3. Francais',
    chooseCrop: 'Choisir culture\n1. Mais\n2. Tomate\n3. Haricot\n4. Pomme de terre',
    invalid: 'Choix invalide. Reessayez.',
    weatherIntro: "Aujourd'hui",
    forecastIntro: '3 prochains jours',
    noRecs: 'Aucune recommandation. Visitez l\'application.',
    noFarm: 'Aucune ferme liee. Inscrivez-vous sur l\'application.',
    bye: 'Merci.',
    askPhoneCode: 'Repondez avec votre email pour lier ce telephone.',
    linked: 'Telephone lie avec succes !',
    linkFail: 'Email introuvable. Inscrivez-vous d\'abord.',
    protectOk: 'Aucun danger actif. Conditions favorables.',
    phNoSensor: 'Aucune lecture de pH disponible.',
  },
};

const CROP_MAP = { '1': 'maize', '2': 'tomato', '3': 'beans', '4': 'potato' };
const LANG_MAP = { '1': 'en', '2': 'rw', '3': 'fr' };

async function getUserContext(phoneNumber) {
  const user = await User.findOne({ phone: phoneNumber });
  if (!user) return { user: null, farm: null };
  const farm = await Farm.findOne({ owner: user._id });
  return { user, farm };
}

exports.handle = async (req, res, next) => {
  try {
    const { sessionId, phoneNumber, text = '' } = req.body || {};
    if (!sessionId || !phoneNumber) {
      return res.status(400).send('END Missing session information');
    }

    let session = await USSDSession.findOne({ sessionId });
    if (!session) {
      session = await USSDSession.create({ sessionId, phoneNumber, language: 'en' });
    }

    // If user already exists, prefer their saved language
    const existingUser = await User.findOne({ phone: phoneNumber });
    if (existingUser?.language && !session.lastInput) {
      session.language = existingUser.language;
    }

    const inputs = text.split('*').filter((s) => s !== '');
    const reply = await route(session, inputs, phoneNumber);

    session.lastInput = inputs[inputs.length - 1] || '';
    session.state = inputs.join('*');
    await session.save();

    res.set('Content-Type', 'text/plain');
    return res.send(reply);
  } catch (err) {
    console.error('[ussd] error', err);
    return res.send('END Service temporarily unavailable.');
  }
};

async function route(session, inputs, phoneNumber) {
  const dict = T[session.language] || T.en;

  // Top menu
  if (inputs.length === 0) return `CON ${dict.welcome}`;

  const top = inputs[0];

  // 1. Weather
  if (top === '1') {
    const ctx = await getUserContext(phoneNumber);
    const region = ctx.farm?.location?.district || 'Kigali';
    if (inputs.length === 1) {
      const w = await getCurrentWeather({ region });
      return `CON ${dict.weatherIntro}: ${w.condition}, ${w.temperature}C, hum ${w.humidity}%, rain ${w.rainfall}mm\n1. ${dict.forecastIntro}\n0. Back`;
    }
    if (inputs[1] === '1') {
      const f = await getForecast({ region, days: 3 });
      const lines = f.map((d, i) => `${i + 1}. ${new Date(d.date).toLocaleDateString('en', { weekday: 'short' })}: ${d.tempMin}-${d.tempMax}C, ${d.rainfall}mm`).join('\n');
      return `END ${dict.forecastIntro}\n${lines}`;
    }
    return `END ${dict.invalid}`;
  }

  // 2. Recommendations
  if (top === '2') {
    const ctx = await getUserContext(phoneNumber);
    if (!ctx.user) return `END ${dict.noFarm}`;
    const recs = await Recommendation.find({ user: ctx.user._id }).sort('-createdAt').limit(3);
    if (!recs.length) return `END ${dict.noRecs}`;
    return `END ${recs.map((r, i) => `${i + 1}. ${r.title}`).join('\n')}`;
  }

  // 3. Crop protection — show hazards
  if (top === '3') {
    const ctx = await getUserContext(phoneNumber);
    if (!ctx.farm) return `END ${dict.noFarm}`;
    const w = await getCurrentWeather({ region: ctx.farm.location?.district || 'Kigali' });
    const iot = (await IoTData.findOne({ farm: ctx.farm._id }).sort('-timestamp')) || {};
    const hazards = detectHazards({ ...w, humidity: iot.humidity ?? w.humidity, temperature: iot.temperature ?? w.temperature, ph: iot.ph });
    if (!hazards.length) return `END ${dict.protectOk}`;
    const lines = hazards.slice(0, 3).map((h, i) => `${i + 1}. ${h.title} (${h.severity})`).join('\n');
    return `END ${lines}`;
  }

  // 4. Disease forecast — pick crop, predict
  if (top === '4') {
    if (inputs.length === 1) return `CON ${dict.chooseCrop}`;
    const crop = CROP_MAP[inputs[1]];
    if (!crop) return `END ${dict.invalid}`;
    const ctx = await getUserContext(phoneNumber);
    const region = ctx.farm?.location?.district || 'Kigali';
    const w = await getCurrentWeather({ region });
    const iot = ctx.farm ? (await IoTData.findOne({ farm: ctx.farm._id }).sort('-timestamp')) || {} : {};
    const list = predictLikelyDiseases({ crop, stage: 'vegetative', weather: w, iot }).slice(0, 3);
    if (!list.length) return `END No disease forecast for ${crop}.`;
    const lines = list.map((d, i) => `${i + 1}. ${d.name} (${Math.round(d.probability * 100)}%)`).join('\n');
    return `END ${lines}`;
  }

  // 5. Soil pH reading
  if (top === '5') {
    const ctx = await getUserContext(phoneNumber);
    if (!ctx.farm) return `END ${dict.noFarm}`;
    const iot = await IoTData.findOne({ farm: ctx.farm._id }).sort('-timestamp');
    if (!iot || iot.ph == null) return `END ${dict.phNoSensor}`;
    const ph = iot.ph;
    const status = ph < 5.5 ? 'acidic — apply lime' : ph > 7.8 ? 'alkaline — apply sulfur' : 'optimal';
    return `END Soil pH: ${ph}\nStatus: ${status}`;
  }

  // 6. Register/link phone
  if (top === '6') {
    if (inputs.length === 1) return `CON ${dict.askPhoneCode}`;
    const email = inputs[1].toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return `END ${dict.linkFail}`;
    user.phone = phoneNumber;
    await user.save();
    session.language = user.language || session.language;
    return `END ${dict.linked}`;
  }

  // 7. Language change
  if (top === '7') {
    if (inputs.length === 1) return `CON ${dict.chooseLang}`;
    const newLang = LANG_MAP[inputs[1]];
    if (!newLang) return `END ${dict.invalid}`;
    session.language = newLang;
    // Persist on user too
    if (existingUserCache.has(phoneNumber)) { /* noop */ }
    const user = await User.findOne({ phone: phoneNumber });
    if (user) { user.language = newLang; await user.save(); }
    return `END ${T[newLang].bye}`;
  }

  return `END ${dict.invalid}`;
}

// Tiny in-memory cache placeholder so the file lints; not actually used.
const existingUserCache = new Map();

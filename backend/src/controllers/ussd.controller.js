/**
 * USSD Controller — compatible with Africa's Talking-style payloads.
 * Body: { sessionId, serviceCode, phoneNumber, text }
 * Response: plain text starting with "CON " (continue) or "END " (terminate).
 */
const USSDSession = require('../models/USSDSession');
const User = require('../models/User');
const Recommendation = require('../models/Recommendation');
const { getCurrentWeather } = require('../services/weatherService');

const t = {
  en: {
    welcome: 'Welcome to Smart Farming\n1. Weather\n2. Recommendations\n3. Change language',
    chooseLang: '1. English\n2. Kinyarwanda\n3. Francais',
    invalid: 'Invalid choice',
    weatherIntro: 'Today: ',
    noRecs: 'No recommendations yet.',
    bye: 'Murakoze. Goodbye.',
  },
  rw: {
    welcome: 'Murakaza neza kuri Smart Farming\n1. Iteganyagihe\n2. Inama\n3. Hindura ururimi',
    chooseLang: '1. Icyongereza\n2. Ikinyarwanda\n3. Igifaransa',
    invalid: 'Hitamo nabi',
    weatherIntro: 'Uyu munsi: ',
    noRecs: 'Nta nama irahari.',
    bye: 'Murakoze.',
  },
  fr: {
    welcome: 'Bienvenue sur Smart Farming\n1. Meteo\n2. Recommandations\n3. Changer la langue',
    chooseLang: '1. Anglais\n2. Kinyarwanda\n3. Francais',
    invalid: 'Choix invalide',
    weatherIntro: "Aujourd'hui : ",
    noRecs: 'Aucune recommandation.',
    bye: 'Merci.',
  },
};

exports.handle = async (req, res, next) => {
  try {
    const { sessionId, phoneNumber, text = '' } = req.body;
    if (!sessionId || !phoneNumber) {
      return res.status(400).send('END Missing session information');
    }

    let session = await USSDSession.findOne({ sessionId });
    if (!session) {
      session = await USSDSession.create({ sessionId, phoneNumber, language: 'en' });
    }
    const lang = session.language || 'en';
    const dict = t[lang] || t.en;

    const inputs = text.split('*').filter(Boolean);
    const last = inputs[inputs.length - 1];

    // Top menu
    if (inputs.length === 0) {
      return res.send(`CON ${dict.welcome}`);
    }

    // Language change flow
    if (inputs[0] === '3') {
      if (inputs.length === 1) return res.send(`CON ${dict.chooseLang}`);
      const map = { '1': 'en', '2': 'rw', '3': 'fr' };
      const newLang = map[last];
      if (!newLang) return res.send(`END ${dict.invalid}`);
      session.language = newLang;
      await session.save();
      return res.send(`END ${t[newLang].bye}`);
    }

    // Weather
    if (inputs[0] === '1') {
      const w = await getCurrentWeather({ region: 'Kigali' });
      return res.send(
        `END ${dict.weatherIntro}${w.condition}, ${w.temperature}C, humidity ${w.humidity}%`
      );
    }

    // Recommendations
    if (inputs[0] === '2') {
      const user = await User.findOne({ phone: phoneNumber });
      if (!user) return res.send(`END ${dict.noRecs}`);
      const recs = await Recommendation.find({ user: user._id }).sort('-createdAt').limit(3);
      if (!recs.length) return res.send(`END ${dict.noRecs}`);
      const lines = recs.map((r, i) => `${i + 1}. ${r.title}`).join('\n');
      return res.send(`END ${lines}`);
    }

    return res.send(`END ${dict.invalid}`);
  } catch (err) { next(err); }
};

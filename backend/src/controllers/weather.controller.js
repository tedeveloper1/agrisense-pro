const { getCurrentWeather, getForecast } = require('../services/weatherService');

exports.current = async (req, res, next) => {
  try {
    const { region } = req.query;
    const data = await getCurrentWeather({ region: region || req.user?.region });
    res.json({ weather: data });
  } catch (err) { next(err); }
};

exports.forecast = async (req, res, next) => {
  try {
    const { region, days } = req.query;
    const data = await getForecast({ region: region || req.user?.region, days: Number(days) || 5 });
    res.json({ forecast: data });
  } catch (err) { next(err); }
};

/**
 * Weather Service (mock-ready).
 * Swap `getCurrentWeather` with a real provider (e.g., OpenWeather) by reading
 * process.env.WEATHER_API_KEY. The current implementation returns deterministic
 * mock data so the system runs without external dependencies.
 */

async function getCurrentWeather({ region = 'Kigali', lat, lng } = {}) {
  // TODO: integrate real API. Keep return shape stable for the frontend.
  const seed = (region || 'Kigali').length;
  return {
    region,
    lat: lat ?? -1.9441,
    lng: lng ?? 30.0619,
    temperature: 22 + (seed % 5),
    humidity: 60 + (seed % 20),
    rainfall: (seed % 4) * 1.5,
    windSpeed: 3 + (seed % 3),
    condition: ['sunny', 'cloudy', 'partly_cloudy', 'light_rain'][seed % 4],
    forecastFor: new Date(),
    source: 'mock',
  };
}

async function getForecast({ region = 'Kigali', days = 5 } = {}) {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() + i * 86400000),
    temperature: 20 + ((i + region.length) % 7),
    rainfall: (i % 3) * 2,
    condition: ['sunny', 'cloudy', 'partly_cloudy', 'light_rain'][i % 4],
  }));
}

module.exports = { getCurrentWeather, getForecast };

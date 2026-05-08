/**
 * Weather Service — Open-Meteo (no API key required).
 * Docs: https://open-meteo.com/en/docs
 *
 * Provides current conditions and a multi-day forecast for any Rwandan
 * district. Falls back to deterministic mock values only if the network
 * call fails, so the rest of the system keeps working offline.
 */

// Approximate centroid coordinates for Rwanda's 30 districts.
const RWANDA_DISTRICTS = {
  Kigali: [-1.9441, 30.0619],
  Nyarugenge: [-1.9536, 30.0606],
  Gasabo: [-1.9094, 30.1273],
  Kicukiro: [-1.9889, 30.1031],
  Musanze: [-1.4994, 29.6336],
  Rubavu: [-1.6911, 29.2569],
  Nyabihu: [-1.6533, 29.5128],
  Burera: [-1.4828, 29.8714],
  Gakenke: [-1.6889, 29.7778],
  Gicumbi: [-1.5778, 30.1031],
  Rulindo: [-1.7669, 29.9914],
  Huye: [-2.5961, 29.7392],
  Nyamagabe: [-2.4067, 29.5211],
  Nyaruguru: [-2.6914, 29.5544],
  Gisagara: [-2.6014, 29.8211],
  Muhanga: [-2.0853, 29.7558],
  Ruhango: [-2.2200, 29.7750],
  Kamonyi: [-2.0153, 29.9061],
  Nyanza: [-2.3503, 29.7503],
  Karongi: [-2.0775, 29.3994],
  Rutsiro: [-1.9533, 29.3447],
  Rusizi: [-2.4847, 28.9075],
  Nyamasheke: [-2.3486, 29.1397],
  Ngororero: [-1.8736, 29.5269],
  Bugesera: [-2.2386, 30.1956],
  Rwamagana: [-1.9489, 30.4347],
  Kayonza: [-1.8814, 30.6172],
  Gatsibo: [-1.5808, 30.4253],
  Kirehe: [-2.2117, 30.7058],
  Ngoma: [-2.1572, 30.4639],
  Nyagatare: [-1.2978, 30.3289],
};

function pickCoords({ region, lat, lng }) {
  if (typeof lat === 'number' && typeof lng === 'number') return { lat, lng };
  const key = Object.keys(RWANDA_DISTRICTS).find(
    (k) => k.toLowerCase() === String(region || '').toLowerCase()
  );
  return key
    ? { lat: RWANDA_DISTRICTS[key][0], lng: RWANDA_DISTRICTS[key][1] }
    : { lat: -1.9441, lng: 30.0619 }; // Kigali default
}

function codeToCondition(code) {
  // WMO weather interpretation codes
  if (code == null) return 'unknown';
  if (code === 0) return 'sunny';
  if ([1, 2].includes(code)) return 'partly_cloudy';
  if (code === 3) return 'cloudy';
  if ([45, 48].includes(code)) return 'fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle';
  if ([61, 63, 80, 81].includes(code)) return 'light_rain';
  if ([65, 82].includes(code)) return 'heavy_rain';
  if ([66, 67].includes(code)) return 'freezing_rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'thunderstorm';
  return 'cloudy';
}

// Rwanda has two rainy + two dry seasons. Used for protection risk context.
function getSeason(date = new Date()) {
  const m = date.getMonth() + 1; // 1-12
  if (m >= 3 && m <= 5) return 'long_rains';      // Itumba (heavy rain)
  if (m >= 6 && m <= 8) return 'long_dry';        // Icyi (dry)
  if (m >= 9 && m <= 11) return 'short_rains';    // Umuhindo (short rains)
  return 'short_dry';                              // Urugaryi (Dec–Feb)
}

function mockFallback(region) {
  const seed = (region || 'Kigali').length;
  return {
    region, source: 'mock-fallback',
    temperature: 22 + (seed % 5),
    humidity: 60 + (seed % 20),
    rainfall: (seed % 4) * 1.5,
    windSpeed: 3 + (seed % 3),
    condition: 'partly_cloudy',
    forecastFor: new Date(),
    season: getSeason(),
  };
}

async function getCurrentWeather({ region = 'Kigali', lat, lng } = {}) {
  const c = pickCoords({ region, lat, lng });
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lng}` +
      '&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m' +
      '&timezone=Africa%2FKigali';
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`open-meteo ${res.status}`);
    const json = await res.json();
    const cur = json.current || {};
    return {
      region,
      lat: c.lat, lng: c.lng,
      temperature: Math.round(cur.temperature_2m ?? 0),
      humidity: Math.round(cur.relative_humidity_2m ?? 0),
      rainfall: Number(cur.precipitation ?? 0),
      windSpeed: Number(cur.wind_speed_10m ?? 0),
      condition: codeToCondition(cur.weather_code),
      weatherCode: cur.weather_code,
      forecastFor: cur.time ? new Date(cur.time) : new Date(),
      season: getSeason(),
      source: 'open-meteo',
    };
  } catch (err) {
    console.warn('[weatherService] open-meteo failed, using fallback:', err.message);
    return mockFallback(region);
  }
}

async function getForecast({ region = 'Kigali', lat, lng, days = 5 } = {}) {
  const c = pickCoords({ region, lat, lng });
  const d = Math.min(Math.max(Number(days) || 5, 1), 16);
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lng}` +
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code' +
      `&forecast_days=${d}&timezone=Africa%2FKigali`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`open-meteo ${res.status}`);
    const json = await res.json();
    const daily = json.daily || {};
    const dates = daily.time || [];
    return dates.map((iso, i) => ({
      date: new Date(iso),
      temperature: Math.round(((daily.temperature_2m_max?.[i] ?? 0) + (daily.temperature_2m_min?.[i] ?? 0)) / 2),
      tempMax: Math.round(daily.temperature_2m_max?.[i] ?? 0),
      tempMin: Math.round(daily.temperature_2m_min?.[i] ?? 0),
      rainfall: Number(daily.precipitation_sum?.[i] ?? 0),
      condition: codeToCondition(daily.weather_code?.[i]),
    }));
  } catch (err) {
    console.warn('[weatherService] forecast failed, using fallback:', err.message);
    return Array.from({ length: d }, (_, i) => ({
      date: new Date(Date.now() + i * 86400000),
      temperature: 22 + ((i + (region || '').length) % 6),
      rainfall: (i % 3) * 2,
      condition: 'partly_cloudy',
    }));
  }
}

module.exports = { getCurrentWeather, getForecast, getSeason, RWANDA_DISTRICTS };

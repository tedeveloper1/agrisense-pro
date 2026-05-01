/**
 * Pest Prediction Service.
 * Calls the Flask AI service (AI_SERVICE_URL) when available,
 * otherwise returns a deterministic rule-based fallback.
 */

async function predictPest({ crop, temperature, humidity, rainfall }) {
  const url = process.env.AI_SERVICE_URL;
  if (url) {
    try {
      const res = await fetch(`${url}/predict/pest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, temperature, humidity, rainfall }),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('[pestPrediction] AI service unavailable, using fallback:', err.message);
    }
  }

  // Fallback heuristic
  const risk =
    (humidity > 75 ? 0.4 : 0.1) +
    (temperature > 26 ? 0.3 : 0.1) +
    (rainfall > 5 ? 0.2 : 0.05);

  let label = 'low_risk';
  if (risk > 0.6) label = 'fall_armyworm';
  else if (risk > 0.4) label = 'aphids';

  return {
    crop: crop || 'maize',
    label,
    confidence: Math.min(1, Number(risk.toFixed(2))),
    source: 'fallback-rule',
  };
}

module.exports = { predictPest };

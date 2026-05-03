/**
 * Disease Prediction Service.
 * Calls Flask AI service when available, otherwise uses a deterministic
 * symptom-based knowledge base. Easy to swap with a trained model.
 */

const DISEASE_KB = {
  maize: [
    { id: 'maize_streak', label: 'Maize Streak Virus', match: ['yellow_leaves', 'stunted_growth'],
      description: 'Viral disease transmitted by leafhoppers; causes pale streaks along leaf veins.',
      treatment: ['Remove and burn infected plants', 'Control leafhopper vectors with neem extract',
                  'Plant resistant varieties such as ZM607 next season'] },
    { id: 'maize_rust', label: 'Common Rust', match: ['brown_spots', 'powdery_white'],
      description: 'Fungal infection (Puccinia sorghi) producing reddish-brown pustules on leaves.',
      treatment: ['Apply mancozeb or propiconazole fungicide', 'Improve field ventilation',
                  'Rotate with non-cereal crops'] },
    { id: 'fall_armyworm', label: 'Fall Armyworm', match: ['holes_in_leaves'],
      description: 'Larvae of Spodoptera frugiperda feed on whorls causing ragged holes.',
      treatment: ['Scout fields weekly at dawn', 'Apply emamectin benzoate or spinosad',
                  'Use pheromone traps to monitor moth flights'] },
    { id: 'maize_blight', label: 'Northern Leaf Blight', match: ['brown_spots', 'wilting'],
      description: 'Cigar-shaped grey-green lesions caused by Exserohilum turcicum.',
      treatment: ['Apply foliar fungicide (azoxystrobin)', 'Use certified resistant hybrids',
                  'Practice 2-year crop rotation'] },
  ],
  tomato: [
    { id: 'late_blight', label: 'Late Blight', match: ['brown_spots', 'wilting', 'rotting_stem'],
      description: 'Phytophthora infestans — spreads rapidly in cool, wet weather.',
      treatment: ['Spray copper-based fungicide every 7 days', 'Remove infected plants immediately',
                  'Avoid overhead irrigation'] },
    { id: 'powdery_mildew', label: 'Powdery Mildew', match: ['powdery_white', 'yellow_leaves'],
      description: 'White powdery fungal growth on leaf surfaces.',
      treatment: ['Spray sulfur or potassium bicarbonate', 'Improve air circulation',
                  'Avoid excessive nitrogen fertilization'] },
    { id: 'tomato_curl', label: 'Tomato Leaf Curl Virus', match: ['leaf_curl', 'stunted_growth'],
      description: 'Whitefly-transmitted geminivirus causing upward leaf curling.',
      treatment: ['Control whiteflies with yellow sticky traps + neem',
                  'Use TYLCV-resistant varieties', 'Remove infected plants'] },
  ],
  potato: [
    { id: 'potato_late_blight', label: 'Late Blight', match: ['brown_spots', 'rotting_stem', 'wilting'],
      description: 'Phytophthora infestans, the same pathogen behind the Irish potato famine.',
      treatment: ['Apply mancozeb preventatively', 'Destroy volunteer potato plants',
                  'Harvest in dry weather'] },
  ],
  cabbage: [
    { id: 'cabbage_worm', label: 'Diamondback Moth', match: ['holes_in_leaves'],
      description: 'Plutella xylostella larvae chew small irregular holes in leaves.',
      treatment: ['Apply Bacillus thuringiensis (Bt)', 'Intercrop with mustard as trap crop',
                  'Release Trichogramma parasitoids'] },
  ],
  beans: [
    { id: 'bean_rust', label: 'Bean Rust', match: ['brown_spots', 'powdery_white'],
      description: 'Uromyces appendiculatus producing reddish-brown pustules.',
      treatment: ['Spray chlorothalonil', 'Use resistant varieties (RWR series)',
                  'Avoid working in wet fields'] },
  ],
  onion: [
    { id: 'onion_blight', label: 'Purple Blotch', match: ['brown_spots', 'yellow_leaves'],
      description: 'Alternaria porri lesions starting as small water-soaked spots.',
      treatment: ['Spray mancozeb every 10 days', 'Avoid prolonged leaf wetness',
                  'Rotate with non-allium crops'] },
  ],
};

function ruleBasedPredict({ crop = 'maize', symptoms = [] }) {
  const list = DISEASE_KB[crop] || DISEASE_KB.maize;
  let best = null;
  let bestScore = 0;
  for (const d of list) {
    const overlap = d.match.filter((s) => symptoms.includes(s)).length;
    if (!overlap) continue;
    const score = overlap / d.match.length;
    if (score > bestScore) { bestScore = score; best = d; }
  }
  if (!best) {
    return {
      label: 'unknown',
      confidence: 0.2,
      severity: 'low',
      description: 'Symptoms could not be matched to a known disease. Consult an agronomist.',
      treatment: ['Send a clear photo to an expert via the Advisories module',
                  'Isolate affected plants to prevent spread'],
      source: 'fallback-rule',
    };
  }
  const confidence = Math.min(0.95, 0.45 + bestScore * 0.5);
  const severity = confidence > 0.8 ? 'high' : confidence > 0.55 ? 'medium' : 'low';
  return {
    label: best.id,
    name: best.label,
    confidence: Number(confidence.toFixed(2)),
    severity,
    description: best.description,
    treatment: best.treatment,
    source: 'fallback-rule',
  };
}

async function predictDisease({ crop, symptoms, imageUrl, notes }) {
  const url = process.env.AI_SERVICE_URL;
  if (url) {
    try {
      const res = await fetch(`${url}/predict/disease`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, symptoms, imageUrl, notes }),
      });
      if (res.ok) {
        const data = await res.json();
        return { ...data, source: data.source || 'flask-ai' };
      }
    } catch (err) {
      console.warn('[diseasePrediction] AI service unavailable, using fallback:', err.message);
    }
  }
  return ruleBasedPredict({ crop, symptoms });
}

module.exports = { predictDisease, ruleBasedPredict };

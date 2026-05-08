/**
 * Crop Protection Service — proactive (prevention-first) engine.
 * Combines weather forecast + crop stage + IoT readings to produce:
 *   1. A daily risk score per crop/farm (0–100) for disease, pest, drought, frost, flood.
 *   2. A preventive action calendar tied to the crop's growth stage.
 *   3. Weather-driven hazard alerts with concrete protective actions.
 *   4. Likely disease forecast based on Rwanda season + weather + crop.
 *
 * Pure functions — no DB or network access — easy to test and easy to
 * swap out for a trained ML model later.
 */

const HAZARD_RULES = [
  {
    id: 'frost',
    test: (w) => w.temperature != null && w.temperature <= 8,
    severity: (w) => (w.temperature <= 4 ? 'critical' : 'warning'),
    title: 'Frost risk tonight',
    actions: [
      'Cover sensitive crops (tomato, beans) with mulch or row covers',
      'Irrigate lightly in the late afternoon — moist soil retains heat',
      'Light small smudge fires upwind for high-value plots',
    ],
  },
  {
    id: 'heatwave',
    test: (w) => w.temperature != null && w.temperature >= 32,
    severity: (w) => (w.temperature >= 35 ? 'critical' : 'warning'),
    title: 'Heat stress expected',
    actions: [
      'Irrigate early morning to cool the root zone',
      'Apply mulch to reduce soil evaporation',
      'Shade seedlings with grass or shade cloth',
    ],
  },
  {
    id: 'heavy_rain',
    test: (w) => w.rainfall != null && w.rainfall >= 15,
    severity: (w) => (w.rainfall >= 30 ? 'critical' : 'warning'),
    title: 'Heavy rainfall — flood & disease risk',
    actions: [
      'Open drainage channels around plots',
      'Delay nitrogen fertilizer (will leach)',
      'After rain, scout for blight and apply preventive copper fungicide',
    ],
  },
  {
    id: 'drought',
    test: (w) => w.rainfall != null && w.rainfall < 1 && w.humidity != null && w.humidity < 45,
    severity: () => 'warning',
    title: 'Dry spell — water stress likely',
    actions: [
      'Schedule irrigation for the next 3 days',
      'Mulch around stems to conserve moisture',
      'Skip fertilizer until soil moisture recovers',
    ],
  },
  {
    id: 'humid_disease_window',
    test: (w) => w.humidity != null && w.humidity >= 80 && w.temperature >= 18 && w.temperature <= 28,
    severity: () => 'warning',
    title: 'High disease-pressure window',
    actions: [
      'Apply preventive fungicide on tomato/potato (copper or mancozeb)',
      'Avoid overhead irrigation today',
      'Remove lower infected leaves; improve airflow',
    ],
  },
  {
    id: 'soil_acidic',
    test: (w) => w.ph != null && w.ph < 5.5,
    severity: (w) => (w.ph < 4.8 ? 'critical' : 'warning'),
    title: 'Soil too acidic',
    actions: [
      'Apply agricultural lime (2–4 t/ha) and till in lightly',
      'Avoid ammonium-based fertilizer until pH recovers',
      'Add compost or wood ash to buffer acidity',
    ],
  },
  {
    id: 'soil_alkaline',
    test: (w) => w.ph != null && w.ph > 7.8,
    severity: () => 'warning',
    title: 'Soil too alkaline',
    actions: [
      'Apply elemental sulfur or gypsum to lower pH',
      'Use ammonium sulfate as nitrogen source',
      'Add organic matter (compost, manure) to improve buffering',
    ],
  },
];

/** Detect active hazards from a weather snapshot/forecast point + IoT readings. */
function detectHazards(weather) {
  if (!weather) return [];
  return HAZARD_RULES
    .filter((r) => r.test(weather))
    .map((r) => ({
      id: r.id,
      title: r.title,
      severity: r.severity(weather),
      actions: r.actions,
    }));
}

/**
 * Compute a 0–100 protection risk score for a crop in current conditions.
 * Higher = more action needed. Breakdown is returned so the UI can explain it.
 */
function computeRiskScore({ crop, weather = {}, iot = {}, stage }) {
  const factors = [];
  let score = 0;

  const humidity = iot.humidity ?? weather.humidity ?? 0;
  const temperature = iot.temperature ?? weather.temperature ?? 0;
  const moisture = iot.soilMoisture;
  const ph = iot.ph;
  const rainfall = weather.rainfall ?? 0;

  if (humidity >= 75) {
    const v = Math.min(30, (humidity - 75) * 2 + 10);
    score += v; factors.push({ label: 'High humidity → disease pressure', value: Math.round(v) });
  }
  if (temperature >= 25 && humidity >= 60) {
    score += 15; factors.push({ label: 'Warm & humid → pest activity', value: 15 });
  }
  if (temperature <= 8) { score += 25; factors.push({ label: 'Cold stress / frost risk', value: 25 }); }
  if (temperature >= 32) { score += 20; factors.push({ label: 'Heat stress on crop', value: 20 }); }
  if (moisture != null && moisture < 30 && rainfall < 2) {
    score += 20; factors.push({ label: 'Soil moisture critically low', value: 20 });
  }
  if (rainfall >= 25) { score += 15; factors.push({ label: 'Heavy rainfall → root rot risk', value: 15 }); }
  if (ph != null && (ph < 5.5 || ph > 7.8)) {
    const v = ph < 5.0 || ph > 8.2 ? 20 : 12;
    score += v;
    factors.push({ label: `Soil pH out of range (${ph})`, value: v });
  }
  if (['flowering', 'germination'].includes(stage)) {
    score += 10; factors.push({ label: `Sensitive stage: ${stage}`, value: 10 });
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  return {
    crop: crop || 'crop',
    stage: stage || null,
    score,
    level,
    factors,
    summary:
      level === 'high' ? 'Take preventive action today to protect this crop.'
      : level === 'medium' ? 'Monitor closely and prepare protective measures.'
      : 'Conditions are favourable — keep routine scouting.',
  };
}

/**
 * Predict diseases that are likely to appear given crop + Rwanda season +
 * current weather + IoT. Returns probability-ranked list with prevention.
 */
const SEASON_DISEASES = {
  long_rains: { // Mar–May
    maize: [
      { id: 'maize_blight', name: 'Northern Leaf Blight', prob: 0.7,
        why: 'Cool wet weather of long rains favours Exserohilum turcicum.',
        prevent: ['Spray azoxystrobin preventively every 14 days', 'Ensure good drainage', 'Plant resistant hybrids'] },
      { id: 'maize_rust', name: 'Common Rust', prob: 0.55,
        why: 'High humidity + moderate temperatures during long rains.',
        prevent: ['Apply mancozeb before pustules appear', 'Avoid dense planting'] },
    ],
    tomato: [
      { id: 'late_blight', name: 'Late Blight', prob: 0.85,
        why: 'Phytophthora infestans thrives in cool wet weather of Itumba season.',
        prevent: ['Copper fungicide every 7 days', 'Stake plants to improve airflow', 'Drip irrigation only — no overhead'] },
    ],
    potato: [
      { id: 'potato_late_blight', name: 'Potato Late Blight', prob: 0.85,
        why: 'Long rains create perfect Phytophthora conditions in Musanze/Rubavu.',
        prevent: ['Apply mancozeb weekly', 'Hill soil around stems', 'Destroy volunteer plants'] },
    ],
    beans: [
      { id: 'bean_anthracnose', name: 'Bean Anthracnose', prob: 0.6,
        why: 'Wet foliage favours Colletotrichum lindemuthianum.',
        prevent: ['Use certified clean seed', 'Avoid working in wet fields', 'Spray chlorothalonil at flowering'] },
    ],
  },
  short_rains: { // Sep–Nov
    maize: [
      { id: 'fall_armyworm', name: 'Fall Armyworm', prob: 0.8,
        why: 'Warm short-rain conditions accelerate Spodoptera frugiperda life cycle.',
        prevent: ['Scout whorls weekly at dawn', 'Apply Bt or emamectin at first sign', 'Use pheromone traps'] },
    ],
    tomato: [
      { id: 'powdery_mildew', name: 'Powdery Mildew', prob: 0.5,
        why: 'Warm days + cool nights of Umuhindo favour mildew.',
        prevent: ['Spray sulfur or potassium bicarbonate', 'Avoid excess nitrogen'] },
    ],
    beans: [
      { id: 'bean_rust', name: 'Bean Rust', prob: 0.65,
        why: 'Short rains + warm temperatures favour Uromyces appendiculatus.',
        prevent: ['Spray chlorothalonil at first pustule', 'Use RWR resistant varieties'] },
    ],
  },
  long_dry: { // Jun–Aug
    maize: [
      { id: 'stalk_borer', name: 'Maize Stalk Borer', prob: 0.5,
        why: 'Dry season concentrates Busseola fusca larvae in surviving plants.',
        prevent: ['Destroy maize stubble after harvest', 'Apply Bt granules in whorl'] },
    ],
    tomato: [
      { id: 'spider_mites', name: 'Two-spotted Spider Mites', prob: 0.6,
        why: 'Hot dry weather favours Tetranychus urticae explosion.',
        prevent: ['Spray with water to reduce dust', 'Release predatory mites', 'Apply abamectin if thresholds exceeded'] },
    ],
  },
  short_dry: { // Dec–Feb
    maize: [
      { id: 'maize_streak', name: 'Maize Streak Virus', prob: 0.55,
        why: 'Leafhopper populations build during short dry season.',
        prevent: ['Plant resistant varieties (ZM607, H629)', 'Control grasses around fields'] },
    ],
    tomato: [
      { id: 'tomato_curl', name: 'Tomato Leaf Curl Virus', prob: 0.6,
        why: 'Whitefly populations peak in warm dry weather.',
        prevent: ['Yellow sticky traps + neem', 'Use TYLCV-resistant varieties', 'Remove infected plants'] },
    ],
  },
};

function predictLikelyDiseases({ crop = 'maize', stage, weather = {}, iot = {} } = {}) {
  const season = weather.season || 'long_rains';
  const list = (SEASON_DISEASES[season] && SEASON_DISEASES[season][crop]) || [];

  const humidity = iot.humidity ?? weather.humidity ?? 0;
  const temperature = iot.temperature ?? weather.temperature ?? 0;
  const rainfall = weather.rainfall ?? 0;

  return list
    .map((d) => {
      let p = d.prob;
      // Boost based on real-time conditions
      if (humidity >= 80) p += 0.1;
      if (rainfall >= 10) p += 0.08;
      if (d.id.includes('mites') && humidity < 50) p += 0.1;
      if (d.id.includes('blight') && humidity >= 75 && temperature >= 15 && temperature <= 25) p += 0.1;
      if (['flowering', 'germination'].includes(stage)) p += 0.05;
      p = Math.max(0, Math.min(0.99, p));
      return {
        ...d,
        probability: Number(p.toFixed(2)),
        severity: p >= 0.75 ? 'high' : p >= 0.5 ? 'medium' : 'low',
        season,
      };
    })
    .sort((a, b) => b.probability - a.probability);
}

const STAGE_PLAN = {
  maize: {
    germination: [
      { day: 1, category: 'scout', title: 'Inspect for cutworms & damping-off', detail: 'Check at dawn — destroy any cutworms found.' },
      { day: 3, category: 'protect', title: 'Apply seedling fungicide drench', detail: 'Use mancozeb at low rate to prevent damping-off.' },
      { day: 7, category: 'fertilize', title: 'Light starter NPK 17-17-17', detail: '50 kg/ha banded near the row.' },
    ],
    vegetative: [
      { day: 1, category: 'scout', title: 'Scout for fall armyworm whorl damage', detail: 'Check 30 plants in a W pattern.' },
      { day: 2, category: 'protect', title: 'Preventive Bt or neem spray', detail: 'Apply late afternoon for armyworm prevention.' },
      { day: 5, category: 'fertilize', title: 'Top-dress urea (50 kg/ha)', detail: 'Split application; avoid before heavy rain.' },
      { day: 10, category: 'irrigate', title: 'Deep irrigation if rainfall < 10mm', detail: 'Promote deep root development.' },
    ],
    flowering: [
      { day: 1, category: 'protect', title: 'Preventive fungicide (azoxystrobin)', detail: 'Critical to protect tassels from blight.' },
      { day: 3, category: 'irrigate', title: 'Maintain consistent moisture', detail: 'Stress now causes major yield loss.' },
      { day: 7, category: 'scout', title: 'Inspect for ear rot & stalk borer', detail: 'Remove infected ears immediately.' },
    ],
  },
  tomato: {
    germination: [
      { day: 2, category: 'protect', title: 'Apply copper fungicide drench', detail: 'Prevents damping-off in seedlings.' },
      { day: 5, category: 'scout', title: 'Check for whiteflies on undersides', detail: 'Yellow sticky traps recommended.' },
    ],
    vegetative: [
      { day: 1, category: 'protect', title: 'Preventive copper spray every 7d', detail: 'Stops late blight before it starts.' },
      { day: 3, category: 'prune', title: 'Remove lower 3 leaves', detail: 'Improves airflow, reduces blight.' },
      { day: 7, category: 'fertilize', title: 'NPK 15-5-30 (potassium-rich)', detail: 'Builds strong stems for fruit load.' },
    ],
    flowering: [
      { day: 1, category: 'protect', title: 'Calcium spray (prevent blossom-end rot)', detail: 'Foliar calcium nitrate.' },
      { day: 4, category: 'scout', title: 'Inspect flowers for thrips', detail: 'Tap flower over white paper to check.' },
    ],
  },
  default: [
    { day: 1, category: 'scout', title: 'Walk the field and inspect', detail: 'Look for new pests, disease, weeds.' },
    { day: 3, category: 'protect', title: 'Preventive organic spray', detail: 'Neem extract is broad-spectrum.' },
    { day: 7, category: 'irrigate', title: 'Check soil moisture', detail: 'Adjust irrigation based on weather.' },
  ],
};

function buildPreventiveCalendar({ crop = 'maize', stage = 'vegetative', startDate = new Date() } = {}) {
  const cropKey = STAGE_PLAN[crop] ? crop : null;
  const tasks = (cropKey && STAGE_PLAN[cropKey][stage]) || STAGE_PLAN.default;
  const start = new Date(startDate);
  return tasks.map((t, i) => {
    const due = new Date(start);
    due.setDate(due.getDate() + t.day);
    return { id: `${crop}-${stage}-${i}`, ...t, dueDate: due, crop, stage };
  });
}

module.exports = {
  detectHazards,
  computeRiskScore,
  buildPreventiveCalendar,
  predictLikelyDiseases,
  HAZARD_RULES,
  STAGE_PLAN,
  SEASON_DISEASES,
};

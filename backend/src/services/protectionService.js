/**
 * Crop Protection Service — proactive (prevention-first) engine.
 * Combines weather forecast + crop stage + IoT readings to produce:
 *   1. A daily risk score per crop/farm (0–100) for disease, pest, drought, frost, flood.
 *   2. A preventive action calendar tied to the crop's growth stage.
 *   3. Weather-driven hazard alerts with concrete protective actions.
 *
 * Pure functions — no DB or network access — so they stay easy to test
 * and easy to swap out for a trained ML model later.
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
];

/** Detect active hazards from a weather snapshot/forecast point. */
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
  const rainfall = weather.rainfall ?? 0;

  // Disease pressure
  if (humidity >= 75) {
    const v = Math.min(30, (humidity - 75) * 2 + 10);
    score += v; factors.push({ label: 'High humidity → disease pressure', value: Math.round(v) });
  }
  // Pest favourability
  if (temperature >= 25 && humidity >= 60) {
    score += 15; factors.push({ label: 'Warm & humid → pest activity', value: 15 });
  }
  // Frost
  if (temperature <= 8) {
    score += 25; factors.push({ label: 'Cold stress / frost risk', value: 25 });
  }
  // Heat
  if (temperature >= 32) {
    score += 20; factors.push({ label: 'Heat stress on crop', value: 20 });
  }
  // Drought (low moisture, low rain)
  if (moisture != null && moisture < 30 && rainfall < 2) {
    score += 20; factors.push({ label: 'Soil moisture critically low', value: 20 });
  }
  // Flood
  if (rainfall >= 25) {
    score += 15; factors.push({ label: 'Heavy rainfall → root rot risk', value: 15 });
  }
  // Sensitive growth stages
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
      level === 'high'
        ? 'Take preventive action today to protect this crop.'
        : level === 'medium'
        ? 'Monitor closely and prepare protective measures.'
        : 'Conditions are favourable — keep routine scouting.',
  };
}

/**
 * Generate a stage-aware preventive calendar (next ~14 days) for a crop.
 * Returns ordered tasks with category + due-date offset.
 */
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
  HAZARD_RULES,
  STAGE_PLAN,
};

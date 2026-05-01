/**
 * Recommendation Engine — generates irrigation, fertilization, and pest
 * recommendations from latest IoT readings + crop stage + weather.
 * Pure functions, easy to test.
 */

function irrigationRecommendation({ soilMoisture, rainfall, temperature, cropStage }) {
  if (soilMoisture == null) return null;
  if (rainfall > 5) {
    return { severity: 'info', title: 'Skip irrigation', message: 'Recent rainfall is sufficient.' };
  }
  if (soilMoisture < 25) {
    return {
      severity: 'high',
      title: 'Irrigate now',
      message: `Soil moisture is critically low (${soilMoisture}%). Apply 15–20 mm of water.`,
    };
  }
  if (soilMoisture < 40 && temperature > 28) {
    return {
      severity: 'medium',
      title: 'Irrigate today',
      message: `Soil moisture (${soilMoisture}%) and high temperature (${temperature}°C) suggest watering.`,
    };
  }
  if (cropStage === 'flowering' && soilMoisture < 50) {
    return {
      severity: 'medium',
      title: 'Maintain moisture for flowering',
      message: 'Flowering stage requires consistent moisture — light irrigation recommended.',
    };
  }
  return null;
}

function fertilizationRecommendation({ cropStage, crop }) {
  if (!cropStage) return null;
  if (cropStage === 'vegetative') {
    return {
      severity: 'medium',
      title: 'Apply nitrogen-rich fertilizer',
      message: `${crop || 'Crop'} is in vegetative stage — apply urea (50 kg/ha) split over 2 weeks.`,
    };
  }
  if (cropStage === 'flowering') {
    return {
      severity: 'medium',
      title: 'Apply phosphorus & potassium',
      message: 'Flowering benefits from NPK 17-17-17 (100 kg/ha).',
    };
  }
  return null;
}

function pestRecommendation(prediction) {
  if (!prediction || prediction.label === 'low_risk') return null;
  return {
    severity: prediction.confidence > 0.6 ? 'high' : 'medium',
    title: `Pest risk: ${prediction.label}`,
    message: `Detected risk for ${prediction.label} (confidence ${(prediction.confidence * 100).toFixed(0)}%). Inspect crops and consider integrated pest management.`,
  };
}

module.exports = {
  irrigationRecommendation,
  fertilizationRecommendation,
  pestRecommendation,
};

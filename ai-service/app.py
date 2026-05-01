"""
Smart Farming AI Service (Flask boilerplate).

Endpoints:
  GET  /health
  POST /predict/pest         { crop, temperature, humidity, rainfall }
  POST /predict/recommend    { soilMoisture, temperature, rainfall, cropStage }

This is a deterministic rule-based boilerplate. Replace `predict_pest_label`
and `recommend_action` with trained ML models (scikit-learn, TensorFlow, etc.)
without changing the HTTP contract.
"""
from flask import Flask, request, jsonify

app = Flask(__name__)


def predict_pest_label(crop: str, temperature: float, humidity: float, rainfall: float):
    risk = 0.0
    if humidity > 75: risk += 0.4
    elif humidity > 60: risk += 0.2
    if temperature > 26: risk += 0.3
    if rainfall > 5: risk += 0.2
    label = "low_risk"
    if risk > 0.6: label = "fall_armyworm"
    elif risk > 0.4: label = "aphids"
    return label, round(min(risk, 1.0), 2)


def recommend_action(soil_moisture, temperature, rainfall, crop_stage):
    actions = []
    if soil_moisture is not None and soil_moisture < 25:
        actions.append({"type": "irrigation", "severity": "high",
                        "message": f"Soil moisture critically low ({soil_moisture}%)."})
    if crop_stage == "vegetative":
        actions.append({"type": "fertilization", "severity": "medium",
                        "message": "Apply nitrogen-rich fertilizer (urea 50 kg/ha)."})
    return actions


@app.get("/health")
def health():
    return jsonify(status="ok")


@app.post("/predict/pest")
def pest():
    data = request.get_json(silent=True) or {}
    label, conf = predict_pest_label(
        data.get("crop", "maize"),
        float(data.get("temperature", 25)),
        float(data.get("humidity", 60)),
        float(data.get("rainfall", 0)),
    )
    return jsonify(crop=data.get("crop", "maize"), label=label,
                   confidence=conf, source="flask-rule")


@app.post("/predict/recommend")
def recommend():
    data = request.get_json(silent=True) or {}
    actions = recommend_action(
        data.get("soilMoisture"),
        data.get("temperature"),
        data.get("rainfall"),
        data.get("cropStage"),
    )
    return jsonify(actions=actions)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

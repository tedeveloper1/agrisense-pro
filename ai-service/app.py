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


DISEASE_KB = {
    "maize": [
        {"id": "maize_streak", "name": "Maize Streak Virus",
         "match": ["yellow_leaves", "stunted_growth"],
         "description": "Viral disease transmitted by leafhoppers; pale streaks along veins.",
         "treatment": ["Remove and burn infected plants",
                       "Control leafhoppers with neem extract",
                       "Plant resistant varieties (e.g. ZM607)"]},
        {"id": "maize_rust", "name": "Common Rust",
         "match": ["brown_spots", "powdery_white"],
         "description": "Fungal infection (Puccinia sorghi) producing reddish-brown pustules.",
         "treatment": ["Apply mancozeb or propiconazole",
                       "Improve field ventilation",
                       "Rotate with non-cereal crops"]},
        {"id": "fall_armyworm", "name": "Fall Armyworm",
         "match": ["holes_in_leaves"],
         "description": "Spodoptera frugiperda larvae feed on whorls causing ragged holes.",
         "treatment": ["Scout fields weekly at dawn",
                       "Apply emamectin benzoate or spinosad",
                       "Use pheromone traps"]},
    ],
    "tomato": [
        {"id": "late_blight", "name": "Late Blight",
         "match": ["brown_spots", "wilting", "rotting_stem"],
         "description": "Phytophthora infestans — spreads in cool wet weather.",
         "treatment": ["Spray copper fungicide every 7 days",
                       "Remove infected plants",
                       "Avoid overhead irrigation"]},
        {"id": "powdery_mildew", "name": "Powdery Mildew",
         "match": ["powdery_white", "yellow_leaves"],
         "description": "White powdery fungal growth on leaf surfaces.",
         "treatment": ["Spray sulfur or potassium bicarbonate",
                       "Improve air circulation"]},
        {"id": "tomato_curl", "name": "Tomato Leaf Curl Virus",
         "match": ["leaf_curl", "stunted_growth"],
         "description": "Whitefly-transmitted geminivirus; upward leaf curling.",
         "treatment": ["Control whiteflies with traps + neem",
                       "Plant TYLCV-resistant varieties"]},
    ],
}


def predict_disease_label(crop, symptoms):
    crop = (crop or "maize").lower()
    diseases = DISEASE_KB.get(crop, DISEASE_KB["maize"])
    best, best_score = None, 0.0
    for d in diseases:
        overlap = len([s for s in d["match"] if s in symptoms])
        if not overlap:
            continue
        score = overlap / len(d["match"])
        if score > best_score:
            best, best_score = d, score
    if not best:
        return {
            "label": "unknown", "name": "Unknown",
            "confidence": 0.2, "severity": "low",
            "description": "Symptoms could not be matched to a known disease.",
            "treatment": ["Consult an agronomist", "Send a clear photo via Advisories"],
        }
    confidence = min(0.95, 0.45 + best_score * 0.5)
    severity = "high" if confidence > 0.8 else "medium" if confidence > 0.55 else "low"
    return {
        "label": best["id"], "name": best["name"],
        "confidence": round(confidence, 2), "severity": severity,
        "description": best["description"], "treatment": best["treatment"],
    }


@app.post("/predict/disease")
def disease():
    data = request.get_json(silent=True) or {}
    out = predict_disease_label(data.get("crop"), data.get("symptoms", []) or [])
    out["source"] = "flask-ai"
    return jsonify(out)


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

# Smart Farming Decision Support System

Production-ready scaffold for a SaaS smart-farming platform aimed at maize and vegetable farmers in Rwanda.

> **Note:** This is the **standalone MERN + Flask + Docker** scaffold. It is **not** the app rendered in the Lovable preview — Lovable's preview runs a different (TanStack) stack. To use this project, download/clone it and run it on your own machine or server.

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router + Axios + react-i18next + Recharts
- **Backend:** Node.js + Express + Mongoose + JWT + bcrypt + helmet + rate-limit
- **Database:** MongoDB
- **AI service:** Python Flask (rule-based boilerplate, ML-ready)
- **Deployment:** Docker + docker-compose

## Folder structure

```
.
├── backend/          # Express + MongoDB API
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── controllers/   # Route handlers (auth, farm, crop, iot, admin, expert, ussd, ...)
│   │   ├── middleware/    # auth, validate, errorHandler, notFound
│   │   ├── models/        # User, Farm, Crop, IoTData, Recommendation, Prediction,
│   │   │                  # Notification, USSDSession, Device, WeatherLog
│   │   ├── routes/        # Express routers
│   │   ├── services/      # weatherService, smsService, pestPredictionService,
│   │   │                  # mqttService, recommendationEngine
│   │   ├── seed/          # Demo seed script
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── Dockerfile
│
├── mern-frontend/    # React app
│   ├── src/
│   │   ├── components/    # DashboardLayout, ProtectedRoute, StatCard, LanguageSwitcher
│   │   ├── context/       # AuthContext
│   │   ├── locales/       # en.json, rw.json, fr.json
│   │   ├── pages/         # admin/, farmer/, expert/, Login.jsx, Register.jsx
│   │   ├── services/      # api.js (axios)
│   │   ├── App.jsx, main.jsx, i18n.js, index.css
│   ├── .env.example
│   └── Dockerfile
│
├── ai-service/       # Flask AI service
│   ├── app.py
│   ├── requirements.txt
│   └── Dockerfile
│
└── docker-compose.yml
```

## Quick start (Docker — recommended)

```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- AI service: http://localhost:8000
- MongoDB: localhost:27017

Seed demo data (in another terminal):
```bash
docker compose exec backend npm run seed
```

Demo logins (all password `password123`):
- `admin@demo.rw` — Admin
- `farmer@demo.rw` — Farmer
- `expert@demo.rw` — Expert

## Quick start (local, no Docker)

Prerequisites: Node 20+, Python 3.11+, MongoDB running on `mongodb://localhost:27017`.

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run seed   # optional, creates demo users
npm run dev

# Frontend (new terminal)
cd mern-frontend
cp .env.example .env
npm install
npm run dev

# AI service (new terminal, optional)
cd ai-service
pip install -r requirements.txt
python app.py
```

## Roles & access

| Role   | Routes                              |
|--------|-------------------------------------|
| Admin  | `/admin/*`                          |
| Farmer | `/farmer/*`                         |
| Expert | `/expert/*`                         |

Backend enforces RBAC via the `authorize(...roles)` middleware on each route module.

## Key API endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/farmer/dashboard
GET    /api/farms          POST /api/farms          PUT /api/farms/:id   DELETE /api/farms/:id
GET    /api/crops          POST /api/crops
POST   /api/iot/data       (device ingest, no auth — protect with API key in prod)
GET    /api/iot/latest
GET    /api/iot/history/:deviceId
GET    /api/recommendations/user
POST   /api/recommendations/user/generate
GET    /api/alerts/user
GET    /api/weather/current
GET    /api/weather/forecast
GET    /api/history/user

GET    /api/admin/dashboard
GET    /api/admin/users    POST/PUT/DELETE
GET    /api/admin/devices  POST
GET    /api/admin/analytics
GET    /api/admin/system-health
GET    /api/admin/notifications
POST   /api/admin/notifications/send

GET    /api/expert/dashboard
GET    /api/expert/reviews
POST   /api/expert/recommendations/:id/override
POST   /api/expert/interventions
GET    /api/expert/farm-data
GET    /api/expert/advisories

POST   /api/ussd                  (Africa's Talking-compatible)
```

## Service abstractions (mock-ready)

These services return safe deterministic data and have a clear extension point:

- `services/weatherService.js` — replace `getCurrentWeather`/`getForecast` with OpenWeather or similar.
- `services/smsService.js` — wire up Africa's Talking, Twilio, or another SMS gateway.
- `services/pestPredictionService.js` — calls Flask AI service if `AI_SERVICE_URL` is set, otherwise falls back to a rule.
- `services/mqttService.js` — no-op pub/sub. Install `mqtt` and connect to a broker for real IoT.
- `services/recommendationEngine.js` — pure rule-based functions (irrigation, fertilization, pest).

## IoT device ingest

Devices POST JSON to `/api/iot/data`:

```json
{
  "deviceId": "demo-node-001",
  "soilMoisture": 22,
  "temperature": 29,
  "humidity": 78,
  "rainfall": 0,
  "lightIntensity": 18000
}
```

Unknown `deviceId` values are auto-registered as devices in the database.

## USSD

`POST /api/ussd` accepts Africa's Talking-style payloads (`sessionId`, `phoneNumber`, `text`) and returns plain-text responses (`CON ...` to continue, `END ...` to terminate). Sessions are persisted in `USSDSession` so state survives across requests.

Menu (multilingual EN/RW/FR):
1. Weather
2. Recommendations
3. Change language

## Multilingual UI

- English, Kinyarwanda, French
- Powered by `react-i18next`
- Language switcher in the top bar; selection is persisted to `localStorage`
- Add languages by dropping a JSON file in `mern-frontend/src/locales/` and registering it in `src/i18n.js`

## Security notes

- Passwords hashed with bcrypt (10 rounds)
- JWT with configurable expiry
- Helmet + CORS + rate limiting on all `/api/*` routes
- `express-validator` validates auth payloads
- **Production hardening to add:**
  - Protect `POST /api/iot/data` with a per-device API key
  - Rotate `JWT_SECRET`
  - Use HTTPS (terminate TLS at a reverse proxy)
  - Add refresh-token rotation
  - Tighten CORS origin

## Environment variables

Copy `.env.example` → `.env` in both `backend/` and `mern-frontend/`.

Backend:
- `PORT`, `NODE_ENV`
- `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`
- `CORS_ORIGIN`
- `AI_SERVICE_URL` (optional — enables Flask-based pest prediction)
- `WEATHER_API_KEY`, `SMS_API_KEY`, `SMS_API_URL` (optional)

Frontend:
- `VITE_API_URL`

## Roadmap suggestions

- Replace rule-based pest/recommendation logic with trained ML models in `ai-service`
- Wire MQTT for real-time device telemetry
- Add e2e tests (Playwright)
- Add CI workflow (GitHub Actions) with lint + test + Docker build
- Add Prometheus/Grafana for metrics
- Migrate `/api/admin/users` POST to require dedicated password hashing path

## License

MIT
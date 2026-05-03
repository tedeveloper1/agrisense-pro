const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const authRoutes = require('./routes/auth.routes');
const farmRoutes = require('./routes/farm.routes');
const cropRoutes = require('./routes/crop.routes');
const iotRoutes = require('./routes/iot.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const alertRoutes = require('./routes/alert.routes');
const weatherRoutes = require('./routes/weather.routes');
const historyRoutes = require('./routes/history.routes');
const farmerRoutes = require('./routes/farmer.routes');
const adminRoutes = require('./routes/admin.routes');
const expertRoutes = require('./routes/expert.routes');
const ussdRoutes = require('./routes/ussd.routes');
const predictionRoutes = require('./routes/prediction.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 600,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));

// API v1
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/expert', expertRoutes);
app.use('/api/ussd', ussdRoutes);
app.use('/api/predictions', predictionRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

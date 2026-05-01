const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/iot.controller');

// Ingest endpoint is open to devices (in production: protect with device API key)
router.post('/data', ctrl.ingest);

router.get('/latest', authenticate, ctrl.latest);
router.get('/history/:deviceId', authenticate, ctrl.history);

module.exports = router;

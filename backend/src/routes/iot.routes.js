const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/iot.controller');

router.post('/data', ctrl.ingest);
router.get('/latest', authenticate, ctrl.latest);
router.get('/history/:deviceId', authenticate, ctrl.history);
router.get('/pump-status', ctrl.getPumpStatus);

module.exports = router;
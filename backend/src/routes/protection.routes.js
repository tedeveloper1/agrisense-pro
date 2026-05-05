const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/protection.controller');

router.use(authenticate);
router.get('/overview', ctrl.overview);
router.get('/calendar', ctrl.calendar);
// Admin or self-scan; controller adapts to role.
router.post('/scan', ctrl.scanAndAlert);
router.post('/scan/broadcast', authorize('admin'), ctrl.scanAndAlert);

module.exports = router;

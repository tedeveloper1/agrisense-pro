const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/expert.controller');

router.use(authenticate, authorize('expert', 'admin'));

router.get('/dashboard', ctrl.dashboard);
router.get('/reviews', ctrl.reviews);
router.post('/recommendations/:id/override', ctrl.override);
router.post('/interventions', ctrl.intervention);
router.get('/farm-data', ctrl.farmData);
router.get('/advisories', ctrl.advisories);

module.exports = router;

const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/farmer.controller');

router.use(authenticate, authorize('farmer', 'admin'));
router.get('/dashboard', ctrl.dashboard);

module.exports = router;

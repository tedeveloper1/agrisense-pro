const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/weather.controller');

router.use(authenticate);
router.get('/current', ctrl.current);
router.get('/forecast', ctrl.forecast);

module.exports = router;

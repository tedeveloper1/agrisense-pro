const router = require('express').Router();
const ctrl = require('../controllers/ussd.controller');

// USSD aggregator posts as application/x-www-form-urlencoded
router.post('/', ctrl.handle);

module.exports = router;

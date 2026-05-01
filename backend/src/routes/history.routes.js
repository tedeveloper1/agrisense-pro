const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/history.controller');

router.use(authenticate);
router.get('/user', ctrl.userHistory);

module.exports = router;

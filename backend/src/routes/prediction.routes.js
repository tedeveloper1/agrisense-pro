const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/prediction.controller');

router.use(authenticate);
router.post('/disease', ctrl.diagnose);
router.get('/disease/history', ctrl.history);

module.exports = router;

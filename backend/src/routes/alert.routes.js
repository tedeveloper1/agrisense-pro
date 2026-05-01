const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/alert.controller');

router.use(authenticate);
router.get('/user', ctrl.userAlerts);
router.put('/:id/read', ctrl.markRead);

module.exports = router;

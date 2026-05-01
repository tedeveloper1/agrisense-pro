const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/crop.controller');

router.use(authenticate);
router.get('/', ctrl.list);
router.post('/', ctrl.create);

module.exports = router;

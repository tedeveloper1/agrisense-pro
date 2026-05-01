const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/recommendation.controller');

router.use(authenticate);
router.get('/user', ctrl.userRecommendations);
router.post('/user/generate', ctrl.generateForUser);

module.exports = router;

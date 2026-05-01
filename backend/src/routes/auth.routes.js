const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/auth.controller');

router.post(
  '/register',
  [
    body('name').isString().trim().notEmpty().isLength({ max: 120 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 6, max: 200 }),
    body('phone').optional().isString().isLength({ max: 30 }),
    body('role').optional().isIn(['farmer', 'expert']),
    body('language').optional().isIn(['en', 'rw', 'fr']),
  ],
  validate,
  ctrl.register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()],
  validate,
  ctrl.login
);

router.get('/me', authenticate, ctrl.me);

module.exports = router;

const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/admin.controller');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', ctrl.dashboard);
router.get('/users', ctrl.listUsers);
router.post('/users', ctrl.createUser);
router.put('/users/:id', ctrl.updateUser);
router.delete('/users/:id', ctrl.deleteUser);
router.get('/devices', ctrl.listDevices);
router.post('/devices', ctrl.createDevice);
router.get('/analytics', ctrl.analytics);
router.get('/system-health', ctrl.systemHealth);
router.get('/notifications', ctrl.listNotifications);
router.post('/notifications/send', ctrl.sendNotification);

module.exports = router;

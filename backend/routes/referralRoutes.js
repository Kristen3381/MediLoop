const express = require('express');
const { body } = require('express-validator');
const {
  createReferral,
  getReferrals,
  getReferralById,
  makeDecision,
  updateStatus,
  getMetrics,
} = require('../controllers/referralController');
const { createFeedback, getFeedbackByReferral } = require('../controllers/feedbackController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');

const router = express.Router();

router.use(auth);

router.post('/', [
  checkRole(['AMBULANCE', 'NURSE', 'DOCTOR', 'ADMIN']),
  body('patientName').notEmpty(),
  body('condition').notEmpty(),
  body('urgency').isIn(['LOW', 'MEDIUM', 'HIGH']),
  body('toFacility').notEmpty(),
], createReferral);

router.get('/', getReferrals);
router.get('/:id', getReferralById);
router.get('/:id/metrics', getMetrics);

router.patch('/:id/decision', checkRole(['DOCTOR', 'ADMIN']), makeDecision);
router.patch('/:id/status', checkRole(['DOCTOR', 'NURSE', 'ADMIN']), updateStatus);

// Feedback routes nested under referrals
router.post('/:id/feedback', checkRole(['DOCTOR', 'NURSE', 'ADMIN']), createFeedback);
router.get('/:id/feedback', getFeedbackByReferral);

module.exports = router;

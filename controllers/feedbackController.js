const Feedback = require('../models/Feedback');
const Referral = require('../models/Referral');

const createFeedback = async (req, res) => {
  try {
    const { diagnosis, treatment, outcome } = req.body;
    const referralId = req.params.id;

    const referral = await Referral.findById(referralId);
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    const feedback = new Feedback({
      referralId,
      diagnosis,
      treatment,
      outcome,
      createdBy: req.user._id,
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFeedbackByReferral = async (req, res) => {
  try {
    const feedback = await Feedback.find({ referralId: req.params.id })
      .populate('createdBy', 'name email role');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbackByReferral,
};

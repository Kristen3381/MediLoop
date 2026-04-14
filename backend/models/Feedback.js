const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  referralId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Referral',
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  treatment: {
    type: String,
    required: true,
  },
  outcome: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Feedback', feedbackSchema);

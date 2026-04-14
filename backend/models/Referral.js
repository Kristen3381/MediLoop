const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  urgency: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    required: true,
  },
  status: {
    type: String,
    enum: ['SENT', 'ACCEPTED', 'REJECTED', 'ARRIVED', 'TREATED', 'COMPLETED'],
    default: 'SENT',
  },
  rejectionReason: {
    type: String,
  },
  fromFacility: {
    type: String,
    required: true,
  },
  toFacility: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  statusTimeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
}, {
  timestamps: true,
});

// Add initial status to timeline
referralSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusTimeline.push({
      status: 'SENT',
      timestamp: new Date(),
      updatedBy: this.createdBy,
    });
  }
  next();
});

module.exports = mongoose.model('Referral', referralSchema);

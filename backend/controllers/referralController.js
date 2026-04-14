const Referral = require('../models/Referral');
const { validationResult } = require('express-validator');

const createReferral = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const referral = new Referral({
      ...req.body,
      createdBy: req.user._id,
      fromFacility: req.user.facilityName,
    });
    await referral.save();
    res.status(201).json(referral);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReferrals = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'AMBULANCE') {
      // Ambulance sees dispatches they're assigned to or those that are requested
      query = {
        $or: [
          { status: 'DISPATCH_REQUESTED' },
          { assignedTo: req.user._id },
          { createdBy: req.user._id }
        ]
      };
    } else if (req.user.role === 'DOCTOR' || req.user.role === 'NURSE') {
      // Show referrals to their facility or those they created
      query = {
        $or: [
          { toFacility: req.user.facilityName },
          { fromFacility: req.user.facilityName },
          { createdBy: req.user._id }
        ]
      };
    } else if (req.user.role === 'ADMIN') {
        // Admin sees all
    }

    const referrals = await Referral.find(query)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 });
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReferralById = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }
    res.json(referral);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const makeDecision = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const allowedDecisions = ['ACCEPTED', 'REJECTED', 'DISPATCH_REQUESTED', 'DISPATCHED'];
    if (!allowedDecisions.includes(status)) {
      return res.status(400).json({ error: 'Invalid decision status' });
    }

    const referral = await Referral.findById(req.params.id);
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    // Role-based logic
    if (status === 'ACCEPTED' || status === 'REJECTED' || status === 'DISPATCH_REQUESTED') {
      if (referral.toFacility !== req.user.facilityName && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Unauthorized: Not from destination facility' });
      }
    } else if (status === 'DISPATCHED') {
      if (req.user.role !== 'AMBULANCE' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Unauthorized: Only ambulance staff can dispatch' });
      }
    }

    referral.status = status;
    if (status === 'REJECTED') {
      referral.rejectionReason = rejectionReason;
    }
    if (status === 'ACCEPTED' || status === 'DISPATCHED') {
        referral.assignedTo = req.user._id;
    }

    referral.statusTimeline.push({
      status,
      updatedBy: req.user._id,
    });

    await referral.save();
    res.json(referral);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['DISPATCH_REQUESTED', 'DISPATCHED', 'ARRIVED', 'TREATED', 'COMPLETED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status update' });
    }

    const referral = await Referral.findById(req.params.id);
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    // Allow update if user is from destination facility OR if user is the creator (e.g. Ambulance) OR if user is AMBULANCE and status is DISPATCHED
    const isAuthorized = 
      referral.toFacility === req.user.facilityName || 
      referral.createdBy.toString() === req.user._id.toString() ||
      (req.user.role === 'AMBULANCE' && (status === 'DISPATCHED' || status === 'ARRIVED')) ||
      req.user.role === 'ADMIN';

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Unauthorized to update status for this referral' });
    }

    referral.status = status;
    if (status === 'DISPATCHED' || status === 'ARRIVED') {
      referral.assignedTo = req.user._id;
    }

    referral.statusTimeline.push({
      status,
      updatedBy: req.user._id,
    });

    await referral.save();
    res.json(referral);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMetrics = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    const sentTime = referral.createdAt;
    const acceptedTime = referral.statusTimeline.find(t => t.status === 'ACCEPTED')?.timestamp;
    const treatedTime = referral.statusTimeline.find(t => t.status === 'TREATED')?.timestamp;

    const metrics = {
      timeToAccept: acceptedTime ? (acceptedTime - sentTime) / 1000 / 60 : null, // minutes
      timeToTreatment: treatedTime && acceptedTime ? (treatedTime - acceptedTime) / 1000 / 60 : null, // minutes
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReferral,
  getReferrals,
  getReferralById,
  makeDecision,
  updateStatus,
  getMetrics,
};

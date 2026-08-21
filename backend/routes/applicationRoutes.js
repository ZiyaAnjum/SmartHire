const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, verifyToken } = require('../middleware/auth');
const { authorize, requireRole } = require('../middleware/role');
const { validate, updateStatusSchema } = require('../middleware/validation');

// Candidate-only routes
router.post('/apply/:jobId', protect, authorize('candidate'), applyToJob);
router.get('/my-applications', protect, authorize('candidate'), getMyApplications);

// Employer-only routes
router.get('/job-applications', protect, authorize('employer'), getJobApplications);
router.patch('/job-applications/:id/status', protect, authorize('employer'), validate(updateStatusSchema), updateApplicationStatus);
router.patch('/:id/status', protect, authorize('employer'), validate(updateStatusSchema), updateApplicationStatus);

module.exports = router;

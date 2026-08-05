const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Candidate-only routes
router.post('/apply/:jobId', protect, authorize('candidate'), applyToJob);
router.get('/my-applications', protect, authorize('candidate'), getMyApplications);

// Employer-only routes
router.get('/job-applications', protect, authorize('employer'), getJobApplications);

module.exports = router;

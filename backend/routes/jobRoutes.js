const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getJobApplicationsCount,
} = require('../controllers/jobController');
const { protect, verifyToken } = require('../middleware/auth');
const { authorize, requireRole } = require('../middleware/role');
const { validate, createJobSchema, updateJobSchema } = require('../middleware/validation');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Employer-only routes with ownership enforcement
router.post('/', protect, authorize('employer'), validate(createJobSchema), createJob);
router.put('/:id', protect, authorize('employer'), validate(updateJobSchema), updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);
router.get('/:id/applications-count', protect, authorize('employer'), getJobApplicationsCount);

module.exports = router;

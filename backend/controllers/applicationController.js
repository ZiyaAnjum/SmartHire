const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Candidate only)
exports.applyToJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    // 1. Verify that the job listing actually exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found',
      });
    }

    // 2. Prevent duplicate applications
    const alreadyApplied = await Application.findOne({
      job_id: jobId,
      candidate_id: req.user.id, // req.user.id set by protect middleware
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job listing',
      });
    }

    // 3. Create new application
    const application = await Application.create({
      job_id: jobId,
      candidate_id: req.user.id,
      status: 'Applied',
    });

    res.status(201).json({
      success: true,
      message: 'Applied for job successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's job applications
// @route   GET /api/applications/my-applications
// @access  Private (Candidate only)
exports.getMyApplications = async (req, res, next) => {
  try {
    // Find all applications submitted by this candidate, populating job details
    const applications = await Application.find({
      candidate_id: req.user.id,
    }).populate({
      path: 'job_id',
      select: 'title company location salary jobType',
    });

    res.status(200).json({
      success: true,
      message: 'Your applications fetched successfully',
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employer's job applications (applicants for their jobs)
// @route   GET /api/applications/job-applications
// @access  Private (Employer only)
exports.getJobApplications = async (req, res, next) => {
  try {
    // 1. Find all jobs posted by this employer
    const jobs = await Job.find({ employer_id: req.user.id });
    const jobIds = jobs.map((job) => job._id);

    // 2. Find applications referencing those job IDs
    const applications = await Application.find({
      job_id: { $in: jobIds },
    })
      .populate({
        path: 'job_id',
        select: 'title company location',
      })
      .populate({
        path: 'candidate_id',
        select: 'name email',
      });

    res.status(200).json({
      success: true,
      message: 'Job applications retrieved successfully',
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

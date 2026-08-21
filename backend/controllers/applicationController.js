const Application = require('../models/Application');
const Job = require('../models/Job');
const AppError = require('../utils/AppError');

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId or POST /apply/:jobId
// @access  Private (Candidate only)
exports.applyToJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const candidateId = (req.user.id || req.user._id).toString();

    // 1. Verify that the job listing actually exists
    const job = await Job.findById(jobId);
    if (!job) {
      return next(new AppError('Job listing not found', 404));
    }

    // 2. Prevent duplicate applications
    const alreadyApplied = await Application.findOne({
      job_id: jobId,
      candidate_id: candidateId,
    });

    if (alreadyApplied) {
      return next(new AppError('You have already submitted an application to this job listing', 400));
    }

    // 3. Create new application
    const application = await Application.create({
      job_id: jobId,
      candidate_id: candidateId,
      status: 'Applied',
      applied_at: new Date(),
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

// @desc    Get candidate's job applications with pagination
// @route   GET /api/applications/my-applications or GET /my-applications
// @access  Private (Candidate only)
// @query   page, limit, status
exports.getMyApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const candidateId = (req.user.id || req.user._id).toString();

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const filter = { candidate_id: candidateId };
    if (status) {
      filter.status = status;
    }

    const allApplications = await Application.find(filter).populate({
      path: 'job_id',
      select: 'title company location salary jobType description',
    });

    const totalCount = allApplications.length;
    const totalPages = Math.ceil(totalCount / limitNum) || 1;
    const paginatedApplications = allApplications.slice(skip, skip + limitNum);

    res.status(200).json({
      success: true,
      message: 'Your applications fetched successfully',
      count: paginatedApplications.length,
      totalCount,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      data: paginatedApplications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employer's job applications (applicants for their jobs only)
// @route   GET /api/applications/job-applications or GET /job-applications
// @access  Private (Employer only)
exports.getJobApplications = async (req, res, next) => {
  try {
    const employerId = (req.user.id || req.user._id).toString();

    // 1. Find all jobs posted by this employer
    const jobs = await Job.find({ employer_id: employerId });
    const jobIds = jobs.map((job) => job._id || job.id);

    if (jobIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No job postings found for this employer',
        count: 0,
        data: [],
      });
    }

    // 2. Find applications referencing those job IDs only (ensuring ownership)
    const applications = await Application.find({
      job_id: { $in: jobIds },
    })
      .populate({
        path: 'job_id',
        select: 'title company location salary jobType',
      })
      .populate({
        path: 'candidate_id',
        select: 'name email headline bio skills',
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

// @desc    Update application status (Shortlisted, Rejected, Applied)
// @route   PATCH /api/applications/job-applications/:id/status or PATCH /api/applications/:id/status
// @access  Private (Employer only, Owner only)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const employerId = (req.user.id || req.user._id).toString();

    // 1. Find the application
    let application = await Application.findById(id);
    if (!application) {
      return next(new AppError('Application record not found', 404));
    }

    // 2. Verify that the job belongs to this employer
    const rawJobId = application.job_id?._id || application.job_id;
    const job = await Job.findById(rawJobId);

    if (!job) {
      return next(new AppError('Associated job listing not found or has been deleted', 404));
    }

    const jobOwnerId = (job.employer_id?._id || job.employer_id)?.toString();

    if (jobOwnerId !== employerId) {
      return next(new AppError('Forbidden: You can only update applications for job listings you posted', 403));
    }

    // 3. Update application status
    if (typeof application.save === 'function') {
      application.status = status;
      await application.save();
    } else if (Application.findByIdAndUpdate) {
      application = await Application.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );
    } else {
      application.status = status;
    }

    // Re-populate for rich response
    const populated = await Application.findById(id)
      .populate({
        path: 'job_id',
        select: 'title company location',
      })
      .populate({
        path: 'candidate_id',
        select: 'name email headline bio skills',
      });

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: populated || application,
    });
  } catch (error) {
    next(error);
  }
};


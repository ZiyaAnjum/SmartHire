const Job = require('../models/Job');
const Application = require('../models/Application');
const AppError = require('../utils/AppError');

// Helper to extract numbers from salary strings like "$120,000 - $150,000"
const parseSalaryNumber = (salaryStr) => {
  if (!salaryStr) return 0;
  const match = salaryStr.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

// @desc    Create a new job posting
// @route   POST /api/jobs or POST /jobs
// @access  Private (Employer only)
exports.createJob = async (req, res, next) => {
  try {
    const { title, company, location, salary, description, requirements, jobType } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      salary: salary || 'Competitive / Unspecified',
      description,
      requirements: requirements || [],
      jobType,
      employer_id: req.user.id || req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs with search, filtering, and pagination
// @route   GET /api/jobs or GET /jobs
// @access  Public
// @query   search, location, jobType, minSalary, page, limit
exports.getJobs = async (req, res, next) => {
  try {
    const { search, location, jobType, minSalary, page = 1, limit = 10, employer_id } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Build Mongoose filter query
    const filter = {};

    if (employer_id) {
      filter.employer_id = employer_id;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requirements: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination and population
    const allJobs = await Job.find(filter).populate('employer_id', 'name email');

    // Filter by minSalary if provided
    let filteredJobs = allJobs;
    if (minSalary) {
      const minSalVal = parseInt(minSalary, 10);
      if (!isNaN(minSalVal) && minSalVal > 0) {
        filteredJobs = allJobs.filter((job) => {
          const sal = parseSalaryNumber(job.salary);
          return sal >= minSalVal;
        });
      }
    }

    const totalCount = filteredJobs.length;
    const totalPages = Math.ceil(totalCount / limitNum) || 1;
    const paginatedJobs = filteredJobs.slice(skip, skip + limitNum);

    res.status(200).json({
      success: true,
      message: 'Jobs retrieved successfully',
      count: paginatedJobs.length,
      totalCount,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      data: paginatedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id or GET /jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer_id', 'name email');

    if (!job) {
      return next(new AppError('Job listing not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Job details fetched successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job listing
// @route   PUT /api/jobs/:id or PUT /jobs/:id
// @access  Private (Employer only, Owner only)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('Job listing not found', 404));
    }

    const jobOwnerId = (job.employer_id && job.employer_id._id)
      ? job.employer_id._id.toString()
      : job.employer_id?.toString();

    const loggedInUserId = (req.user.id || req.user._id).toString();

    if (jobOwnerId !== loggedInUserId) {
      return next(new AppError('Forbidden: You are not authorized to update this job listing as you are not its owner', 403));
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('employer_id', 'name email');

    res.status(200).json({
      success: true,
      message: 'Job listing updated successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job listing
// @route   DELETE /api/jobs/:id or DELETE /jobs/:id
// @access  Private (Employer only, Owner only)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('Job listing not found', 404));
    }

    const jobOwnerId = (job.employer_id && job.employer_id._id)
      ? job.employer_id._id.toString()
      : job.employer_id?.toString();

    const loggedInUserId = (req.user.id || req.user._id).toString();

    if (jobOwnerId !== loggedInUserId) {
      return next(new AppError('Forbidden: You are not authorized to delete this job listing as you are not its owner', 403));
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job listing deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications count and status breakdown for a job
// @route   GET /api/jobs/:id/applications-count or GET /jobs/:id/applications-count
// @access  Private (Employer only, Owner only)
exports.getJobApplicationsCount = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('Job listing not found', 404));
    }

    const jobOwnerId = (job.employer_id && job.employer_id._id)
      ? job.employer_id._id.toString()
      : job.employer_id?.toString();

    const loggedInUserId = (req.user.id || req.user._id).toString();

    if (jobOwnerId !== loggedInUserId) {
      return next(new AppError('Forbidden: You are not authorized to view application metrics for this job', 403));
    }

    const applications = await Application.find({ job_id: req.params.id });

    const totalApplications = applications.length;
    const appliedCount = applications.filter((a) => a.status === 'Applied').length;
    const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
    const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

    res.status(200).json({
      success: true,
      message: 'Applications count retrieved successfully',
      data: {
        jobId: req.params.id,
        totalApplications,
        breakdown: {
          applied: appliedCount,
          shortlisted: shortlistedCount,
          rejected: rejectedCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


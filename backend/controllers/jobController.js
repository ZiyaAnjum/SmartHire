const Job = require('../models/Job');

exports.createJob = async (req, res, next) => {
  try {
    const { title, company, location, salary, description, requirements, jobType } = req.body;

    // Create job with the logged-in user as the employer
    const job = await Job.create({
      title,
      company,
      location,
      salary,
      description,
      requirements,
      jobType,
      employer_id: req.user.id, // Set from protect middleware
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

exports.getJobs = async (req, res, next) => {
  try {

    const jobs = await Job.find().populate('employer_id', 'name email');

    res.status(200).json({
      success: true,
      message: 'Jobs fetched successfully',
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};


exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer_id', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found',
      });
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


exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found',
      });
    }


    if (job.employer_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job listing',
      });
    }


    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Job listing updated successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found',
      });
    }


    if (job.employer_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job listing',
      });
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

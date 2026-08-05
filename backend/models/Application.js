const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Please specify the job this application is for'],
    },
    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify the candidate applying for this job'],
    },
    status: {
      type: String,
      required: [true, 'Please specify application status'],
      enum: {
        values: ['Applied', 'Shortlisted', 'Rejected'],
        message: 'Status must be Applied, Shortlisted, or Rejected',
      },
      default: 'Applied',
    },
    applied_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


ApplicationSchema.index({ job_id: 1, candidate_id: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);

const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true,
    },
    salary: {
      type: String,
      required: false,
      default: 'Competitive / Unspecified',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a job description'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    jobType: {
      type: String,
      required: [true, 'Please add a job type'],
      enum: {
        values: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
        message: 'Please select a valid job type (Full-time, Part-time, Contract, Internship, Remote)',
      },
    },
    employer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please associate this job with an employer'],
    },
  },
  {
    timestamps: true,
  }
);

const MongooseJobModel = mongoose.models.Job || mongoose.model('Job', JobSchema);

const inMemoryStore = require('./inMemoryStore');

const JobProxy = new Proxy(MongooseJobModel, {
  get(target, prop) {
    if (mongoose.connection.readyState !== 1) {
      if (prop in inMemoryStore.Job) {
        return inMemoryStore.Job[prop];
      }
    }
    return target[prop];
  },
});

module.exports = JobProxy;

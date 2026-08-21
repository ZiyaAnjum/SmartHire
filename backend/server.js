const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const errorHandler = require('./middleware/error');

// Import controllers directly for root-level alias endpoints
const authController = require('./controllers/authController');
const jobController = require('./controllers/jobController');
const applicationController = require('./controllers/applicationController');
const { protect, verifyToken } = require('./middleware/auth');
const { authorize, requireRole } = require('./middleware/role');
const {
  validate,
  signupSchema,
  loginSchema,
  createJobSchema,
  updateJobSchema,
  updateProfileSchema,
  updateStatusSchema,
} = require('./middleware/validation');

const app = express();

app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SmartHire API is running smoothly',
    database: mongoose.connection.readyState === 1 ? 'connected (MongoDB)' : 'in-memory fallback active',
  });
});

// Mounted Modular API Routers
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Direct Route Aliases for Exact Spec Compatibility
// Auth Aliases
app.post('/signup', validate(signupSchema), authController.signup);
app.post('/login', validate(loginSchema), authController.login);
app.get('/me', protect, authController.getMe);
app.patch('/me', protect, validate(updateProfileSchema), authController.updateMe);

// Job Aliases
app.get('/jobs', jobController.getJobs);
app.post('/jobs', protect, authorize('employer'), validate(createJobSchema), jobController.createJob);
app.get('/jobs/:id', jobController.getJob);
app.put('/jobs/:id', protect, authorize('employer'), validate(updateJobSchema), jobController.updateJob);
app.delete('/jobs/:id', protect, authorize('employer'), jobController.deleteJob);
app.get('/jobs/:id/applications-count', protect, authorize('employer'), jobController.getJobApplicationsCount);

// Application Aliases
app.post('/apply/:jobId', protect, authorize('candidate'), applicationController.applyToJob);
app.get('/my-applications', protect, authorize('candidate'), applicationController.getMyApplications);
app.get('/job-applications', protect, authorize('employer'), applicationController.getJobApplications);
app.patch('/job-applications/:id/status', protect, authorize('employer'), validate(updateStatusSchema), applicationController.updateApplicationStatus);

// Global Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.set('bufferCommands', false);

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
    .then(() => {
      console.log('Connected to MongoDB database successfully.');
    })
    .catch((err) => {
      console.warn('MongoDB connection not available. Using high-performance in-memory data store.');
    });
} else {
  console.log('No MONGO_URI provided. Using high-performance in-memory data store.');
}

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Job Portal API Server running on port ${PORT}`);
  });
}

module.exports = app;

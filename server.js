const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./backend/routes/authRoutes');
const jobRoutes = require('./backend/routes/jobRoutes');
const applicationRoutes = require('./backend/routes/applicationRoutes');
const errorHandler = require('./backend/middleware/error');

// Import controllers directly for root-level alias endpoints
const authController = require('./backend/controllers/authController');
const jobController = require('./backend/controllers/jobController');
const applicationController = require('./backend/controllers/applicationController');
const { protect, verifyToken } = require('./backend/middleware/auth');
const { authorize, requireRole } = require('./backend/middleware/role');
const {
  validate,
  signupSchema,
  loginSchema,
  createJobSchema,
  updateJobSchema,
  updateProfileSchema,
  updateStatusSchema,
} = require('./backend/middleware/validation');

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const MONGO_URI = process.env.MONGO_URI;

  mongoose.set('bufferCommands', false);
  if (MONGO_URI) {
    mongoose
      .connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
      .then(() => {
        console.log('Connected to MongoDB database.');
      })
      .catch(() => {
        console.warn('MongoDB not reachable. Running with in-memory fallback.');
      });
  } else {
    console.log('Running with in-memory data store.');
  }

  app.use(express.json());
  app.use(cors());

  // API Routes FIRST
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'SmartHire API is running smoothly',
      database: mongoose.connection.readyState === 1 ? 'connected (MongoDB)' : 'in-memory fallback active',
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/applications', applicationRoutes);

  // Direct Route Aliases for Strict Spec Matching
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

  // Global Error Handler for API routes
  app.use(errorHandler);

  // Serve Frontend
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: path.resolve(__dirname, 'frontend'),
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartHire server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'smarthire_jwt_secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup or POST /signup
// @access  Public
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError('A user account with this email address already exists', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = generateToken(user._id || user.id);

    // Auto-seed starter data so the dashboard is immediately populated and engaging
    try {
      const Job = require('../models/Job');
      const Application = require('../models/Application');
      const userId = (user._id || user.id).toString();

      if (role === 'employer') {
        const starterJobs = [
          {
            title: 'Senior Full Stack Engineer (React / Node.js)',
            company: user.name || 'Acme Tech',
            location: 'Remote / San Francisco',
            salary: '$145,000 - $185,000',
            description: 'Lead end-to-end full-stack feature delivery, resilient microservices, and modern responsive React web applications.',
            requirements: ['5+ years React & TypeScript', 'Node.js & Express REST APIs', 'PostgreSQL or MongoDB', 'System Design & CI/CD'],
            jobType: 'Full-time',
            employer_id: userId,
          },
          {
            title: 'Frontend UI/UX Architect & Design Systems Lead',
            company: user.name || 'Acme Tech',
            location: 'Remote',
            salary: '$130,000 - $165,000',
            description: 'Build polished, accessible, component-driven design systems, smooth interactive animations, and responsive web workflows.',
            requirements: ['React 18+ & Tailwind CSS', 'Figma & Design Tokens', 'Web Performance & Accessibility (WCAG AA)', 'State management'],
            jobType: 'Full-time',
            employer_id: userId,
          },
          {
            title: 'Cloud DevOps & Site Reliability Engineer',
            company: user.name || 'Acme Tech',
            location: 'Remote / New York, NY',
            salary: '$140,000 - $175,000',
            description: 'Own Kubernetes deployment infrastructure, automated CI/CD pipelines, container monitoring, and high-availability cloud architecture.',
            requirements: ['Kubernetes & Docker', 'Terraform / IaC', 'AWS / GCP / Cloud Run', 'Monitoring (Prometheus, Datadog)'],
            jobType: 'Full-time',
            employer_id: userId,
          },
        ];

        const createdJobs = [];
        for (const jobData of starterJobs) {
          const j = await Job.create(jobData);
          createdJobs.push(j);
        }

        const candidateUsers = await User.find({ role: 'candidate' });
        const cIds = (candidateUsers || []).map((u) => (u._id || u.id).toString());

        if (cIds.length >= 3 && createdJobs.length >= 3) {
          await Application.create({
            job_id: (createdJobs[0]._id || createdJobs[0].id).toString(),
            candidate_id: cIds[0],
            status: 'Shortlisted',
            applied_at: new Date(Date.now() - 2 * 86400000),
          });
          await Application.create({
            job_id: (createdJobs[0]._id || createdJobs[0].id).toString(),
            candidate_id: cIds[1],
            status: 'Applied',
            applied_at: new Date(Date.now() - 1 * 86400000),
          });
          await Application.create({
            job_id: (createdJobs[1]._id || createdJobs[1].id).toString(),
            candidate_id: cIds[1],
            status: 'Shortlisted',
            applied_at: new Date(Date.now() - 2 * 86400000),
          });
          await Application.create({
            job_id: (createdJobs[1]._id || createdJobs[1].id).toString(),
            candidate_id: cIds[3] || cIds[2],
            status: 'Applied',
            applied_at: new Date(Date.now() - 1 * 86400000),
          });
          await Application.create({
            job_id: (createdJobs[2]._id || createdJobs[2].id).toString(),
            candidate_id: cIds[4] || cIds[0],
            status: 'Shortlisted',
            applied_at: new Date(Date.now() - 3 * 86400000),
          });
        }
      } else if (role === 'candidate') {
        const allJobs = await Job.find({});
        if (allJobs && allJobs.length > 0) {
          // Select 4 varied jobs across companies
          const selectedJobs = [
            allJobs[0],
            allJobs[3] || allJobs[1],
            allJobs[6] || allJobs[2],
            allJobs[9] || allJobs[1] || allJobs[0],
          ].filter(Boolean);

          const realisticStatuses = ['Shortlisted', 'Applied', 'Rejected', 'Applied'];
          const daysAgo = [3, 1, 8, 14];

          for (let i = 0; i < selectedJobs.length; i++) {
            const jId = (selectedJobs[i]._id || selectedJobs[i].id).toString();
            await Application.create({
              job_id: jId,
              candidate_id: userId,
              status: realisticStatuses[i % realisticStatuses.length],
              applied_at: new Date(Date.now() - (daysAgo[i] || 2) * 86400000),
            });
          }
        }
      }
    } catch (seedErr) {
      console.warn('Auto-seed error on registration:', seedErr);
    }

    res.status(201).json({
      success: true,
      message: 'User account registered successfully',
      token,
      data: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: user.headline || '',
        bio: user.bio || '',
        skills: user.skills || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login or POST /login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = generateToken(user._id || user.id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      data: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: user.headline || '',
        bio: user.bio || '',
        skills: user.skills || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me or GET /me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id || req.user._id);
    if (!user) {
      return next(new AppError('User profile not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Current profile retrieved successfully',
      data: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: user.headline || '',
        bio: user.bio || '',
        skills: user.skills || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name, bio, skills, headline)
// @route   PATCH /api/auth/me or PATCH /me
// @access  Private
exports.updateMe = async (req, res, next) => {
  try {
    const { name, headline, bio, skills } = req.body;

    const user = await User.findById(req.user.id || req.user._id);
    if (!user) {
      return next(new AppError('User profile not found', 404));
    }

    if (name !== undefined) user.name = name;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;

    if (typeof user.save === 'function') {
      await user.save();
    } else if (User.findByIdAndUpdate) {
      await User.findByIdAndUpdate(user._id || user.id, { name, headline, bio, skills });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: user.headline || '',
        bio: user.bio || '',
        skills: user.skills || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

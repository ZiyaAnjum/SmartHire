const { z } = require('zod');
const AppError = require('../utils/AppError');

// Generic validation middleware creator
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = schema.parse(dataToValidate);
      req[source] = parsed; // Replace with sanitized/validated data
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.errors.map((e) => `${e.path.join('.') || source}: ${e.message}`).join('; ');
        return next(new AppError(`Validation failed: ${errorMessages}`, 400));
      }
      next(err);
    }
  };
};

// Signup Validation Schema
const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').max(70, 'Name cannot exceed 70 characters'),
  email: z.string().trim().email('Please provide a valid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters long').max(100, 'Password cannot exceed 100 characters'),
  role: z.enum(['candidate', 'employer'], {
    errorMap: () => ({ message: "Role must be either 'candidate' or 'employer'" }),
  }),
});

// Login Validation Schema
const loginSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

// Job Creation Validation Schema
const createJobSchema = z.object({
  title: z.string().trim().min(3, 'Job title must be at least 3 characters').max(120, 'Job title cannot exceed 120 characters'),
  company: z.string().trim().min(2, 'Company name is required'),
  location: z.string().trim().min(2, 'Location is required'),
  salary: z.string().trim().optional().or(z.literal('')),
  description: z.string().trim().min(10, 'Description must be at least 10 characters long'),
  requirements: z.array(z.string().trim()).optional().default([]),
  jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'], {
    errorMap: () => ({ message: 'Job type must be Full-time, Part-time, Contract, Internship, or Remote' }),
  }),
});

// Job Update Validation Schema
const updateJobSchema = createJobSchema.partial();

// Profile Update Schema (PATCH /me)
const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').optional(),
  headline: z.string().trim().max(100, 'Headline cannot exceed 100 characters').optional(),
  bio: z.string().trim().max(1000, 'Bio cannot exceed 1000 characters').optional(),
  skills: z.array(z.string().trim()).optional(),
});

// Status Update Schema (PATCH /job-applications/:id/status)
const updateStatusSchema = z.object({
  status: z.enum(['Applied', 'Shortlisted', 'Rejected'], {
    errorMap: () => ({ message: "Status must be 'Applied', 'Shortlisted', or 'Rejected'" }),
  }),
});

module.exports = {
  validate,
  signupSchema,
  loginSchema,
  createJobSchema,
  updateJobSchema,
  updateProfileSchema,
  updateStatusSchema,
};

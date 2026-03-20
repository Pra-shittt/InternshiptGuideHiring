import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { AppError, catchAsync } from '../utils/appError.js';

// ─── Job Controller ──────────────────────────────────
// Handles CRUD operations for job postings.
// Recruiters can create, update, delete jobs.
// Candidates can view open jobs.

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Recruiter only
export const createJob = catchAsync(async (req, res) => {
  const { title, description, company, location, type, skills, salary, openings, deadline } = req.body;

  const job = await Job.create({
    postedBy: req.user._id,
    title,
    description,
    company: company || req.user.company,
    location,
    type,
    skills,
    salary,
    openings,
    deadline,
  });

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: job,
  });
});

// @desc    Get all open jobs (for candidates to browse)
// @route   GET /api/jobs
// @access  Authenticated
export const getJobs = catchAsync(async (req, res) => {
  const { company, type, skill, search } = req.query;
  const filter = { status: 'open' };

  if (company) filter.company = { $regex: company, $options: 'i' };
  if (type) filter.type = type;
  if (skill) filter.skills = { $in: [skill] };
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  const jobs = await Job.find(filter)
    .populate('postedBy', 'name company')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: jobs });
});

// @desc    Get jobs posted by the logged-in recruiter
// @route   GET /api/jobs/my-jobs
// @access  Recruiter only
export const getMyJobs = catchAsync(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id })
    .sort({ createdAt: -1 });

  // Get application counts for each job
  const jobIds = jobs.map((j) => j._id);
  const applicationCounts = await Application.aggregate([
    { $match: { job: { $in: jobIds } } },
    { $group: { _id: '$job', count: { $sum: 1 } } },
  ]);

  const countMap = {};
  applicationCounts.forEach((a) => { countMap[a._id.toString()] = a.count; });

  const jobsWithCounts = jobs.map((j) => ({
    ...j.toObject(),
    applicationCount: countMap[j._id.toString()] || 0,
  }));

  res.json({ success: true, data: jobsWithCounts });
});

// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
// @access  Authenticated
export const getJobById = catchAsync(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('postedBy', 'name company email');

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  res.json({ success: true, data: job });
});

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Recruiter (owner only)
export const updateJob = catchAsync(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) throw new AppError('Job not found', 404);
  if (job.postedBy.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to update this job', 403);
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, message: 'Job updated', data: updatedJob });
});

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Recruiter (owner only)
export const deleteJob = catchAsync(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) throw new AppError('Job not found', 404);
  if (job.postedBy.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to delete this job', 403);
  }

  // Also remove all applications for this job
  await Application.deleteMany({ job: req.params.id });
  await Job.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Job and related applications deleted' });
});

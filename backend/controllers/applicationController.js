import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { AppError, catchAsync } from '../utils/appError.js';

// ─── Application Controller ─────────────────────────
// Handles the candidate application workflow.
// Candidates apply to jobs, recruiters manage applications.

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Candidate only
export const applyToJob = catchAsync(async (req, res) => {
  const { jobId, coverLetter } = req.body;

  // Check job exists and is open
  const job = await Job.findById(jobId);
  if (!job) throw new AppError('Job not found', 404);
  if (job.status !== 'open') throw new AppError('This job is no longer accepting applications', 400);

  // Check if already applied
  const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
  if (existing) throw new AppError('You have already applied to this job', 400);

  const application = await Application.create({
    job: jobId,
    applicant: req.user._id,
    coverLetter,
    resumeUrl: req.user.resumeUrl || null,
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: application,
  });
});

// @desc    Get candidate's own applications
// @route   GET /api/applications/my-applications
// @access  Candidate only
export const getMyApplications = catchAsync(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate({
      path: 'job',
      select: 'title company location type status salary',
      populate: { path: 'postedBy', select: 'name' },
    })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: applications });
});

// @desc    Get all applicants for a specific job (recruiter view)
// @route   GET /api/applications/job/:jobId
// @access  Recruiter (owner only)
export const getJobApplicants = catchAsync(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) throw new AppError('Job not found', 404);
  if (job.postedBy.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to view applicants for this job', 403);
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate('applicant', 'name email skills resumeUrl interviewStatus phone')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: applications });
});

// @desc    Update application status (shortlist, reject, etc.)
// @route   PUT /api/applications/:id/status
// @access  Recruiter only
export const updateApplicationStatus = catchAsync(async (req, res) => {
  const { status, notes } = req.body;

  const application = await Application.findById(req.params.id)
    .populate('job', 'postedBy');

  if (!application) throw new AppError('Application not found', 404);

  // Verify the recruiter owns this job
  if (application.job.postedBy.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to update this application', 403);
  }

  // Validate status transition
  const validStatuses = ['applied', 'shortlisted', 'interview', 'offered', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
  }

  application.status = status;
  if (notes) application.notes = notes;
  await application.save();

  res.json({
    success: true,
    message: `Application ${status} successfully`,
    data: application,
  });
});

// @desc    Withdraw an application (candidate action)
// @route   PUT /api/applications/:id/withdraw
// @access  Candidate (own applications only)
export const withdrawApplication = catchAsync(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) throw new AppError('Application not found', 404);
  if (application.applicant.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }
  if (['offered', 'rejected'].includes(application.status)) {
    throw new AppError('Cannot withdraw application at this stage', 400);
  }

  application.status = 'withdrawn';
  await application.save();

  res.json({ success: true, message: 'Application withdrawn', data: application });
});

// @desc    Get candidate assessment scores for a job (recruiter)
// @route   GET /api/applications/job/:jobId/scores
// @access  Recruiter (owner only)
export const getApplicantScores = catchAsync(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) throw new AppError('Job not found', 404);
  if (job.postedBy.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate('applicant', 'name email skills')
    .select('applicant status assessmentScore notes')
    .sort({ assessmentScore: -1 });

  res.json({ success: true, data: applications });
});

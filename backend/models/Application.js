import mongoose from 'mongoose';

// ─── Application Model ──────────────────────────────
// Represents a candidate's application to a job posting.
// Tracks application status through the hiring pipeline.

const applicationSchema = new mongoose.Schema({
  // The job being applied to
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Application must reference a job'],
  },
  // The candidate who applied
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Application must have an applicant'],
  },
  // Current status in the hiring pipeline
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'],
    default: 'applied',
  },
  // Cover letter or additional message from the candidate
  coverLetter: {
    type: String,
    default: '',
  },
  // Resume URL at the time of application
  resumeUrl: {
    type: String,
    default: null,
  },
  // Recruiter notes about this application
  notes: {
    type: String,
    default: '',
  },
  // Assessment score if candidate took an assessment for this job
  assessmentScore: {
    type: Number,
    default: null,
  },
}, {
  timestamps: true,
});

// Prevent duplicate applications (one candidate per job)
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });

const Application = mongoose.model('Application', applicationSchema);
export default Application;

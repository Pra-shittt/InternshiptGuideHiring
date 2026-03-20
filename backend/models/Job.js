import mongoose from 'mongoose';

// ─── Job Model ───────────────────────────────────────
// Represents a job posting created by a recruiter.
// Candidates can view and apply to these postings.

const jobSchema = new mongoose.Schema({
  // The recruiter who created this job posting
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Job must have a recruiter'],
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  location: {
    type: String,
    default: 'Remote',
    trim: true,
  },
  type: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract'],
    default: 'Full-Time',
  },
  // Required skills for the position
  skills: {
    type: [String],
    default: [],
  },
  salary: {
    type: String,
    default: null, // e.g. "₹6-10 LPA" or "$80k-$120k"
  },
  // How many positions are open
  openings: {
    type: Number,
    default: 1,
    min: 1,
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'draft'],
    default: 'open',
  },
  // Deadline for applications
  deadline: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
jobSchema.index({ postedBy: 1, status: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ status: 1, createdAt: -1 });

const Job = mongoose.model('Job', jobSchema);
export default Job;

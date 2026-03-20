import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import {
  createJob, getJobs, getMyJobs, getJobById, updateJob, deleteJob
} from '../controllers/jobController.js';

const router = express.Router();

// ─── Job Routes ──────────────────────────────────────
// Public (authenticated): browse open jobs
// Recruiter: CRUD operations on own job postings

// GET    /api/jobs           → List all open jobs (with search/filter)
// POST   /api/jobs           → Create a new job posting (recruiter)
// GET    /api/jobs/my-jobs   → Get recruiter's own job postings
// GET    /api/jobs/:id       → Get a single job by ID
// PUT    /api/jobs/:id       → Update a job (recruiter, owner)
// DELETE /api/jobs/:id       → Delete a job (recruiter, owner)

router.use(protect); // All routes require authentication

router.route('/')
  .get(getJobs)
  .post(authorize('recruiter', 'admin'), createJob);

router.get('/my-jobs', authorize('recruiter', 'admin'), getMyJobs);

router.route('/:id')
  .get(getJobById)
  .put(authorize('recruiter', 'admin'), updateJob)
  .delete(authorize('recruiter', 'admin'), deleteJob);

export default router;

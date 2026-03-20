import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import {
  applyToJob, getMyApplications, getJobApplicants,
  updateApplicationStatus, withdrawApplication, getApplicantScores
} from '../controllers/applicationController.js';

const router = express.Router();

// ─── Application Routes ─────────────────────────────
// Candidate: apply, view own applications, withdraw
// Recruiter: view applicants, update status, view scores

// POST   /api/applications                   → Apply to a job (candidate)
// GET    /api/applications/my-applications    → Get own applications (candidate)
// GET    /api/applications/job/:jobId         → Get applicants for a job (recruiter)
// GET    /api/applications/job/:jobId/scores  → Get assessment scores (recruiter)
// PUT    /api/applications/:id/status         → Update application status (recruiter)
// PUT    /api/applications/:id/withdraw       → Withdraw application (candidate)

router.use(protect); // All routes require authentication

router.post('/', authorize('candidate'), applyToJob);
router.get('/my-applications', authorize('candidate'), getMyApplications);

router.get('/job/:jobId', authorize('recruiter', 'admin'), getJobApplicants);
router.get('/job/:jobId/scores', authorize('recruiter', 'admin'), getApplicantScores);

router.put('/:id/status', authorize('recruiter', 'admin'), updateApplicationStatus);
router.put('/:id/withdraw', authorize('candidate'), withdrawApplication);

export default router;

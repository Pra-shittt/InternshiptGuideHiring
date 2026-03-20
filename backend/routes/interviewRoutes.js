import express from 'express';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import {
  startInterview,
  saveNotes,
  endInterview,
  getInterviewById,
  getCandidateInterviews,
} from '../controllers/interviewController.js';

const router = express.Router();

// Candidate route
router.get('/candidate/upcoming', protect, getCandidateInterviews);

// Protected routes (recruiter)
router.get('/:id', protect, getInterviewById);
router.post('/:id/start', protect, roleCheck('recruiter'), startInterview);
router.put('/:id/notes', protect, roleCheck('recruiter'), saveNotes);
router.put('/:id/end', protect, roleCheck('recruiter'), endInterview);

export default router;

import express from 'express';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import {
  submitAssessment,
  getAssessments,
  getCandidateAssessments,
} from '../controllers/assessmentController.js';

const router = express.Router();

// Candidate routes
router.post('/', protect, submitAssessment);
router.get('/', protect, getAssessments);

// Recruiter route
router.get('/candidate/:id', protect, roleCheck('recruiter'), getCandidateAssessments);

export default router;

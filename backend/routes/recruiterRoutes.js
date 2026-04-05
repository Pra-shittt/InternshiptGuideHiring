import express from 'express';
import {
  getCandidates,
  getCandidatePerformance,
  scheduleInterview,
  getInterviews,
  getAllCandidates,
} from '../controllers/recruiterController.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/candidates', protect, roleCheck('recruiter'), getCandidates);
router.get('/all-candidates', protect, roleCheck('recruiter'), getAllCandidates);
router.get('/candidates/:id', protect, roleCheck('recruiter'), getCandidatePerformance);
router.post('/interviews', protect, roleCheck('recruiter'), scheduleInterview);
router.get('/interviews', protect, roleCheck('recruiter'), getInterviews);

export default router;

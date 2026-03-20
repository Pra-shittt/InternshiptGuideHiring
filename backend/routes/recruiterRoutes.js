import express from 'express';
import {
  getCandidates,
  getCandidatePerformance,
  scheduleInterview,
  getInterviews,
} from '../controllers/recruiterController.js';
import { getRecruiterAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/candidates', protect, roleCheck('recruiter'), getCandidates);
router.get('/candidates/:id', protect, roleCheck('recruiter'), getCandidatePerformance);
router.post('/interviews', protect, roleCheck('recruiter'), scheduleInterview);
router.get('/interviews', protect, roleCheck('recruiter'), getInterviews);
router.get('/analytics', protect, roleCheck('recruiter'), getRecruiterAnalytics);

export default router;

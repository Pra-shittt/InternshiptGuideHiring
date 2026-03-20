import express from 'express';
import { getPerformanceSummary } from '../controllers/performanceController.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/summary', protect, roleCheck('candidate'), getPerformanceSummary);

export default router;

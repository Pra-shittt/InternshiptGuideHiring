import express from 'express';
import { startTest, submitTest, getAttempts } from '../controllers/testController.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/start', protect, roleCheck('candidate'), startTest);
router.post('/submit', protect, roleCheck('candidate'), submitTest);
router.get('/attempts', protect, roleCheck('candidate'), getAttempts);

export default router;

import express from 'express';
import { upload, uploadResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/upload', protect, roleCheck('candidate'), upload.single('resume'), uploadResume);

export default router;

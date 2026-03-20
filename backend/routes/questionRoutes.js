import express from 'express';
import {
  getQuestions,
  getQuestion,
  getCompanies,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/', protect, getQuestions);
router.get('/companies', protect, getCompanies);
router.get('/:id', protect, getQuestion);
router.post('/', protect, roleCheck('admin'), createQuestion);
router.put('/:id', protect, roleCheck('admin'), updateQuestion);
router.delete('/:id', protect, roleCheck('admin'), deleteQuestion);

export default router;

import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getProfile, updateProfile, saveSolvedQuestion, getSolvedQuestions
} from '../controllers/userController.js';

const router = express.Router();

// ─── User Profile Routes ────────────────────────────
// GET    /api/users/me                → Get current user's profile
// PUT    /api/users/me                → Update profile (name, skills, resume, etc.)
// POST   /api/users/solved-questions  → Save a solved question
// GET    /api/users/solved-questions  → Get list of solved questions

router.use(protect); // All routes require authentication

router.route('/me')
  .get(getProfile)
  .put(updateProfile);

router.route('/solved-questions')
  .get(getSolvedQuestions)
  .post(saveSolvedQuestion);

export default router;

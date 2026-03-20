import express from 'express';
import User from '../models/User.js';
import Question from '../models/Question.js';
import TestAttempt from '../models/TestAttempt.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', protect, roleCheck('admin'), async (req, res) => {
  try {
    const [totalUsers, totalCandidates, totalRecruiters, totalQuestions, totalTests] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'recruiter' }),
      Question.countDocuments(),
      TestAttempt.distinct('testSessionId').then((s) => s.length),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalQuestions,
        totalTests,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/users
router.get('/users', protect, roleCheck('admin'), async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

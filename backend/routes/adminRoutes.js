import express from 'express';
import User from '../models/User.js';
import Question from '../models/Question.js';
import TestAttempt from '../models/TestAttempt.js';
import Company from '../models/Company.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', protect, roleCheck('admin'), async (req, res) => {
  try {
    const [totalUsers, totalCandidates, totalRecruiters, totalQuestions, totalTests, totalCompanies] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'recruiter' }),
      Question.countDocuments(),
      TestAttempt.distinct('testSessionId').then((s) => s.length),
      Company.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalQuestions,
        totalTests,
        totalCompanies,
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

// ─── Company Management ──────────────────────────────

// GET /api/admin/companies
router.get('/companies', protect, roleCheck('admin'), async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/companies
router.post('/companies', protect, roleCheck('admin'), async (req, res) => {
  try {
    const { name, description, industry, website } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }

    const existing = await Company.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Company already exists' });
    }

    const company = await Company.create({
      name: name.trim(),
      description: description || '',
      industry: industry || '',
      website: website || '',
    });

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/admin/companies/:id
router.put('/companies/:id', protect, roleCheck('admin'), async (req, res) => {
  try {
    const { name, description, industry, website, isActive } = req.body;
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (name !== undefined) company.name = name.trim();
    if (description !== undefined) company.description = description;
    if (industry !== undefined) company.industry = industry;
    if (website !== undefined) company.website = website;
    if (isActive !== undefined) company.isActive = isActive;
    await company.save();

    res.json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/companies/:id
router.delete('/companies/:id', protect, roleCheck('admin'), async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.json({ success: true, message: 'Company deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

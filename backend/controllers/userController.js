import User from '../models/User.js';
import { AppError, catchAsync } from '../utils/appError.js';

// ─── User Profile Controller ────────────────────────
// Handles user profile viewing and updating.

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Authenticated
export const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      company: user.company,
      phone: user.phone,
      resumeUrl: user.resumeUrl,
      interviewStatus: user.interviewStatus,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Authenticated
export const updateProfile = catchAsync(async (req, res) => {
  // Fields candidates/recruiters are allowed to update
  const allowedFields = ['name', 'phone', 'skills', 'resumeUrl', 'company'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Prevent empty updates
  if (Object.keys(updates).length === 0) {
    throw new AppError('No valid fields to update', 400);
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      company: user.company,
      phone: user.phone,
      resumeUrl: user.resumeUrl,
      interviewStatus: user.interviewStatus,
    },
  });
});

// @desc    Save a solved question to user's record
// @route   POST /api/users/solved-questions
// @access  Candidate only
export const saveSolvedQuestion = catchAsync(async (req, res) => {
  const { questionId } = req.body;
  if (!questionId) throw new AppError('questionId is required', 400);

  const user = await User.findById(req.user._id);

  // Use the solvedQuestions array (added to model below)
  if (!user.solvedQuestions) user.solvedQuestions = [];
  if (user.solvedQuestions.includes(questionId)) {
    throw new AppError('Question already marked as solved', 400);
  }

  user.solvedQuestions.push(questionId);
  await user.save();

  res.json({
    success: true,
    message: 'Question marked as solved',
    data: { solvedQuestions: user.solvedQuestions },
  });
});

// @desc    Get user's solved questions
// @route   GET /api/users/solved-questions
// @access  Candidate only
export const getSolvedQuestions = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('solvedQuestions', 'title difficulty topic company');

  res.json({
    success: true,
    data: user.solvedQuestions || [],
  });
});

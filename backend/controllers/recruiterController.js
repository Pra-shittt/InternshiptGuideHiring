import User from '../models/User.js';
import TestAttempt from '../models/TestAttempt.js';
import Interview from '../models/Interview.js';

// GET /api/recruiter/candidates
// Only show candidates that this recruiter has scheduled interviews with
export const getCandidates = async (req, res) => {
  try {
    // Find all candidate IDs that this recruiter has interviews with
    const interviewedCandidateIds = await Interview.distinct('candidateId', {
      recruiterId: req.user._id,
    });

    // If recruiter has no interviews yet, return empty list
    if (interviewedCandidateIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const candidates = await User.find({
      _id: { $in: interviewedCandidateIds },
      role: 'candidate',
    }).select('-password');

    // Get scores for each candidate
    const candidateData = await Promise.all(
      candidates.map(async (candidate) => {
        const stats = await TestAttempt.aggregate([
          { $match: { userId: candidate._id } },
          {
            $group: {
              _id: null,
              totalAttempts: { $sum: 1 },
              totalCorrect: { $sum: { $cond: ['$isCorrect', 1, 0] } },
              totalScore: { $sum: '$score' },
            },
          },
        ]);

        const s = stats[0] || { totalAttempts: 0, totalCorrect: 0, totalScore: 0 };

        return {
          id: candidate._id,
          name: candidate.name,
          email: candidate.email,
          resumeUrl: candidate.resumeUrl,
          createdAt: candidate.createdAt,
          interviewStatus: candidate.interviewStatus,
          skills: candidate.skills || [],
          totalAttempts: s.totalAttempts,
          totalScore: s.totalScore,
          avgScore: s.totalAttempts > 0
            ? Math.round((s.totalCorrect / s.totalAttempts) * 100)
            : 0,
        };
      })
    );

    res.json({ success: true, data: candidateData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/recruiter/candidates/:id
export const getCandidatePerformance = async (req, res) => {
  try {
    // Ensure this recruiter has an interview with this candidate
    const hasAccess = await Interview.findOne({
      recruiterId: req.user._id,
      candidateId: req.params.id,
    });

    if (!hasAccess) {
      return res.status(403).json({ success: false, message: 'Access denied — this candidate is not assigned to you' });
    }

    const candidate = await User.findById(req.params.id).select('-password');
    if (!candidate || candidate.role !== 'candidate') {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const stats = await TestAttempt.aggregate([
      { $match: { userId: candidate._id } },
      {
        $group: {
          _id: '$testSessionId',
          totalQuestions: { $sum: 1 },
          correctAnswers: { $sum: { $cond: ['$isCorrect', 1, 0] } },
          totalScore: { $sum: '$score' },
          createdAt: { $first: '$createdAt' },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        candidate: {
          id: candidate._id,
          name: candidate.name,
          email: candidate.email,
          resumeUrl: candidate.resumeUrl,
        },
        testHistory: stats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/recruiter/interviews
export const scheduleInterview = async (req, res) => {
  try {
    const { candidateId, scheduledAt } = req.body;

    const candidate = await User.findById(candidateId);
    if (!candidate || candidate.role !== 'candidate') {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const interview = await Interview.create({
      candidateId,
      recruiterId: req.user._id,
      scheduledAt: new Date(scheduledAt),
    });

    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/recruiter/interviews
export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ recruiterId: req.user._id })
      .populate('candidateId', 'name email')
      .sort({ scheduledAt: -1 });

    res.json({ success: true, data: interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/recruiter/all-candidates  — fetch all candidates (for scheduling dropdown)
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await User.find({ role: 'candidate' }).select('name email _id');
    res.json({
      success: true,
      data: candidates.map((c) => ({ id: c._id, name: c.name, email: c.email })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

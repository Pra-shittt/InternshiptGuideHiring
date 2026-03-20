import User from '../models/User.js';
import Interview from '../models/Interview.js';
import TestAttempt from '../models/TestAttempt.js';
import Assessment from '../models/Assessment.js';

// GET /api/recruiter/analytics
export const getRecruiterAnalytics = async (req, res) => {
  try {
    // Hiring funnel data
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const interviewed = await Interview.distinct('candidateId', { recruiterId: req.user._id });
    const selected = await Interview.countDocuments({ recruiterId: req.user._id, result: 'selected' });
    const rejected = await Interview.countDocuments({ recruiterId: req.user._id, result: 'rejected' });
    const pending = await Interview.countDocuments({ recruiterId: req.user._id, result: 'pending' });

    // Skill distribution
    const skillAgg = await User.aggregate([
      { $match: { role: 'candidate' } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // Interview success rate
    const totalCompleted = selected + rejected;
    const successRate = totalCompleted > 0 ? Math.round((selected / totalCompleted) * 100) : 0;

    // Monthly interviews
    const monthlyInterviews = await Interview.aggregate([
      { $match: { recruiterId: req.user._id } },
      {
        $group: {
          _id: { $month: '$scheduledAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    res.json({
      success: true,
      data: {
        hiringFunnel: {
          applied: totalCandidates,
          interviewed: interviewed.length,
          selected,
          rejected,
          pending,
        },
        skillDistribution: skillAgg.map((s) => ({ skill: s._id, count: s.count })),
        interviewSuccessRate: successRate,
        totalInterviews: await Interview.countDocuments({ recruiterId: req.user._id }),
        monthlyInterviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import TestAttempt from '../models/TestAttempt.js';

// GET /api/performance/summary
export const getPerformanceSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total tests (distinct sessions)
    const sessions = await TestAttempt.distinct('testSessionId', { userId });
    const totalTests = sessions.length;

    // Overall stats
    const overallStats = await TestAttempt.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          totalCorrect: { $sum: { $cond: ['$isCorrect', 1, 0] } },
          totalScore: { $sum: '$score' },
        },
      },
    ]);

    const stats = overallStats[0] || { totalAttempts: 0, totalCorrect: 0, totalScore: 0 };
    const avgScore = stats.totalAttempts > 0
      ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100)
      : 0;

    // Topic-wise performance (weak topics analysis)
    const topicStats = await TestAttempt.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'questions',
          localField: 'questionId',
          foreignField: '_id',
          as: 'question',
        },
      },
      { $unwind: '$question' },
      {
        $group: {
          _id: '$question.topic',
          total: { $sum: 1 },
          correct: { $sum: { $cond: ['$isCorrect', 1, 0] } },
        },
      },
      {
        $project: {
          topic: '$_id',
          total: 1,
          correct: 1,
          accuracy: {
            $round: [{ $multiply: [{ $divide: ['$correct', '$total'] }, 100] }, 0],
          },
          _id: 0,
        },
      },
      { $sort: { accuracy: 1 } },
    ]);

    // Weak topics (accuracy < 60%)
    const weakTopics = topicStats.filter((t) => t.accuracy < 60);
    const strongTopics = topicStats.filter((t) => t.accuracy >= 60).sort((a, b) => b.accuracy - a.accuracy);

    // Recent activity (last 10 attempts grouped by session)
    const recentActivity = await TestAttempt.aggregate([
      { $match: { userId } },
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
      { $limit: 10 },
      {
        $project: {
          testSessionId: '$_id',
          totalQuestions: 1,
          correctAnswers: 1,
          totalScore: 1,
          percentage: {
            $round: [{ $multiply: [{ $divide: ['$correctAnswers', '$totalQuestions'] }, 100] }, 0],
          },
          createdAt: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalTests,
        totalScore: stats.totalScore,
        avgScore,
        topicStats,
        weakTopics,
        strongTopics,
        recentActivity,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

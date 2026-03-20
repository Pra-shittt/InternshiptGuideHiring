import TestAttempt from '../models/TestAttempt.js';
import User from '../models/User.js';

// GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await TestAttempt.aggregate([
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          totalAttempts: { $sum: 1 },
          totalCorrect: { $sum: { $cond: ['$isCorrect', 1, 0] } },
          testsTaken: { $addToSet: '$testSessionId' },
        },
      },
      {
        $addFields: {
          testCount: { $size: '$testsTaken' },
          accuracy: {
            $round: [{ $multiply: [{ $divide: ['$totalCorrect', '$totalAttempts'] }, 100] }, 0],
          },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          email: '$user.email',
          totalScore: 1,
          testCount: 1,
          accuracy: 1,
          totalCorrect: 1,
          totalAttempts: 1,
        },
      },
    ]);

    // Add rank
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

    res.json({ success: true, data: rankedLeaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

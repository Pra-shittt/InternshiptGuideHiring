import crypto from 'crypto';
import Question from '../models/Question.js';
import TestAttempt from '../models/TestAttempt.js';

// POST /api/tests/start
export const startTest = async (req, res) => {
  try {
    const { count = 10, company, topic, difficulty } = req.body;
    const filter = { type: 'MCQ' };

    if (company) filter.company = { $regex: company, $options: 'i' };
    if (topic) filter.topic = { $regex: topic, $options: 'i' };
    if (difficulty) filter.difficulty = difficulty;

    // Randomly select questions
    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(count) } },
      {
        $project: {
          title: 1,
          company: 1,
          topic: 1,
          difficulty: 1,
          type: 1,
          questionText: 1,
          options: 1,
          // Don't send correctAnswer to client
        },
      },
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ success: false, message: 'No questions found matching criteria' });
    }

    const testSessionId = crypto.randomUUID();

    res.json({
      success: true,
      data: {
        testSessionId,
        questions,
        totalQuestions: questions.length,
        timeLimit: questions.length * 60, // 1 minute per question (in seconds)
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/tests/submit
export const submitTest = async (req, res) => {
  try {
    const { testSessionId, answers } = req.body;
    // answers = [{ questionId, selectedAnswer }]

    if (!testSessionId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'testSessionId and answers array are required' });
    }

    const questionIds = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    let correctCount = 0;
    const attempts = [];

    for (const answer of answers) {
      const question = questionMap[answer.questionId];
      if (!question) continue;

      const isCorrect = question.type === 'MCQ' && question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) correctCount++;

      attempts.push({
        userId: req.user._id,
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        type: question.type,
        status: answer.selectedAnswer ? 'SOLVED' : 'ATTEMPTED',
        score: isCorrect ? 10 : 0,
        testSessionId,
      });
    }

    await TestAttempt.insertMany(attempts);

    const totalScore = correctCount * 10;
    const percentage = Math.round((correctCount / answers.length) * 100);

    res.json({
      success: true,
      data: {
        testSessionId,
        totalQuestions: answers.length,
        correctAnswers: correctCount,
        wrongAnswers: answers.length - correctCount,
        totalScore,
        percentage,
        // Send correct answers for review
        results: answers.map((a) => {
          const q = questionMap[a.questionId];
          return {
            questionId: a.questionId,
            title: q?.title,
            selectedAnswer: a.selectedAnswer,
            correctAnswer: q?.correctAnswer,
            isCorrect: q?.correctAnswer === a.selectedAnswer,
            explanation: q?.explanation,
          };
        }),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tests/attempts
export const getAttempts = async (req, res) => {
  try {
    // Get distinct test sessions for this user
    const sessions = await TestAttempt.aggregate([
      { $match: { userId: req.user._id } },
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

    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

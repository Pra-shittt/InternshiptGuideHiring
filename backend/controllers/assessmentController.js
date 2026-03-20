import Assessment from '../models/Assessment.js';

// POST /api/assessments - Submit a coding assessment
export const submitAssessment = async (req, res) => {
  try {
    const { title, type, score, maxScore, code, language } = req.body;

    const assessment = await Assessment.create({
      candidateId: req.user._id,
      title,
      type: type || 'coding',
      score,
      maxScore: maxScore || 100,
      code: code || '',
      language: language || 'javascript',
    });

    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/assessments - Get all assessments for current user
export const getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ candidateId: req.user._id })
      .sort({ submittedAt: -1 });

    res.json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/assessments/candidate/:id - Get assessments for a specific candidate (recruiter)
export const getCandidateAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ candidateId: req.params.id })
      .sort({ submittedAt: -1 });

    res.json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import Interview from '../models/Interview.js';
import User from '../models/User.js';
import crypto from 'crypto';

// POST /api/interviews/:id/start - Start an interview (generate meeting room)
export const startInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const meetingRoomId = `room_${crypto.randomBytes(8).toString('hex')}`;
    interview.meetingRoomId = meetingRoomId;
    interview.status = 'IN_PROGRESS';
    await interview.save();

    // Update candidate status
    await User.findByIdAndUpdate(interview.candidateId, { interviewStatus: 'in-interview' });

    res.json({
      success: true,
      data: {
        interviewId: interview._id,
        meetingRoomId,
        candidateId: interview.candidateId,
        recruiterId: interview.recruiterId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/interviews/:id/notes - Save interview notes & rating
export const saveNotes = async (req, res) => {
  try {
    const { notes, rating } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    if (notes !== undefined) interview.notes = notes;
    if (rating !== undefined) interview.rating = rating;
    await interview.save();

    res.json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/interviews/:id/end - End interview with result
export const endInterview = async (req, res) => {
  try {
    const { result, notes, rating } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    interview.status = 'COMPLETED';
    if (result) interview.result = result;
    if (notes) interview.notes = notes;
    if (rating) interview.rating = rating;
    await interview.save();

    // Update candidate status
    const newStatus = result === 'selected' ? 'hired' : result === 'rejected' ? 'rejected' : 'available';
    await User.findByIdAndUpdate(interview.candidateId, { interviewStatus: newStatus });

    res.json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/interviews/:id - Get interview by ID
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidateId', 'name email skills resumeUrl')
      .populate('recruiterId', 'name email company');

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    res.json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/interviews/candidate/upcoming - Get candidate's upcoming interviews
export const getCandidateInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      candidateId: req.user._id,
      status: { $in: ['SCHEDULED', 'IN_PROGRESS'] },
    })
      .populate('recruiterId', 'name email company')
      .sort({ scheduledAt: 1 });

    res.json({ success: true, data: interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

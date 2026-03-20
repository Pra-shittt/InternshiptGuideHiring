import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Assessment title is required'],
  },
  type: {
    type: String,
    enum: ['coding', 'mcq'],
    default: 'coding',
  },
  score: {
    type: Number,
    required: true,
  },
  maxScore: {
    type: Number,
    default: 100,
  },
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: 'javascript',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

assessmentSchema.index({ candidateId: 1, submittedAt: -1 });

const Assessment = mongoose.model('Assessment', assessmentSchema);
export default Assessment;

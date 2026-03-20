import mongoose from 'mongoose';

const testAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  selectedAnswer: {
    type: String,
    default: null,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['MCQ', 'CODING'],
    required: true,
  },
  status: {
    type: String,
    enum: ['SOLVED', 'ATTEMPTED'],
    default: 'ATTEMPTED',
  },
  score: {
    type: Number,
    default: 0,
  },
  testSessionId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

testAttemptSchema.index({ userId: 1, testSessionId: 1 });
testAttemptSchema.index({ userId: 1, createdAt: -1 });

const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);
export default TestAttempt;

import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
    trim: true,
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty is required'],
  },
  type: {
    type: String,
    enum: ['MCQ', 'CODING'],
    required: [true, 'Type is required'],
  },
  // MCQ-specific fields
  questionText: {
    type: String,
    default: null,
  },
  options: {
    type: [String],
    default: [],
  },
  correctAnswer: {
    type: String,
    default: null,
  },
  explanation: {
    type: String,
    default: null,
  },
  // Detailed description of the problem
  description: {
    type: String,
    default: '',
  },
  // Additional company tags (question may be asked by multiple companies)
  companyTags: {
    type: [String],
    default: [],
  },
  // CODING-specific fields
  platform: {
    type: String,
    enum: ['LeetCode', 'GFG', 'CodeChef', null],
    default: null,
  },
  // LeetCode or other platform URL — also accessible as 'leetcodeLink'
  link: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Index for common query patterns
questionSchema.index({ company: 1, topic: 1, difficulty: 1, type: 1 });

const Question = mongoose.model('Question', questionSchema);
export default Question;

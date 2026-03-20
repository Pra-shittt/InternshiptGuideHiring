import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter', 'admin'],
    default: 'candidate',
  },
  skills: {
    type: [String],
    default: [],
  },
  company: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  interviewStatus: {
    type: String,
    enum: ['available', 'in-interview', 'hired', 'rejected'],
    default: 'available',
  },
  resumeUrl: {
    type: String,
    default: null,
  },
  // Track which coding questions the candidate has solved
  solvedQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
  // Short bio or about section
  bio: {
    type: String,
    default: '',
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;

import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Scheduled date/time is required'],
  },
  meetingRoomId: {
    type: String,
    default: null,
  },
  notes: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  result: {
    type: String,
    enum: ['pending', 'selected', 'rejected'],
    default: 'pending',
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'SCHEDULED',
  },
}, {
  timestamps: true,
});

interviewSchema.index({ recruiterId: 1, scheduledAt: -1 });
interviewSchema.index({ candidateId: 1, scheduledAt: -1 });

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;

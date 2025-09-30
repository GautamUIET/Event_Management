import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    lowercase: true
  },
  phone: {
    type: String,
  },
  department: {
    type: String,
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });
registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

export default Registration;
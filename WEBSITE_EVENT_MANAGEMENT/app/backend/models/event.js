const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  date: {
    type: String, 
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  endTime: {
    type: String,
    required: [true, 'Event end time is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: [
      'Technology',
      'Sports', 
      'Education',
      'Arts & Culture',
      'Business',
      'Social',
      'Workshop',
      'Conference',
      'Seminar',
      'Networking'
    ]
  },
  organizer: {
    type: String,
    required: [true, 'Organizer name is required'],
    trim: true
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrationCount: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  price: {
    type: String,
    default: 'Free'
  },
  requirements: [{
    type: String,
    trim: true
  }],
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required']
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  }
}, {
  timestamps: true
});

eventSchema.methods.updateRegistrationCount = async function() {
  const Registration = mongoose.model('Registration');
  const count = await Registration.countDocuments({ 
    eventId: this._id
  });
  this.registrationCount = count;
  await this.save();
};

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
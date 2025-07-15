const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  workshopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop', // the name the related Model is registered with
    required: true
  },
  sequenceId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  speaker: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true, // assuming duration is in hours
    min: 0.25        // optional: 15 minutes as minimum
  },
  level: {
    type: String,
    enum: ['Basic', 'Intermediate', 'Advanced'],
    required: true
  },
  abstract: {
    type: String,
    required: true,
    maxlength: 1024
  },
  upvoteCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Session', sessionSchema);
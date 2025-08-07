 const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Submitted', 'Not Submitted'],
    required: true
  },
  deadline: {
    type: String,
    default: 'N/A'
  }
});

const StatusSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  assignments: {
    type: [AssignmentSchema],
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Status', StatusSchema);

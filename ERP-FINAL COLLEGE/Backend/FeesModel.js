 const mongoose = require('mongoose');

const StudentFeeSchema = new mongoose.Schema({
  student: {
    type: String,
    required: true
  },
  roll: {
  type: String,
  required: true
},

  semester: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  paid: {
    type: Number,
    default: 0
  },
  due: {
    type: Number,
    required: true
  },
  action: {
    type: String,
    enum: ['Paid', 'Partial', 'Unpaid'],
    default: 'Unpaid'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Optional: prevent duplicate roll-semester entries
StudentFeeSchema.index({ roll: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('StudentFee', StudentFeeSchema);

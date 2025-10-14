const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job_listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resume_link: {
    type: String,
    trim: true,
  },
  cover_letter: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
}, { timestamps:true });

module.exports = mongoose.model('Application', applicationSchema);

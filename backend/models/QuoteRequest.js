import mongoose from 'mongoose';

const quoteRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  project_details: {
    type: String
  },
  budget_range: {
    type: String
  },
  timeline: {
    type: String
  },
  is_read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('QuoteRequest', quoteRequestSchema);

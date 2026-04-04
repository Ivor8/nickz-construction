import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  client_name: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review_text: {
    type: String,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  image_url: {
    type: String
  },
  is_approved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Review', reviewSchema);

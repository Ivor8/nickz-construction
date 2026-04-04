import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  short_description: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  process_steps: [{
    type: String
  }],
  icon: {
    type: String,
    default: 'building'
  },
  sort_order: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create slug from title
serviceSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

export default mongoose.model('Service', serviceSchema);

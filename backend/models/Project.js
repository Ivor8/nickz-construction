import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: ['Residential', 'Commercial', 'Infrastructure', 'Industrial', 'Institutional']
  },
  short_description: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  highlights: [{
    type: String
  }],
  images: [{
    type: String
  }],
  is_featured: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  completed_date: {
    type: Date
  }
}, {
  timestamps: true
});

// Create slug from title
projectSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

export default mongoose.model('Project', projectSchema);

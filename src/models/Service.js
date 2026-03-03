import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  category: {
    type: String,
    enum: ['graphic', 'printing', 'branding'],
    required: [true, 'Service category is required']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true
  },
  fullDescription: {
    type: String,
    trim: true
  },
  pricing: {
    basic: {
      price: Number,
      features: [String]
    },
    standard: {
      price: Number,
      features: [String]
    },
    premium: {
      price: Number,
      features: [String]
    }
  },
  images: [{
    url: String,
    alt: String
  }],
  imageCards: [{
    title: String,
    description: String,
    image: String
  }],
  metaData: {
    keywords: [String],
    seoDescription: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for faster queries
ServiceSchema.index({ slug: 1, category: 1 });

const Service = mongoose.model('Service', ServiceSchema);

export default Service;

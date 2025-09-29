import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent' | 'event';
  priority: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  isPinned: boolean;
  visibility: 'public' | 'registered' | 'admin';
  author: string; // Admin username or ID
  tags?: string[];
  actionButton?: {
    text: string;
    url: string;
    style: 'primary' | 'secondary' | 'outline';
  };
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'urgent', 'event'],
    default: 'info'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum: ['public', 'registered', 'admin'],
    default: 'public'
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  actionButton: {
    type: {
      text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
      },
      url: {
        type: String,
        required: true,
        trim: true
      },
      style: {
        type: String,
        enum: ['primary', 'secondary', 'outline'],
        default: 'primary'
      }
    },
    default: null,
    _id: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
AnnouncementSchema.index({ isActive: 1, isPinned: 1, priority: 1 });
AnnouncementSchema.index({ visibility: 1, isActive: 1 });

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);

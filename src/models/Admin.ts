import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  password: string;
  email: string;
  role: 'super_admin' | 'admin';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes are automatically created by unique: true in field definitions
// No need for explicit index creation

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

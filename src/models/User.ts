import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  clerkId?: string;
  username?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        // Indian phone number validation: +91 followed by 10 digits (with or without spaces)
        const cleaned = v.replace(/\s+/g, ''); // Remove all spaces
        return /^\+91[6-9]\d{9}$/.test(cleaned);
      },
      message: 'Please enter a valid Indian phone number with +91 prefix'
    }
  },
  clerkId: {
    type: String,
    unique: true,
    sparse: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

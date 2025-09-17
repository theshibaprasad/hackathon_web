import mongoose, { Document, Schema } from 'mongoose';

export interface ITempRegistration extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  otp: string;
  otpExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TempRegistrationSchema: Schema = new Schema({
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
  otp: {
    type: String,
    required: true
  },
  otpExpiry: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Add TTL index to automatically delete documents after 5 minutes
TempRegistrationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export default mongoose.models.TempRegistration || mongoose.model<ITempRegistration>('TempRegistration', TempRegistrationSchema);

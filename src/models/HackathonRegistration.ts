import mongoose, { Document, Schema } from 'mongoose';

export interface IHackathonRegistration extends Document {
  userId: string;
  hackathonId: string;
  registrationDate: Date;
  status: 'registered' | 'cancelled';
  teamId?: string;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HackathonRegistrationSchema: Schema = new Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  hackathonId: {
    type: String,
    required: [true, 'Hackathon ID is required']
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'cancelled'],
    default: 'registered'
  },
  teamId: {
    type: String,
    required: false
  },
  projectId: {
    type: String,
    required: false
  }
}, {
  timestamps: true,
  // Prevent automatic collection creation
  collection: 'hackathonregistrations',
  // Only create collection when explicitly needed
  autoCreate: false
});

// Create compound index to ensure one registration per user per hackathon
HackathonRegistrationSchema.index({ userId: 1, hackathonId: 1 }, { unique: true });

export default mongoose.models.HackathonRegistration || mongoose.model<IHackathonRegistration>('HackathonRegistration', HackathonRegistrationSchema);



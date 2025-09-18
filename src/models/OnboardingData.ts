import mongoose, { Document, Schema } from 'mongoose';

export interface IOnboardingData extends Document {
  userId: string;
  profession: 'student' | 'working_professional';
  
  // Common fields
  gender?: string;
  city: string;
  state: string;
  pin: string;
  
  // Student specific fields
  instituteName?: string;
  degree?: string;
  branch?: string;
  yearOfStudy?: string;
  graduationYear?: string;
  
  // Working Professional specific fields
  companyName?: string;
  jobTitle?: string;
  yearsOfExperience?: string;
  
  // Hackathon preferences
  selectedThemes: string[];
  selectedProblemStatements: string[];
  
  // Payment details
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentAmount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  isEarlyBird: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const OnboardingDataSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    ref: 'User'
  },
  profession: {
    type: String,
    required: true,
    enum: ['student', 'working_professional']
  },
  
  // Common fields
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pin: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^\d{6}$/.test(v);
      },
      message: 'PIN must be a 6-digit number'
    }
  },
  
  // Student specific fields
  instituteName: {
    type: String,
    trim: true
  },
  degree: {
    type: String,
    trim: true
  },
  branch: {
    type: String,
    trim: true
  },
  yearOfStudy: {
    type: String,
    trim: true
  },
  graduationYear: {
    type: String,
    trim: true
  },
  
  // Working Professional specific fields
  companyName: {
    type: String,
    trim: true
  },
  jobTitle: {
    type: String,
    trim: true
  },
  yearsOfExperience: {
    type: String,
    trim: true
  },
  
  // Hackathon preferences
  selectedThemes: [{
    type: String,
    trim: true
  }],
  selectedProblemStatements: [{
    type: String,
    trim: true
  }],
  
  // Payment details
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    required: true
  },
  razorpayOrderId: {
    type: String,
    trim: true
  },
  razorpayPaymentId: {
    type: String,
    trim: true
  },
  razorpaySignature: {
    type: String,
    trim: true
  },
  isEarlyBird: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.OnboardingData || mongoose.model<IOnboardingData>('OnboardingData', OnboardingDataSchema);

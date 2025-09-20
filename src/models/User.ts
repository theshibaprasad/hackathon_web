import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  clerkId?: string;
  username?: string;
  isBoarding: boolean;
  
  // Google OAuth fields
  googleId?: string;
  isGoogleUser?: boolean;
  
  // Firebase Auth fields
  firebaseUid?: string;
  
  // Onboarding data fields
  profession?: 'student' | 'working_professional';
  gender?: string;
  city?: string;
  state?: string;
  pin?: string;
  
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
  
  // Team information
  teamName?: string;
  isTeamLeader?: boolean;
  
  // Hackathon preferences
  selectedThemes?: string[];
  selectedProblemStatements?: string[];
  
  // Payment details
  paymentStatus?: 'pending' | 'completed' | 'failed';
  paymentAmount?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  isEarlyBird?: boolean;
  
  // Password reset fields
  resetPasswordOTP?: string;
  resetPasswordOTPExpiry?: Date;
  
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
    required: function(this: IUser) {
      return !this.isGoogleUser; // Password not required for Google users
    },
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
    required: function(this: IUser) {
      return !this.isGoogleUser; // Phone number not required for Google users initially
    },
    unique: true,
    sparse: true, // Allow multiple null values
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Allow empty for Google users
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
  },
  
  // Google OAuth fields
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  
  // Firebase Auth fields
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true
  },
  isBoarding: {
    type: Boolean,
    default: false
  },
  
  // Onboarding data fields
  profession: {
    type: String,
    enum: ['student', 'working_professional']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  pin: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^\d{6}$/.test(v);
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
  
  // Team information
  teamName: {
    type: String,
    trim: true
  },
  isTeamLeader: {
    type: Boolean,
    default: false
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
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number
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
  },
  
  // Password reset fields
  resetPasswordOTP: {
    type: String,
    trim: true
  },
  resetPasswordOTPExpiry: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

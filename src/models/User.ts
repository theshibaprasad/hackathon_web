import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  otpVerified: boolean;
  
  // User type
  userType: 'student' | 'professional';
  
  // Education details (for students) - ROLE-BASED NESTED STRUCTURE
  education?: {
    instituteName: string;
    branch: string;
    degree: string;
    graduationYear: string;
    yearOfStudy: string;
    city: string;
    state: string;
    pin: string;
  };
  
  // Job details (for professionals) - ROLE-BASED NESTED STRUCTURE
  job?: {
    jobTitle: string;
    company: string;
    yearOfExperience: string;
    city: string;
    state: string;
    pin: string;
  };
  
  // Team reference
  teamId?: string;
  teamName?: string;
  isTeamLeader?: boolean;
  
  // Legacy fields for backward compatibility
  clerkId?: string;
  username?: string;
  isBoarding: boolean;
  
  // Google OAuth fields
  googleId?: string;
  isGoogleUser?: boolean;
  
  // Firebase Auth fields
  firebaseUid?: string;
  
  // Legacy onboarding fields (to be migrated)
  profession?: 'student' | 'working_professional';
  gender?: string;
  city?: string;
  state?: string;
  pin?: string;
  instituteName?: string;
  degree?: string;
  branch?: string;
  yearOfStudy?: string;
  graduationYear?: string;
  companyName?: string;
  jobTitle?: string;
  yearsOfExperience?: string;
  
  // Password reset fields
  resetPasswordOTP?: string;
  resetPasswordOTPExpiry?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
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
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
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
  password: {
    type: String,
    required: function(this: IUser) {
      return !this.isGoogleUser; // Password not required for Google users
    },
    minlength: 6
  },
  otpVerified: {
    type: Boolean,
    default: false
  },
  
  // User type
  userType: {
    type: String,
    enum: ['student', 'professional'],
    required: true
  },
  
  // Education details (for students) - ROLE-BASED NESTED STRUCTURE
  education: {
    type: {
      instituteName: {
        type: String,
        trim: true
      },
      branch: {
        type: String,
        trim: true
      },
      degree: {
        type: String,
        trim: true
      },
      graduationYear: {
        type: String,
        trim: true
      },
      yearOfStudy: {
        type: String,
        trim: true
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
      }
    },
    default: {},
    _id: false
  },
  
  // Job details (for professionals) - ROLE-BASED NESTED STRUCTURE
  job: {
    type: {
      jobTitle: {
        type: String,
        trim: true
      },
      company: {
        type: String,
        trim: true
      },
      yearOfExperience: {
        type: String,
        trim: true
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
      }
    },
    default: {},
    _id: false
  },
  
  // Team reference
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    default: null
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
  
  // Legacy address fields for backward compatibility
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
  
  // Team information
  teamName: {
    type: String,
    trim: true
  },
  isTeamLeader: {
    type: Boolean,
    default: function(this: IUser) {
      // User is team leader if they have a teamId and are the leader of that team
      return !!this.teamId;
    }
  },
  
  // Legacy onboarding fields
  profession: {
    type: String,
    enum: ['student', 'working_professional']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
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

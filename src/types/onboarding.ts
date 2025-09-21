// Form data interface without Mongoose Document properties - ROLE-BASED NESTED STRUCTURE
export interface OnboardingFormData {
  userId: string;
  
  // User type and basic info
  userType: 'student' | 'professional';
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  
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
  
  // Team information
  teamName?: string;
  teamId?: string;
  isTeamLeader?: boolean;
  themeId?: string;
  problemId?: string;
  
  // Payment information (handled separately in Payment collection)
  paymentAmount?: number;
  isEarlyBird?: boolean;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  
  // Legacy fields for backward compatibility
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
}
